"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, MessageSquare, Star, Users, Eye, Activity, Zap, Clock, CheckCircle } from "lucide-react"
import { motion } from "framer-motion"
import { LoadingSpinner } from "@/components/loading-spinner"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

interface DashboardStats {
  totalPosts: number
  publishedPosts: number
  totalReviews: number
  averageRating: number
  totalConversations: number
  unreadMessages: number
  totalViews: number
}

export function DashboardOverview() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      setStats({
        totalPosts: 12,
        publishedPosts: 10,
        totalReviews: 89,
        averageRating: 4.8,
        totalConversations: 23,
        unreadMessages: 3,
        totalViews: 2847
      })
    } catch (error) {
      console.error('Error fetching dashboard stats:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <LoadingSpinner message="Loading dashboard overview..." size="md" />
      </div>
    )
  }

  if (!stats) {
    return (
      <Card className="card-material">
        <CardContent className="p-12 text-center">
          <p className="text-gray-400">Unable to load dashboard statistics</p>
        </CardContent>
      </Card>
    )
  }

  const statCards = [
    {
      title: "Total Posts",
      value: stats.totalPosts.toString(),
      description: `${stats.publishedPosts} published`,
      icon: TrendingUp,
      color: "from-blue-500/10 to-cyan-500/10",
      iconColor: "text-blue-400",
      borderColor: "border-blue-500/20",
      change: "+2 this week"
    },
    {
      title: "Reviews",
      value: stats.totalReviews.toString(),
      description: `${stats.averageRating.toFixed(1)} avg rating`,
      icon: Star,
      color: "from-yellow-500/10 to-orange-500/10",
      iconColor: "text-yellow-400",
      borderColor: "border-yellow-500/20",
      change: "+5 this month"
    },
    {
      title: "Conversations",
      value: stats.totalConversations.toString(),
      description: `${stats.unreadMessages} unread`,
      icon: MessageSquare,
      color: "from-green-500/10 to-emerald-500/10",
      iconColor: "text-green-400",
      borderColor: "border-green-500/20",
      change: "Active now"
    },
    {
      title: "Total Views",
      value: stats.totalViews.toLocaleString(),
      description: "All time views",
      icon: Eye,
      color: "from-purple-500/10 to-pink-500/10",
      iconColor: "text-purple-400",
      borderColor: "border-purple-500/20",
      change: "+12% this week"
    }
  ]

  const recentActivities = [
    {
      type: "review",
      title: "New 5-star review received",
      description: "Great trading insights! Very professional.",
      time: "2 hours ago",
      icon: Star,
      color: "text-green-400",
      bgColor: "bg-green-500/10"
    },
    {
      type: "post",
      title: "Performance post published",
      description: "Q4 2024 Trading Results - 45% Returns",
      time: "1 day ago",
      icon: TrendingUp,
      color: "text-blue-400",
      bgColor: "bg-blue-500/10"
    },
    {
      type: "message",
      title: "New message from user",
      description: "Question about risk management strategy",
      time: "2 days ago",
      icon: MessageSquare,
      color: "text-purple-400",
      bgColor: "bg-purple-500/10"
    },
    {
      type: "video",
      title: "Trading video uploaded",
      description: "Live EUR/USD Breakout Strategy Session",
      time: "3 days ago",
      icon: Activity,
      color: "text-orange-400",
      bgColor: "bg-orange-500/10"
    }
  ]

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {statCards.map((stat, index) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -5, scale: 1.02 }}
            >
              <Card className={`card-material bg-gradient-to-br ${stat.color} ${stat.borderColor} hover:shadow-xl transition-all duration-300`}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-gray-300">
                      {stat.title}
                    </CardTitle>
                    <Icon className={`h-5 w-5 ${stat.iconColor}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-gray-400">{stat.description}</p>
                    <Badge className="badge-info text-xs">{stat.change}</Badge>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </motion.div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 gap-8">
        
        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Card className="card-material bg-gradient-to-br from-navy-800/50 to-navy-700/50 border-navy-600/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Activity className="w-5 h-5 mr-2 text-yellow-400" />
                Recent Activity
              </CardTitle>
              <CardDescription className="text-gray-400">
                Latest updates on your trading performance platform
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity, index) => {
                  const Icon = activity.icon
                  return (
                    <motion.div
                      key={index}
                      className="flex items-start space-x-4 p-3 rounded-lg hover:bg-navy-700/30 transition-colors"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
                    >
                      <div className={`w-10 h-10 ${activity.bgColor} rounded-xl flex items-center justify-center flex-shrink-0`}>
                        <Icon className={`w-5 h-5 ${activity.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white">{activity.title}</p>
                        <p className="text-xs text-gray-400 truncate">{activity.description}</p>
                        <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>

      </div>

      {/* Performance Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
      >
        <Card className="card-material bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border-yellow-500/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <CheckCircle className="w-5 h-5 mr-2 text-yellow-400" />
              Performance Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-400 mb-2">{stats.averageRating}</div>
                <div className="text-sm text-gray-300 mb-1">Average Rating</div>
                <div className="flex justify-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-4 h-4 ${
                        star <= Math.floor(stats.averageRating)
                          ? "text-yellow-400 fill-current"
                          : "text-gray-600"
                      }`}
                    />
                  ))}
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400 mb-2">{stats.publishedPosts}</div>
                <div className="text-sm text-gray-300 mb-1">Published Posts</div>
                <div className="text-xs text-gray-400">Out of {stats.totalPosts} total</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400 mb-2">{stats.totalViews.toLocaleString()}</div>
                <div className="text-sm text-gray-300 mb-1">Total Views</div>
                <div className="text-xs text-gray-400">All time engagement</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}