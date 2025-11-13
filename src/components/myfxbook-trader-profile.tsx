"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { ExternalLink, TrendingUp, Shield, Award, Calendar, BarChart3, Target, LineChart, Star } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { LoadingSpinner } from "@/components/loading-spinner"

interface TraderProfileResponse {
  trader: {
    id: string
    name: string
    bio: string
    image?: string | null
    createdAt: string
  }
  stats: {
    totalPerformancePosts: number
    totalAnalyticsPosts: number
    totalVideos: number
    totalTraderReviews: number
    averageTraderRating: number
    averageWinRate: number
    averageDrawdown: number
    averageRiskReward: number
    averageProfitLoss: number
  }
  topStrategies: Array<{
    id: string
    title: string
    profitLoss: number | null
    winRate: number | null
    drawdown: number | null
    riskReward: number | null
    createdAt: string
  }>
  analyticsHighlights: Array<{
    id: string
    title: string
    createdAt: string
  }>
}

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

const formatPercentage = (value: number, fallback = "N/A") => {
  if (!Number.isFinite(value)) return fallback
  return `${value.toFixed(1)}%`
}

const formatProfit = (value: number, fallback = "N/A") => {
  if (!Number.isFinite(value)) return fallback
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value)
}

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

const calculateExperience = (iso: string) => {
  const start = new Date(iso)
  const now = new Date()
  const diffYears = now.getFullYear() - start.getFullYear()
  const hasMonthPassed =
    now.getMonth() > start.getMonth() ||
    (now.getMonth() === start.getMonth() && now.getDate() >= start.getDate())
  const years = hasMonthPassed ? diffYears : diffYears - 1
  if (years <= 0) return "Less than a year"
  if (years === 1) return "1 year of verified performance"
  return `${years} years of verified performance`
}

