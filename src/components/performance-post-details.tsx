"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Target, Shield, BarChart3, ArrowLeft, Calendar, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { LoadingSpinner } from "@/components/loading-spinner"
import { useState, useEffect } from "react"

interface PerformancePost {
  id: string
  title: string
  description?: string | null
  profitLoss?: number | null
  winRate?: number | null
  drawdown?: number | null
  riskReward?: number | null
  imageUrl?: string | null
  videoUrl?: string | null
  createdAt: Date
}

interface PerformancePostDetailsProps {
  post: PerformancePost
  activeTab: string
}

export function PerformancePostDetails({ post, activeTab }: PerformancePostDetailsProps) {
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Simulate loading for better UX
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner message="Loading analysis..." size="lg" />
      </div>
    )
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

  const hasProfitLoss = typeof post.profitLoss === "number" && Number.isFinite(post.profitLoss)
  const profitLossValue = hasProfitLoss ? post.profitLoss! : null
  const isProfitable = hasProfitLoss && (profitLossValue ?? 0) > 0
  const winRateValue = typeof post.winRate === "number" && Number.isFinite(post.winRate) ? post.winRate : null
  const drawdownValue = typeof post.drawdown === "number" && Number.isFinite(post.drawdown) ? post.drawdown : null
  const riskRewardValue = typeof post.riskReward === "number" && Number.isFinite(post.riskReward) ? post.riskReward : null

  const profitLossDisplay = formatCurrency(profitLossValue)
  const winRateDisplay = formatPercentage(winRateValue)
  const drawdownDisplay = formatPercentage(drawdownValue)
  const riskRewardDisplay = typeof riskRewardValue === "number" ? riskRewardValue.toFixed(2) : "N/A"
  const descriptionText = post.description?.trim() || "No description provided."
  const profitBadgeClasses = hasProfitLoss
    ? (isProfitable
        ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white"
        : "bg-gradient-to-r from-red-500 to-pink-500 text-white")
    : "bg-gradient-to-r from-slate-600 to-slate-700 text-white/80"
  const profitCardClasses = hasProfitLoss
    ? (isProfitable
        ? "bg-gradient-to-br from-emerald-500/10 to-green-500/10 border-emerald-500/20"
        : "bg-gradient-to-br from-red-500/10 to-pink-500/10 border-red-500/20")
    : "bg-gradient-to-br from-slate-600/10 to-slate-700/10 border-slate-500/20"
  const profitTextColor = hasProfitLoss
    ? (isProfitable ? "text-green-400" : "text-red-400")
    : "text-gray-400"

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-6"
    >
      {/* Back Button */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-4 text-gray-300 hover:text-white hover:bg-gray-800/50"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Performance
        </Button>
      </motion.div>

      {/* Main Card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <Card className="card-material shadow-2xl">
          <CardHeader className="bg-gradient-to-r from-navy-800/50 to-navy-700/50 border-b border-gray-700/50">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <CardTitle className="text-4xl font-bold text-white mb-2">
                    {post.title}
                  </CardTitle>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  className="flex items-center space-x-4 text-gray-300"
                >
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm">
                      {new Date(post.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">
                      {new Date(post.createdAt).toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                </motion.div>
              </div>
              
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <Badge 
                  variant={hasProfitLoss ? (isProfitable ? "default" : "destructive") : "secondary"} 
                  className={`text-lg px-6 py-3 ${profitBadgeClasses} border-0 shadow-lg`}
                >
                  {hasProfitLoss ? (
                    isProfitable ? (
                      <TrendingUp className="w-5 h-5 mr-2" />
                    ) : (
                      <TrendingDown className="w-5 h-5 mr-2" />
                    )
                  ) : (
                    <TrendingUp className="w-5 h-5 mr-2 text-gray-200" />
                  )}
                  {profitLossDisplay}
                </Badge>
              </motion.div>
            </div>
          </CardHeader>

          <CardContent className="p-8">
            <motion.div
              className="space-y-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
            >
              {/* Image Section */}
              {post.imageUrl && (
                <motion.div 
                  className="aspect-video overflow-hidden rounded-xl shadow-2xl"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.8 }}
                >
                  <img
                    src={post.imageUrl}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                </motion.div>
              )}
              
              {/* Description Section */}
              <motion.div 
                className="prose max-w-none"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.9 }}
              >
                <p className="text-lg text-gray-300 leading-relaxed">
                  {descriptionText}
                </p>
              </motion.div>

              {/* Metrics Grid */}
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.0 }}
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 1.1 }}
                >
                  <Card className="card-material bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border-blue-500/20 hover:shadow-lg transition-shadow duration-300">
                    <CardHeader className="pb-2">
                      <div className="flex items-center space-x-2">
                        <Target className="w-5 h-5 text-blue-400" />
                        <CardTitle className="text-sm font-medium text-white">Win Rate</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-blue-400">{winRateDisplay}</div>
                      <p className="text-xs text-gray-400 mt-1">
                        Percentage of winning trades
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 1.2 }}
                >
                  <Card className="card-material bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/20 hover:shadow-lg transition-shadow duration-300">
                    <CardHeader className="pb-2">
                      <div className="flex items-center space-x-2">
                        <Shield className="w-5 h-5 text-green-400" />
                        <CardTitle className="text-sm font-medium text-white">Risk/Reward</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-green-400">{riskRewardDisplay}</div>
                      <p className="text-xs text-gray-400 mt-1">
                        Risk to reward ratio
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 1.3 }}
                >
                  <Card className="card-material bg-gradient-to-br from-red-500/10 to-pink-500/10 border-red-500/20 hover:shadow-lg transition-shadow duration-300">
                    <CardHeader className="pb-2">
                      <div className="flex items-center space-x-2">
                        <BarChart3 className="w-5 h-5 text-red-400" />
                        <CardTitle className="text-sm font-medium text-white">Max Drawdown</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-red-400">
                        {drawdownDisplay}
                      </div>
                      <p className="text-xs text-gray-400 mt-1">
                        Maximum peak-to-trough decline
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 1.4 }}
                >
                  <Card className={`card-material hover:shadow-lg transition-shadow duration-300 ${profitCardClasses}`}>
                    <CardHeader className="pb-2">
                      <div className="flex items-center space-x-2">
                        {hasProfitLoss ? (
                          isProfitable ? (
                            <TrendingUp className="w-5 h-5 text-green-400" />
                          ) : (
                            <TrendingDown className="w-5 h-5 text-red-400" />
                          )
                        ) : (
                          <TrendingUp className="w-5 h-5 text-gray-400" />
                        )}
                        <CardTitle className="text-sm font-medium text-white">P&L</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className={`text-3xl font-bold ${profitTextColor}`}>
                        {profitLossDisplay}
                      </div>
                      <p className="text-xs text-gray-400 mt-1">
                        Total profit/loss
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>

              {/* Video Section */}
              {post.videoUrl && (
                <motion.div 
                  className="aspect-video rounded-xl overflow-hidden shadow-2xl"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 1.5 }}
                >
                  <iframe
                    src={post.videoUrl}
                    title={post.title}
                    className="w-full h-full"
                    allowFullScreen
                  />
                </motion.div>
              )}
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}
