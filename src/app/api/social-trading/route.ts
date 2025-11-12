import { NextResponse } from "next/server"
import { load } from "cheerio"
import { Script } from "vm"

export const runtime = "nodejs"

const SOURCE_URL = "https://my.socialtradertools.com/view/MyimZHO9sgMkMxiw"
const ONE_DAY_MS = 24 * 60 * 60 * 1000

type ChartPoint = { date: string; value: number }

type SocialTradingSnapshot = {
  source: string
  fetchedAt: string
  accountDetails: Record<string, string | null>
  tradingStats: Record<string, string | null>
  accountInfo: Record<string, string | null>
  chart: {
    growth: ChartPoint[]
  }
  meta: {
    updatedAt: string | null
  }
}

let cachedData: SocialTradingSnapshot | null = null
let cacheTimestamp = 0

const clean = (value: string | undefined | null) => {
  if (!value) return null
  const normalized = value.replace(/\s+/g, " ").trim()
  if (!normalized) return null
  if (/<[a-z][^>]*>/i.test(normalized)) return null
  return normalized
}

const findExactText = (selector: string, label: string, $: cheerio.CheerioAPI) =>
  $(selector)
    .filter((_, el) => clean($(el).text()) === label)
    .first()

const extractMetric = (label: string, $: cheerio.CheerioAPI) => {
  const candidates = [
    findExactText("*", label, $),
    findExactText("h1,h2,h3,h4,h5,h6,span,strong,p,div,td,th", label, $),
  ]

  for (const node of candidates) {
    if (!node || !node.length) continue

    const nextStrong = node.nextAll("strong, span, div").filter((_, el) => clean($(el).text())).first()
    if (nextStrong.length) return clean(nextStrong.text())

    const parentStrong = node
      .parent()
      .find("strong, span")
      .filter((_, el) => {
        const text = clean($(el).text())
        return text && text !== label
      })
      .first()
    if (parentStrong.length) return clean(parentStrong.text())

    const siblingText = clean(node.next().text())
    if (siblingText) return siblingText
  }

  return null
}

const parseDataTable = (table: cheerio.Cheerio<cheerio.Element>, $: cheerio.CheerioAPI) => {
  const entries: Record<string, string | null> = {}

  table.find("tr").each((_, row) => {
    const cells = $(row).find("td,th")
    if (cells.length >= 2) {
      const key = clean(cells.eq(0).text())
      const value = clean(cells.eq(1).text())
      if (key) entries[key] = value
    }
    if (cells.length >= 4) {
      const key2 = clean(cells.eq(2).text())
      const value2 = clean(cells.eq(3).text())
      if (key2) entries[key2] = value2
    }
  })

  return entries
}

const extractTableMetric = (
  label: string,
  tables: cheerio.Cheerio<cheerio.Element>,
  fallback: (label: string) => string | null
) => {
  const lowerLabel = label.toLowerCase()
  for (let i = 0; i < tables.length; i++) {
    const table = tables.eq(i)
    const cell = table
      .find("td,th")
      .filter((_, el) => clean(table.find(el).text())?.toLowerCase().startsWith(lowerLabel))
      .first()

    if (cell.length) {
      const value =
        clean(cell.next("td").text()) ??
        clean(cell.next().text())
      if (value) return value
    }
  }

  return fallback(label)
}

const extractGrowthSeries = (html: string): ChartPoint[] => {
  const match = html.match(/var\s+growthData\s*=\s*(\[[\s\S]*?\]);/)
  if (!match) return []

  try {
    const context: { growthData?: unknown } = {}
    const script = new Script(`growthData = ${match[1]}`)
    script.runInNewContext(context, { timeout: 50 })

    const raw = context.growthData
    if (!Array.isArray(raw)) return []

    const points: ChartPoint[] = []

    for (const series of raw as Array<{ data?: unknown }>) {
      if (!series || typeof series !== "object") continue
      const data = Array.isArray(series.data) ? series.data : []
      for (const entry of data) {
        if (!Array.isArray(entry) || entry.length < 2) continue
        const [rawDate, rawValue] = entry

        const numericValue = Number(rawValue)
        if (!Number.isFinite(numericValue)) continue

        if (typeof rawDate === "string") {
          points.push({ date: rawDate, value: numericValue })
          continue
        }

        const date = new Date(rawDate)
        if (!Number.isNaN(date.getTime())) {
          points.push({ date: date.toISOString().slice(0, 10), value: numericValue })
        }
      }
    }

    return points
      .filter((point, index, self) => index === self.findIndex((p) => p.date === point.date))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  } catch (error) {
    console.error("Failed to parse growth series:", error)
    return []
  }
}

export async function GET() {
  if (cachedData && Date.now() - cacheTimestamp < ONE_DAY_MS) {
    return NextResponse.json({ ...cachedData, cached: true })
  }

  try {
    const response = await fetch(SOURCE_URL, {
      cache: "no-store",
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; TradingPerformanceBot/1.0; +https://trading-performance.local)",
        Accept: "text/html,application/xhtml+xml",
      },
    })

    if (!response.ok) {
      throw new Error(`Upstream responded with status ${response.status}`)
    }

    const html = await response.text()
    const $ = load(html)

    const accountDetailsLabels = ["Growth", "Profit/Loss", "Balance", "Equity", "Equity Percentage"]
    const tradingStatsLabels = [
      "Total Trades",
      "Win %",
      "Loss %",
      "Lots",
      "Best Trade",
      "Worst Trade",
      "Average Win",
      "Average Loss",
      "Longs Won",
      "Shorts Won",
      "Commissions",
      "Swap",
    ]
    const accountInfoLabels = ["Broker", "Broker Server", "Deposits", "Withdrawals", "Application", "Leverage", "Account Type"]

    const tables = $("table")
    const parsedStatsTable = tables.length > 0 ? parseDataTable(tables.eq(0), $) : {}
    const parsedInfoTable = tables.length > 1 ? parseDataTable(tables.eq(1), $) : {}

    const accountDetails = Object.fromEntries(
      accountDetailsLabels.map((label) => [label, extractMetric(label, $)])
    )

    const tradingStats = Object.fromEntries(
      tradingStatsLabels.map((label) => {
        const value =
          parsedStatsTable[label] ??
          extractTableMetric(label, tables, (lbl) => extractMetric(lbl, $))
        return [label, value]
      })
    )

    const accountInfo = Object.fromEntries(
      accountInfoLabels.map((label) => {
        const value =
          parsedInfoTable[label] ??
          extractTableMetric(label, tables, (lbl) => extractMetric(lbl, $))
        return [label, value]
      })
    )

    const updatedAt =
      extractMetric("Updated", $) ??
      (() => {
        const match = html.match(/Updated:\s*([0-9\-:\s]+)/i)
        return match ? clean(match[1]) : null
      })()

    const payload: SocialTradingSnapshot = {
      source: SOURCE_URL,
      fetchedAt: new Date().toISOString(),
      accountDetails,
      tradingStats,
      accountInfo,
      chart: {
        growth: extractGrowthSeries(html),
      },
      meta: {
        updatedAt,
      },
    }

    cachedData = payload
    cacheTimestamp = Date.now()

    return NextResponse.json(payload)
  } catch (error) {
    console.error("Error fetching social trading stats:", error)
    if (cachedData) {
      return NextResponse.json({ ...cachedData, stale: true })
    }
    return NextResponse.json({ error: "Unable to fetch trading stats" }, { status: 500 })
  }
}

