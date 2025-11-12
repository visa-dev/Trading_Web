import { useMemo } from "react"

type Point = {
  date: string
  value: number
}

type SimpleLineChartProps = {
  data: Point[]
  height?: number
  title?: string
}

const formatDateLabel = (date: string) => {
  const parsed = new Date(date)
  if (Number.isNaN(parsed.getTime())) {
    return date
  }

  const year = String(parsed.getFullYear()).slice(-2)
  const month = parsed.toLocaleString("en-US", { month: "short" })
  const day = String(parsed.getDate()).padStart(2, "0")

  return `${year} ${month} ${day}`
}

export function SimpleLineChart({ data, height = 280 }: SimpleLineChartProps) {
  const { path, area, minY, maxY, ticks, xLabels, points } = useMemo(() => {
    if (!data || data.length < 2) {
      return {
        path: "",
        area: "",
        minY: 0,
        maxY: 0,
        ticks: [] as number[],
        xLabels: [] as { x: number; label: string }[],
        points: [] as Array<{ date: string; value: number; x: number; y: number }>,
      }
    }

    const ordered = data
      .filter((point): point is Point => typeof point.value === "number" && Number.isFinite(point.value))

    if (ordered.length < 2) {
      return {
        path: "",
        area: "",
        minY: 0,
        maxY: 0,
        ticks: [],
        xLabels: [],
        points: [],
      }
    }

    const values = ordered.map((d) => d.value)
    const minValue = Math.min(...values)
    const maxValue = Math.max(...values)

    const padding = (maxValue - minValue) * 0.1 || 1
    const minYVal = minValue - padding
    const maxYVal = maxValue + padding

    const width = 900
    const chartHeight = height
    const margin = { top: 20, right: 24, bottom: 36, left: 60 }
    const innerWidth = width - margin.left - margin.right
    const innerHeight = chartHeight - margin.top - margin.bottom

    const getX = (index: number) => margin.left + (index / (ordered.length - 1)) * innerWidth
    const getY = (value: number) =>
      margin.top + innerHeight - ((value - minYVal) / (maxYVal - minYVal || 1)) * innerHeight

    const linePath = ordered
      .map((point, index) => {
        const command = index === 0 ? "M" : "L"
        return `${command}${getX(index).toFixed(2)},${getY(point.value).toFixed(2)}`
      })
      .join(" ")

    const areaPath = `${linePath} L${margin.left + innerWidth},${margin.top + innerHeight} L${margin.left},${
      margin.top + innerHeight
    } Z`

    const tickCount = 4
    const ticks = Array.from({ length: tickCount + 1 }, (_, i) =>
      minYVal + (i / tickCount) * (maxYVal - minYVal)
    )

    const labelSteps = Math.max(1, Math.floor(ordered.length / 6))
    const xLabels = ordered
      .map((point, index) => ({ point, index }))
      .filter(({ index }) => index % labelSteps === 0 || index === ordered.length - 1)
      .map(({ point, index }) => ({
        x: getX(index),
        label: formatDateLabel(point.date),
      }))

    return {
      path: linePath,
      area: areaPath,
      minY: minYVal,
      maxY: maxYVal,
      ticks,
      xLabels,
      points: ordered.map((point, index) => ({
        date: point.date,
        value: point.value,
        x: getX(index),
        y: getY(point.value),
      })),
    }
  }, [data, height])

  if (!path) {
    return (
      <div className="flex items-center justify-center h-[240px] text-gray-400">
        Insufficient data to render chart.
      </div>
    )
  }

  const width = 900
  const chartHeight = height
  const margin = { top: 20, right: 24, bottom: 36, left: 60 }
  const innerHeight = chartHeight - margin.top - margin.bottom

  return (
    <div className="w-full overflow-hidden">
      <svg
        viewBox={`0 0 ${width} ${chartHeight}`}
        role="img"
        aria-label="Social trading performance chart"
        className="w-full h-auto"
      >
        <defs>
          <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(245, 158, 11, 0.55)" />
            <stop offset="100%" stopColor="rgba(245, 158, 11, 0)" />
          </linearGradient>
          <linearGradient id="axisGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(148, 163, 184, 0.25)" />
            <stop offset="100%" stopColor="rgba(148, 163, 184, 0.05)" />
          </linearGradient>
        </defs>

        {/* Background */}
        <rect
          x={margin.left}
          y={margin.top}
          width={width - margin.left - margin.right}
          height={innerHeight}
          fill="url(#axisGradient)"
          rx={12}
        />

        {/* Area fill */}
        <path d={area} fill="url(#lineGradient)" opacity={0.6} />

        {/* Line */}
        <path d={path} fill="none" stroke="#f59e0b" strokeWidth={3} strokeLinecap="round" />

        {/* Axes */}
        {ticks.map((tick, idx) => {
          const y =
            margin.top +
            innerHeight -
            ((tick - minY) / (maxY - minY || 1)) * innerHeight
          return (
            <g key={idx}>
              <line
                x1={margin.left}
                x2={width - margin.right}
                y1={y}
                y2={y}
                stroke="rgba(148, 163, 184, 0.15)"
                strokeDasharray="4 6"
              />
              <text
                x={margin.left - 14}
                y={y + 4}
                textAnchor="end"
                fontSize={11}
                fill="rgba(203, 213, 225, 0.75)"
              >
                {tick.toLocaleString(undefined, {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 2,
                })}
              </text>
            </g>
          )
        })}

        {/* X axis labels */}
        {xLabels.map(({ x, label }, idx) => (
          <text
            key={idx}
            x={x}
            y={chartHeight - margin.bottom / 2}
            textAnchor="middle"
            fontSize={12}
            fill="rgba(203, 213, 225, 0.85)"
          >
            {label}
          </text>
        ))}

        {/* Dots */}
        {points.map((point, index) => (
          <circle
            key={`${point.date}-${index}`}
            cx={point.x}
            cy={point.y}
            r={2.5}
            fill="#fbbf24"
            opacity={0.9}
          />
        ))}
      </svg>
    </div>
  )
}


