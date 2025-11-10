"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, MessageSquare, Star, Activity, Video, CheckCircle, Gauge, Users } from "lucide-react"
import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"

export type DashboardStats = {
  totalPosts: number
  publishedPosts: number
  performancePosts: number
  analyticsPosts: number
  totalVideos: number
  totalReviews: number
  pendingReviews: number
  averageRating: number
  totalConversations: number
  unreadMessages: number
  averageWinRate: number
  averageDrawdown: number
  averageRiskReward: number
  averageProfitLoss: number
  bestProfitLoss: number | null
  topStrategies: Array<{
    id: string
    title: string
    profitLoss: number | null
    winRate: number | null
    drawdown: number | null
    riskReward: number | null
    createdAt: string
    published: boolean
  }>
}

export type DashboardActivityItem = {
  id: string
  type: "POST" | "VIDEO" | "REVIEW" | "TRADER_REVIEW"
  title: string
  description: string
  createdAt: string
}

interface DashboardOverviewProps {
  stats: DashboardStats
  activity: DashboardActivityItem[]
}

const formatNumber = (value: number, options?: Intl.NumberFormatOptions) =>
  new Intl.NumberFormat("en-US", options).format(value)

const formatPercentage = (value: number | null, fallback = "N/A") => {
  if (typeof value !== "number" || Number.isNaN(value)) return fallback
  return `${value.toFixed(1)}%`
}

const formatProfit = (value: number | null, fallback = "N/A") => {
  if (typeof value !== "number" || Number.isNaN(value)) return fallback
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  })
  return formatter.format(value)
}

