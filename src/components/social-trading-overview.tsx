/* eslint-disable react-hooks/exhaustive-deps */
"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { LineChart } from "lucide-react"
import Link from "next/link"
import { LoadingSpinner } from "@/components/loading-spinner"
import { SimpleLineChart } from "@/components/simple-line-chart"

type SnapshotSection = Record<string, string | null>

type SocialTradingSnapshot = {
  source: string
  fetchedAt: string
  accountDetails: SnapshotSection
  tradingStats: SnapshotSection
  accountInfo: SnapshotSection
  chart: {
    growth: Array<{ date: string; value: number }>
  }
  meta: {
    updatedAt: string | null
  }
  cached?: boolean
  stale?: boolean
}

const cleanValue = (value?: string | null) => {
  if (!value) return "—"
  const normalized = value.replace(/\s+/g, " ").trim()
  if (!normalized) return "—"
  if (normalized.length > 80) {
    return `${normalized.slice(0, 77)}…`
  }
  return normalized
}

export function SocialTradingOverview() {
  const [snapshot, setSnapshot] = useState<SocialTradingSnapshot | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const growthSeries = snapshot?.chart?.growth ?? []

  useEffect(() => {
    let mounted = true

    const loadSnapshot = async () => {
      try {
        const response = await fetch("/api/social-trading", { cache: "no-store" })
        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`)
        }
        const data: SocialTradingSnapshot = await response.json()
        if (mounted) {
          setSnapshot(data)
        }
      } catch (err) {
        console.error("Failed to load social trading overview:", err)
        if (mounted) {
          setError("Unable to load the latest social trading metrics right now.")
        }
      } finally {
        mounted && setLoading(false)
      }
    }

    loadSnapshot()

    return () => {
      mounted = false
    }
  }, [])

  return (
    <section className="section-spacing bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 border-b border-slate-800/50">
      <div className="max-w-7xl mx-auto container-responsive">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center space-x-2 mb-6">
            <LineChart className="w-5 h-5 text-yellow-400" />
            <span className="text-sm font-medium text-yellow-400 uppercase tracking-wider">
              Verified Signal Snapshot
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
            Athens by Sahan
            <span
              className="block gradient-text-gold animate-gradient"
              style={{ backgroundSize: "200% 200%" }}
            >
              Social Trading Overview
            </span>
          </h2>
          <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto">
            Live performance data refreshed daily from the official SocialTradeTools dashboard. Explore real account growth, trade statistics, and broker information in one place.
          </p>
          {snapshot?.meta.updatedAt && (
            <p className="text-sm text-gray-400 mt-4">
              Last updated: {snapshot.meta.updatedAt} (source:&nbsp;
              <Link
                href={snapshot.source}
                target="_blank"
                rel="noopener noreferrer"
                className="text-yellow-400 hover:text-yellow-300 underline decoration-dotted"
              >
                SocialTradeTools
              </Link>
              )
            </p>
          )}
        </motion.div>

        {loading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner message="Loading social trading metrics..." />
          </div>
        ) : error ? (
          <div className="card-material bg-slate-900/70 border-red-500/30 text-center p-8 max-w-3xl mx-auto">
            <h3 className="text-xl font-semibold text-white mb-3">Live metrics unavailable</h3>
            <p className="text-gray-300">{error}</p>
          </div>
        ) : snapshot ? (
          <div className="space-y-12">
            {growthSeries.length > 1 && (
              <motion.div
                className="card-material bg-slate-900/70 border border-slate-700/60 p-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
                  <div>
                    <h3 className="text-xl font-semibold text-white">Growth Chart</h3>
                    <p className="text-sm text-gray-400">
                      Daily growth percentages sourced from the verified SocialTradeTools signal.
                    </p>
                  </div>
                  <div className="text-sm text-gray-400">
                    Data points:&nbsp;
                    <span className="text-white font-medium">{growthSeries.length}</span>
                  </div>
                </div>
                <SimpleLineChart data={growthSeries} height={320} />
              </motion.div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <motion.div
                className="card-material bg-slate-900/70 border border-slate-700/60 p-6 lg:col-span-1"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <h3 className="text-xl font-semibold text-white mb-4">Account Details</h3>
                <ul className="space-y-3 text-sm text-gray-200">
                  {Object.entries(snapshot.accountDetails)
                    .filter(([, value]) => value)
                    .map(([key, value]) => (
                      <li
                        key={key}
                        className="flex items-center justify-between border-b border-white/5 pb-2 last:border-b-0 last:pb-0"
                      >
                        <span className="text-gray-400">{key}</span>
                        <span className="font-medium text-white">{cleanValue(value)}</span>
                      </li>
                    ))}
                </ul>
              </motion.div>

              <motion.div
                className="card-material bg-slate-900/70 border border-slate-700/60 p-6 lg:col-span-2"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <h3 className="text-xl font-semibold text-white mb-4">Trading Statistics</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-200">
                  {Object.entries(snapshot.tradingStats)
                    .filter(([, value]) => value)
                    .map(([key, value]) => (
                      <div
                        key={key}
                        className="bg-white/5 rounded-lg px-4 py-3 border border-white/10"
                      >
                        <p className="text-xs uppercase tracking-wide text-gray-400">{key}</p>
                        <p className="text-lg font-semibold text-white mt-1">{cleanValue(value)}</p>
                      </div>
                    ))}
                </div>
              </motion.div>
            </div>

            <motion.div
              className="card-material bg-slate-900/70 border border-slate-700/60 p-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h3 className="text-xl font-semibold text-white mb-4">Broker & Account Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-200">
                {Object.entries(snapshot.accountInfo)
                  .filter(([, value]) => value)
                  .map(([key, value]) => (
                    <div key={key} className="bg-white/5 rounded-lg px-4 py-3 border border-white/10">
                      <p className="text-xs uppercase tracking-wide text-gray-400">{key}</p>
                      <p className="text-base font-semibold text-white mt-1">{cleanValue(value)}</p>
                    </div>
                  ))}
              </div>
            </motion.div>
          </div>
        ) : (
          <div className="card-material bg-slate-900/70 border border-slate-700/60 p-8 text-center text-gray-300">
            Live metrics are currently unavailable.
          </div>
        )}
      </div>
    </section>
  )
}

