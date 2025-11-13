"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Target, Shield, ArrowRight, Eye, Calendar, CheckCircle, Zap, Star, Users, ThumbsUp, Loader2 } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { itemVariants } from "@/lib/animations"
import { useState } from "react"
import { useRouter } from "next/navigation"

interface PerformancePost {
  id: string
  title: string
  description?: string | null
  type: "PERFORMANCE" | "ANALYTICS"
  profitLoss?: number | null
  winRate?: number | null
  drawdown?: number | null
  riskReward?: number | null
  imageUrl?: string | null
  videoUrl?: string | null
  published: boolean
  createdAt: string
  reviews: Array<{
    rating: number
  }>
}

interface PerformanceCardProps {
  post: PerformancePost
}

export function PerformanceCard({ post }: PerformanceCardProps) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const isPerformance = post.type === "PERFORMANCE"

  const handleViewAnalysis = async () => {
    setIsLoading(true)
    // Simulate loading time for better UX
    await new Promise(resolve => setTimeout(resolve, 1000))
    router.push(`/posts/${post.id}`)
  }
  const formatCurrency = (amount?: number | null) => {
    if (typeof amount === "number" && Number.isFinite(amount)) {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(amount)
    }
    return "N/A"
  }

  const formatPercentage = (value?: number | null) => {
    if (typeof value === "number" && Number.isFinite(value)) {
      return `${value.toFixed(1)}%`
    }
    return "N/A"
  }

  const hasProfitLoss = isPerformance && typeof post.profitLoss === "number" && Number.isFinite(post.profitLoss)
  const profitLossValue = hasProfitLoss ? post.profitLoss! : null
  const isProfitable = hasProfitLoss && (profitLossValue ?? 0) > 0

  const getPerformanceColor = (winRate?: number | null) => {
    if (typeof winRate !== "number" || !Number.isFinite(winRate)) return "text-gray-400"
    if (winRate >= 80) return "text-green-400"
    if (winRate >= 60) return "text-blue-400"
    if (winRate >= 40) return "text-purple-400"
    return "text-red-400"
  }

  const getAverageRating = () => {
    if (post.reviews.length === 0) return 0
    const totalRating = post.reviews.reduce((sum, review) => sum + review.rating, 0)
    return totalRating / post.reviews.length
  }

  const averageRating = getAverageRating()

  const getPerformanceBg = (winRate?: number | null) => {
    if (typeof winRate !== "number" || !Number.isFinite(winRate)) {
      return "from-slate-700/40 to-slate-800/40"
    }
    if (winRate >= 80) return "from-green-500/10 to-emerald-500/10"
    if (winRate >= 60) return "from-blue-500/10 to-cyan-500/10"
    if (winRate >= 40) return "from-purple-500/10 to-pink-500/10"
    return "from-red-500/10 to-pink-500/10"
  }

  const winRateValue = isPerformance && typeof post.winRate === "number" && Number.isFinite(post.winRate) ? post.winRate : null
  const drawdownValue = isPerformance && typeof post.drawdown === "number" && Number.isFinite(post.drawdown) ? post.drawdown : null
  const riskRewardValue = isPerformance && typeof post.riskReward === "number" && Number.isFinite(post.riskReward) ? post.riskReward : null

  const winRateDisplay = formatPercentage(winRateValue)
  const drawdownDisplay = formatPercentage(drawdownValue)
  const riskRewardDisplay = typeof riskRewardValue === "number" ? riskRewardValue.toFixed(2) : "N/A"
  const profitLossDisplay = formatCurrency(profitLossValue)
  const descriptionText = post.description?.trim() || "No description provided."

  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ y: -12, scale: 1.02 }}
      className="group h-full"
    >
      <Card className="card-material h-full overflow-hidden hover:border-yellow-400/50 transition-all duration-500">
        {/* Header with Navy & Gold effects */}
        <div className="relative">
          {post.imageUrl && (
            <div className="aspect-video overflow-hidden relative">
              <img
                src={post.imageUrl}
                alt={post.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              
              {/* Navy & Gold overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/0 via-blue-500/0 to-yellow-500/0 group-hover:from-yellow-500/20 group-hover:via-blue-500/20 group-hover:to-yellow-500/20 transition-all duration-500" />
            </div>
          )}
          
          {/* Performance badge with Navy & Gold styling */}
          <div className="absolute top-4 right-4">
            <motion.div
              whileHover={{ scale: 1.1 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
              {isPerformance ? (
                hasProfitLoss ? (
                  <Badge
                    className={`px-4 py-2 text-sm font-bold ${
                      isProfitable ? 'badge-success' : 'badge-danger'
                    }`}
                  >
                    {isProfitable ? (
                      <TrendingUp className="w-4 h-4 mr-1" />
                    ) : (
                      <TrendingDown className="w-4 h-4 mr-1" />
                    )}
                    {profitLossDisplay}
                  </Badge>
                ) : (
                  <Badge className="badge-info px-4 py-2 text-sm font-bold">
                    No P&L Data
                  </Badge>
                )
              ) : (
                <Badge className="badge-info px-4 py-2 text-sm font-bold">
                  Analytics
                </Badge>
              )}
            </motion.div>
          </div>

          {/* Verified badge with Navy & Gold styling */}
          <div className="absolute top-4 left-4">
            <motion.div
              className="badge-info"
              whileHover={{ scale: 1.1 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
              <CheckCircle className="w-3 h-3 mr-1" />
              <span>Verified</span>
            </motion.div>
          </div>

          {/* Edge indicator with Navy & Gold styling */}
          <div className="absolute bottom-4 left-4">
            <motion.div
              className="flex items-center space-x-1 bg-black/50 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-medium text-blue-400"
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Zap className="w-3 h-3" />
              <span>Signal-Driven</span>
            </motion.div>
          </div>

          {/* Video indicator */}
          {post.videoUrl && (
            <div className="absolute bottom-4 right-4">
              <motion.div
                className="flex items-center space-x-1 bg-black/50 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-medium text-red-400"
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Eye className="w-3 h-3" />
                <span>Video Available</span>
              </motion.div>
            </div>
          )}
        </div>

        <CardHeader className="pb-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-xl font-bold text-foreground line-clamp-2 mb-3 group-hover:text-yellow-400 transition-colors">
                {post.title}
              </CardTitle>
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between text-sm text-muted-foreground">
                    <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                      </div>
                      {isPerformance ? (
                        <div className={`flex items-center space-x-2 font-medium ${getPerformanceColor(winRateValue)}`}>
                          <Target className="w-4 h-4" />
                          <span>{winRateDisplay} Win Rate</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2 font-medium text-blue-300">
                          <Target className="w-4 h-4" />
                          <span>Analytics Insight</span>
                        </div>
                      )}
                    </div>
                    {post.reviews.length > 0 && (
                      <div className="flex items-center space-x-2 text-sm">
                        <Star className="w-4 h-4 text-yellow-400 flex-shrink-0" />
                        <span className="text-yellow-400 font-medium">{averageRating.toFixed(1)}</span>
                        <span className="text-gray-400">({post.reviews.length})</span>
                      </div>
                    )}
                  </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6 flex-1 flex flex-col">
          <p className="text-muted-foreground line-clamp-3 leading-relaxed flex-1">
            {descriptionText}
          </p>

          {isPerformance && (
            <>
              {/* Key metrics with Navy & Gold styling */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <motion.div 
                  className={`bg-gradient-to-br ${getPerformanceBg(winRateValue)} p-4 rounded-xl border border-blue-500/20 hover:border-blue-400/50 transition-all duration-300`}
                  whileHover={{ scale: 1.02, y: -2 }}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 bg-gradient-to-r ${getPerformanceBg(winRateValue)} rounded-xl flex items-center justify-center`}>
                      <Target className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <div className="text-xs font-medium text-blue-400 uppercase tracking-wide">Win Rate</div>
                      <div className="text-lg font-bold text-blue-300">{winRateDisplay}</div>
                    </div>
                  </div>
                </motion.div>
                
                <motion.div 
                  className="bg-gradient-to-br from-yellow-500/10 to-blue-500/10 p-4 rounded-xl border border-yellow-500/20 hover:border-yellow-400/50 transition-all duration-300"
                  whileHover={{ scale: 1.02, y: -2 }}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-blue-500 rounded-xl flex items-center justify-center">
                      <Shield className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="text-xs font-medium text-yellow-400 uppercase tracking-wide">Risk/Reward</div>
                      <div className="text-lg font-bold text-yellow-300">{riskRewardDisplay}</div>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Drawdown indicator with Navy & Gold styling */}
              <motion.div
                className="bg-gradient-to-br from-red-500/10 to-pink-500/10 p-4 rounded-xl border border-red-500/20 hover:border-red-400/50 transition-all duration-300"
                whileHover={{ scale: 1.02, y: -2 }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl flex items-center justify-center">
                      <TrendingDown className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="text-xs font-medium text-red-400 uppercase tracking-wide">Max Drawdown</div>
                      <div className="text-lg font-bold text-red-300">{drawdownDisplay}</div>
                    </div>
                  </div>
                  <motion.div 
                    className={drawdownValue !== null ? "badge-warning" : "badge-info"}
                    animate={{ opacity: [0.7, 1, 0.7] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    {drawdownValue !== null ? "Risk Level" : "No Data"}
                  </motion.div>
                </div>
              </motion.div>
            </>
          )}

          {/* Reviews Section */}
          {post.reviews.length > 0 && (
            <motion.div
              className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 p-4 rounded-xl border border-indigo-500/20 hover:border-indigo-400/50 transition-all duration-300"
              whileHover={{ scale: 1.02, y: -2 }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="text-xs font-medium text-indigo-400 uppercase tracking-wide">User Reviews</div>
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center space-x-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-3 h-3 ${
                              star <= Math.floor(averageRating)
                                ? "text-yellow-400 fill-current"
                                : "text-gray-600"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm font-bold text-indigo-300">{averageRating.toFixed(1)}</span>
                      <span className="text-xs text-gray-400">({post.reviews.length} reviews)</span>
                    </div>
                  </div>
                </div>
                <motion.div 
                  className="badge-info"
                  animate={{ opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <ThumbsUp className="w-3 h-3 mr-1" />
                  Rated
                </motion.div>
              </div>
            </motion.div>
          )}

          {/* Action button with Navy & Gold styling */}
          <motion.div
            whileHover={{ scale: isLoading ? 1 : 1.02 }}
            whileTap={{ scale: isLoading ? 1 : 0.98 }}
          >
            <Button 
              onClick={handleViewAnalysis}
              disabled={isLoading}
              className="w-full btn-material disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Loading Analysis...
                </>
              ) : (
                <>
                  <Eye className="w-4 h-4 mr-2" />
                  View Analysis
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  )
}