const formatTimeAgo = (isoDate: string) => {
  const date = new Date(isoDate)
  const now = new Date()
  const diff = now.getTime() - date.getTime()

  const minutes = Math.floor(diff / (1000 * 60))
  if (minutes < 1) return "Just now"
  if (minutes < 60) return `${minutes} minute${minutes === 1 ? "" : "s"} ago`

  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`

  const days = Math.floor(hours / 24)
  if (days < 7) return `${days} day${days === 1 ? "" : "s"} ago`

  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

const activityConfig: Record<
  DashboardActivityItem["type"],
  { icon: React.ElementType; color: string; bgColor: string }
> = {
  POST: { icon: TrendingUp, color: "text-blue-400", bgColor: "bg-blue-500/10" },
  VIDEO: { icon: Video, color: "text-indigo-400", bgColor: "bg-indigo-500/10" },
  REVIEW: { icon: Star, color: "text-yellow-400", bgColor: "bg-yellow-500/10" },
  TRADER_REVIEW: { icon: Users, color: "text-emerald-400", bgColor: "bg-emerald-500/10" },
}

export function DashboardOverview({ stats, activity }: DashboardOverviewProps) {
  const statCards = [
    {
      title: "Total Posts",
      value: formatNumber(stats.totalPosts),
      description: `${formatNumber(stats.performancePosts)} performance • ${formatNumber(stats.analyticsPosts)} analytics`,
      icon: TrendingUp,
      color: "from-blue-500/10 to-cyan-500/10",
      iconColor: "text-blue-400",
      borderColor: "border-blue-500/20",
      change: `${formatNumber(stats.publishedPosts)} published`,
    },
    {
      title: "Published Posts",
      value: formatNumber(stats.publishedPosts),
      description: `${formatNumber(stats.totalPosts - stats.publishedPosts)} drafts`,
      icon: CheckCircle,
      color: "from-emerald-500/10 to-teal-500/10",
      iconColor: "text-emerald-400",
      borderColor: "border-emerald-500/20",
      change: "Ready for visitors",
    },
    {
      title: "Education Videos",
      value: formatNumber(stats.totalVideos),
      description: "Published learning resources",
      icon: Video,
      color: "from-indigo-500/10 to-purple-500/10",
      iconColor: "text-indigo-400",
      borderColor: "border-indigo-500/20",
      change: "Keep sharing insights",
    },
    {
      title: "Total Reviews",
      value: formatNumber(stats.totalReviews),
      description: `${formatNumber(stats.pendingReviews)} pending approval`,
      icon: Star,
      color: "from-yellow-500/10 to-orange-500/10",
      iconColor: "text-yellow-400",
      borderColor: "border-yellow-500/20",
      change: `${stats.averageRating.toFixed(1)} average rating`,
    },
    {
      title: "Average Win Rate",
      value: formatPercentage(stats.averageWinRate),
      description: `Drawdown ${formatPercentage(stats.averageDrawdown)}`,
      icon: Gauge,
      color: "from-rose-500/10 to-pink-500/10",
      iconColor: "text-rose-400",
      borderColor: "border-rose-500/20",
      change: `Risk/Reward ${stats.averageRiskReward.toFixed(2)}`,
    },
    {
      title: "Unread Messages",
      value: formatNumber(stats.unreadMessages),
      description: `${formatNumber(stats.totalConversations)} conversations`,
      icon: MessageSquare,
      color: "from-green-500/10 to-emerald-500/10",
      iconColor: "text-green-400",
      borderColor: "border-green-500/20",
      change: "Stay responsive",
    },
  ]

  const recentActivity = activity.slice(0, 8)

  const topStrategies = stats.topStrategies.slice(0, 3)

  return (
    <div className="space-y-8">
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {statCards.map((stat, index) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.08 }}
              whileHover={{ y: -5, scale: 1.02 }}
            >
              <Card className={`card-material bg-gradient-to-br ${stat.color} ${stat.borderColor} hover:shadow-xl transition-all duration-300`}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-gray-300">{stat.title}</CardTitle>
                    <Icon className={`h-5 w-5 ${stat.iconColor}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white mb-2">{stat.value}</div>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-gray-400 pr-4">{stat.description}</p>
                    <Badge className="badge-info text-xs whitespace-nowrap">{stat.change}</Badge>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </motion.div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
          <Card className="card-material bg-gradient-to-br from-navy-800/50 to-navy-700/50 border-navy-600/20 h-full">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Activity className="w-5 h-5 mr-2 text-yellow-400" />
                Recent Activity
              </CardTitle>
              <CardDescription className="text-gray-400">
                Latest updates across posts, videos, and community feedback
              </CardDescription>
            </CardHeader>
            <CardContent>
              {recentActivity.length === 0 ? (
                <div className="text-center py-12 text-gray-400 text-sm">
                  No activity recorded yet. Publish content or engage with users to see updates here.
                </div>
              ) : (
                <div className="space-y-4">
                  {recentActivity.map((item, index) => {
                    const meta = activityConfig[item.type]
                    const Icon = meta.icon
                    return (
                      <motion.div
                        key={`${item.type}-${item.id}`}
                        className="flex items-start space-x-4 p-3 rounded-lg hover:bg-navy-700/30 transition-colors"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: 0.25 + index * 0.08 }}
                      >
                        <div className={`w-10 h-10 ${meta.bgColor} rounded-xl flex items-center justify-center flex-shrink-0`}>
                          <Icon className={`w-5 h-5 ${meta.color}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-white">{item.title}</p>
                          {item.description && (
                            <p className="text-xs text-gray-400 mt-1 whitespace-pre-line line-clamp-2">{item.description}</p>
                          )}
                          <p className="text-xs text-gray-500 mt-2">{formatTimeAgo(item.createdAt)}</p>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.3 }}>
          <Card className="card-material bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border-yellow-500/20 h-full">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <CheckCircle className="w-5 h-5 mr-2 text-yellow-400" />
                Performance Summary
              </CardTitle>
              <CardDescription className="text-gray-400">
                Snapshot of current trading performance metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-400 mb-2">{stats.averageRating.toFixed(1)}</div>
                  <div className="text-sm text-gray-300 mb-1">Average Rating</div>
                  <div className="flex justify-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${
                          star <= Math.round(stats.averageRating) ? "text-yellow-400 fill-current" : "text-gray-600"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">{formatNumber(stats.totalReviews)} approved reviews</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-400 mb-2">{formatNumber(stats.publishedPosts)}</div>
                  <div className="text-sm text-gray-300 mb-1">Published Posts</div>
                  <p className="text-xs text-gray-500">
                    {formatNumber(stats.totalPosts - stats.publishedPosts)} draft{stats.totalPosts - stats.publishedPosts === 1 ? "" : "s"}{" "}
                    pending review
                  </p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-sky-400 mb-2">
                    {formatProfit(stats.bestProfitLoss, stats.bestProfitLoss === null ? "N/A" : undefined)}
                  </div>
                  <div className="text-sm text-gray-300 mb-1">Best Monthly P&L</div>
                  <p className="text-xs text-gray-500">
                    Avg P&L {formatProfit(Number.isFinite(stats.averageProfitLoss) ? stats.averageProfitLoss : null)}
                  </p>
                </div>
              </div>

              <div className="border-t border-yellow-500/10 pt-4">
                <p className="text-sm font-semibold text-white mb-4">Top Performing Strategies</p>
                {topStrategies.length === 0 ? (
                  <p className="text-xs text-gray-400">
                    Publish performance posts to build a visible track record of your strategies.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {topStrategies.map((strategy) => (
                      <div
                        key={strategy.id}
                        className="flex items-center justify-between bg-black/10 rounded-lg px-4 py-3 border border-white/5"
                      >
                        <div className="min-w-0 pr-4">
                          <p className="text-sm font-medium text-white truncate">{strategy.title}</p>
                          <p className="text-xs text-gray-400">
                            {new Date(strategy.createdAt).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </p>
                        </div>
                        <div className="flex items-center space-x-5 text-xs text-gray-300">
                          <span>P&L {formatProfit(strategy.profitLoss)}</span>
                          <span>Win {formatPercentage(strategy.winRate)}</span>
                          <span>DD {formatPercentage(strategy.drawdown)}</span>
                          <span>R/R {typeof strategy.riskReward === "number" ? strategy.riskReward.toFixed(2) : "N/A"}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}