export function MyFXBookTraderProfile() {
  const [profile, setProfile] = useState<TraderProfileResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch("/api/trader/profile")
        if (!response.ok) {
          throw new Error("Failed to load trader profile")
        }
        const data = (await response.json()) as TraderProfileResponse
        setProfile(data)
      } catch (err) {
        console.error("Error fetching trader profile:", err)
        setError("Unable to load trader profile at the moment.")
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [])

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl p-8 flex items-center justify-center min-h-[420px]">
        <LoadingSpinner message="Loading trader profile..." size="md" />
      </div>
    )
  }

  if (error || !profile) {
    return (
      <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl p-8 text-center min-h-[320px] flex flex-col items-center justify-center space-y-4">
        <Award className="w-10 h-10 text-yellow-400" />
        <h3 className="text-xl font-semibold text-white">Trader profile unavailable</h3>
        <p className="text-sm text-gray-400 max-w-md">{error ?? "We couldn't load the live trader information right now."}</p>
      </div>
    )
  }

  const { trader, stats, topStrategies, analyticsHighlights } = profile
  const experienceText = calculateExperience(trader.createdAt)

  return (
    <motion.div
      className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl p-8"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      <motion.div className="text-center mb-10" variants={itemVariants}>
        <div className="flex items-center justify-center mb-4">
          <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center mr-4">
            <Award className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-white gradient-text-gold">{trader.name}</h2>
            <p className="text-gray-400">Lead Trader & Strategy Architect</p>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-400 mb-5">
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-2 text-yellow-400" />
            Joined {formatDate(trader.createdAt)}
          </div>
          <div className="flex items-center">
            <Shield className="w-4 h-4 mr-2 text-yellow-400" />
            {experienceText}
          </div>
          <div className="flex items-center">
            <Star className="w-4 h-4 mr-2 text-yellow-400" />
            {stats.averageTraderRating.toFixed(1)} trader rating ({stats.totalTraderReviews} client reviews)
          </div>
        </div>

        {trader.bio && <p className="max-w-4xl mx-auto text-gray-300 leading-relaxed">{trader.bio}</p>}
      </motion.div>

      <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10" variants={itemVariants}>
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-white flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-green-400" />
              Trading Performance
            </CardTitle>
            <CardDescription className="text-gray-400">
              Averaged across published performance updates
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">Average Win Rate</span>
              <span className="text-sm font-semibold text-white">{formatPercentage(stats.averageWinRate)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">Average Drawdown</span>
              <span className="text-sm font-semibold text-white">{formatPercentage(stats.averageDrawdown)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">Average Risk/Reward</span>
              <span className="text-sm font-semibold text-white">{stats.averageRiskReward.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">Average P&L</span>
              <span className="text-sm font-semibold text-white">{formatProfit(stats.averageProfitLoss)}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-white flex items-center">
              <BarChart3 className="w-5 h-5 mr-2 text-blue-400" />
              Content Portfolio
            </CardTitle>
            <CardDescription className="text-gray-400">Live insights across the platform</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">Performance Posts</span>
              <Badge className="bg-blue-600/20 text-blue-200 border-blue-500/40">
                {stats.totalPerformancePosts}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">Analytics Insights</span>
              <Badge className="bg-purple-600/20 text-purple-200 border-purple-500/40">
                {stats.totalAnalyticsPosts}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">Education Videos</span>
              <Badge className="bg-teal-600/20 text-teal-200 border-teal-500/40">
                {stats.totalVideos}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-white flex items-center">
              <Target className="w-5 h-5 mr-2 text-yellow-400" />
              Community Impact
            </CardTitle>
            <CardDescription className="text-gray-400">
              Engagement across client accounts and reviews
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">Trader Reviews</span>
              <span className="text-sm font-semibold text-white">{stats.totalTraderReviews}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">Average Rating</span>
              <span className="text-sm font-semibold text-white">{stats.averageTraderRating.toFixed(1)} / 5</span>
            </div>
            <div className="text-xs text-gray-500">
              Based on verified users engaging with account management and copy trading services.
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={itemVariants}>
        <h3 className="text-2xl font-bold text-white mb-6 text-center">Live Strategy Performance</h3>
        {topStrategies.length === 0 ? (
          <div className="text-center text-gray-400 text-sm bg-gray-800/40 border border-gray-700 rounded-xl py-10">
            No published performance posts yet. Publish new results to showcase strategy performance.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {topStrategies.map((strategy) => (
              <motion.div
                key={strategy.id}
                variants={itemVariants}
                whileHover={{ scale: 1.02, y: -5 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="bg-gray-800/50 border-gray-700 hover:border-yellow-500/50 transition-all duration-300">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-white text-lg line-clamp-2 pr-3">{strategy.title}</CardTitle>
                      <Badge variant="outline" className="text-yellow-300 border-yellow-500/40">
                        {formatDate(strategy.createdAt)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <p className="text-sm text-gray-400 mb-1">Profit/Loss</p>
                        <p className="text-lg font-semibold text-green-400">
                          {formatProfit(strategy.profitLoss ?? Number.NaN)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400 mb-1">Win Rate</p>
                        <p className="text-lg font-semibold text-blue-400">
                          {formatPercentage(strategy.winRate ?? Number.NaN)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400 mb-1">Drawdown</p>
                        <p className="text-lg font-semibold text-red-400">
                          {formatPercentage(strategy.drawdown ?? Number.NaN)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400 mb-1">Risk/Reward</p>
                        <p className="text-lg font-semibold text-purple-300">
                          {typeof strategy.riskReward === "number" ? strategy.riskReward.toFixed(2) : "N/A"}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {analyticsHighlights.length > 0 && (
        <motion.div className="mt-12" variants={itemVariants}>
          <h3 className="text-2xl font-bold text-white mb-6 text-center">Latest Analytics Highlights</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {analyticsHighlights.map((post) => (
              <Card key={post.id} className="bg-gray-800/40 border border-gray-700 hover:border-blue-500/40 transition-colors">
                <CardHeader className="pb-2">
                  <CardTitle className="text-white text-base line-clamp-2">{post.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-gray-400">{formatDate(post.createdAt)}</p>
                  <p className="text-sm text-gray-300 mt-2">
                    Data-backed analysis published to the community.
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>
      )}

      <motion.div className="mt-10 text-center" variants={itemVariants}>
        <Button
          asChild
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3"
        >
          <a
            href="https://www.myfxbook.com/members/ATHENSbySAHAN"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center"
          >
            <ExternalLink className="w-5 h-5 mr-2" />
            View Live Performance on Myfxbook
          </a>
        </Button>
        <p className="text-gray-400 text-sm mt-2">
          Verified trading history and detailed portfolio analytics hosted on Myfxbook.
        </p>
      </motion.div>
    </motion.div>
  )
}
