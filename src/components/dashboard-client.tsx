"use client"

import { useEffect, useState, useCallback, useRef } from "react"
import { Session } from "next-auth"
import { DashboardOverview, DashboardStats, DashboardActivityItem } from "@/components/dashboard-overview"
import { PerformancePostsManager } from "@/components/performance-posts-manager"
import { VideoManager } from "@/components/video-manager"
import { ReviewsManager } from "@/components/reviews-manager"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart3, FileText, MessageSquare, Star, Video, TrendingUp, Users, Settings, Bell, AlertTriangle } from "lucide-react"
import { motion } from "framer-motion"
import { LoadingSpinner } from "@/components/loading-spinner"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MessagesModal } from "@/components/messages-modal"
import { NewPostModal } from "@/components/new-post-modal"
import { AddVideoModal } from "@/components/add-video-modal"
import { ConversationsList } from "@/components/conversations-list"
import { ChatInterface } from "@/components/chat-interface"

interface DashboardClientProps {
  session: Session
}

export function DashboardClient({ session }: DashboardClientProps) {
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null)
  const [recentActivity, setRecentActivity] = useState<DashboardActivityItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showMessagesModal, setShowMessagesModal] = useState(false)
  const [showNewPostModal, setShowNewPostModal] = useState(false)
  const [showAddVideoModal, setShowAddVideoModal] = useState(false)
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null)

  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")
  const notificationsRef = useRef<HTMLDivElement | null>(null)

  const fetchDashboardStats = useCallback(async () => {
    try {
      const response = await fetch("/api/dashboard/stats")
      if (!response.ok) {
        throw new Error("Failed to load dashboard stats")
      }
      const data = await response.json()
      setDashboardStats(data.stats)
      setRecentActivity(Array.isArray(data.activity) ? data.activity : [])
    } catch (error) {
      console.error("Error fetching dashboard stats:", error)
      setError("Unable to load dashboard statistics right now. Please try again shortly.")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchDashboardStats()
    const interval = setInterval(fetchDashboardStats, 15000)
    return () => clearInterval(interval)
  }, [fetchDashboardStats])

  useEffect(() => {
    if (!notificationsOpen) return

    const handleClickOutside = (event: MouseEvent) => {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setNotificationsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [notificationsOpen])

  if (loading) {
    return (
      <div className="min-h-screen hero-bg flex items-center justify-center">
        <LoadingSpinner message="Loading your dashboard..." size="lg" />
      </div>
    )
  }

  if (error || !dashboardStats) {
    return (
      <div className="min-h-screen hero-bg flex items-center justify-center px-4">
        <Card className="card-material max-w-lg w-full">
          <CardContent className="p-10 text-center space-y-4">
            <AlertTriangle className="w-10 h-10 mx-auto text-yellow-400" />
            <h2 className="text-xl font-semibold text-white">Dashboard data unavailable</h2>
            <p className="text-sm text-gray-400">
              {error ?? "We couldn’t retrieve the latest statistics."} Please refresh the page or try again later.
            </p>
            <Button className="btn-material mt-4" onClick={() => window.location.reload()}>
              Reload Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const notificationBadgeCount =
    (dashboardStats.pendingReviews ?? 0) + (dashboardStats.unreadMessages ?? 0)

  const stats = [
    {
      icon: BarChart3,
      label: "Total Posts",
      value: dashboardStats.totalPosts,
      change: `${dashboardStats.publishedPosts} published`,
      color: "from-blue-500/10 to-cyan-500/10",
      iconColor: "text-blue-400",
      borderColor: "border-blue-500/20",
    },
    {
      icon: TrendingUp,
      label: "Performance Posts",
      value: dashboardStats.performancePosts,
      change: `${dashboardStats.analyticsPosts} analytics posts`,
      color: "from-green-500/10 to-emerald-500/10",
      iconColor: "text-green-400",
      borderColor: "border-green-500/20",
    },
    {
      icon: Users,
      label: "Total Reviews",
      value: dashboardStats.totalReviews,
      change: `${dashboardStats.pendingReviews} pending approval`,
      color: "from-purple-500/10 to-pink-500/10",
      iconColor: "text-purple-400",
      borderColor: "border-purple-500/20",
    },
    {
      icon: Star,
      label: "Average Rating",
      value: dashboardStats.averageRating.toFixed(1),
      change: "Across all approved reviews",
      color: "from-orange-500/10 to-red-500/10",
      iconColor: "text-orange-400",
      borderColor: "border-orange-500/20",
    },
    {
      icon: Video,
      label: "Education Videos",
      value: dashboardStats.totalVideos,
      change: `${dashboardStats.averageWinRate.toFixed(1)}% avg win rate`,
      color: "from-indigo-500/10 to-blue-500/10",
      iconColor: "text-indigo-400",
      borderColor: "border-indigo-500/20",
    },
    {
      icon: MessageSquare,
      label: "Unread Messages",
      value: dashboardStats.unreadMessages,
      change: `${dashboardStats.totalConversations} total conversations`,
      color: "from-teal-500/10 to-cyan-500/10",
      iconColor: "text-teal-300",
      borderColor: "border-teal-500/20",
    },
  ]

  return (
    <div className="min-h-screen hero-bg py-8">
      <div className="max-w-7xl mx-auto container-responsive">
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">
                Trader
                <span className="block gradient-text-gold">Dashboard</span>
              </h1>
              <p className="text-xl text-gray-300">Manage your trading performance and user interactions</p>
            </div>
            <div className="flex items-center">
              <div className="relative" ref={notificationsRef}>
                <Button
                  className="btn-material relative"
                  onClick={() => setNotificationsOpen((prev) => !prev)}
                  aria-expanded={notificationsOpen}
                  aria-haspopup="true"
                >
                  <Bell className="w-4 h-4 mr-2" />
                  Notifications
                  {notificationBadgeCount > 0 && (
                    <span className="ml-2 inline-flex items-center justify-center min-w-[1.5rem] h-6 px-2 rounded-full bg-red-500 text-white text-xs font-semibold">
                      {notificationBadgeCount > 99 ? "99+" : notificationBadgeCount}
                    </span>
                  )}
                </Button>

                {notificationsOpen && (
                  <motion.div
                    className="absolute right-0 mt-3 w-72 rounded-2xl border border-gray-700 bg-gray-900/95 shadow-2xl backdrop-blur z-20"
                    initial={{ opacity: 0, y: -10, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.97 }}
                  >
                    <div className="px-4 py-3 border-b border-gray-800 flex items-center justify-between">
                      <p className="text-sm font-semibold text-white">Notifications</p>
                      <span className="text-xs text-gray-400">
                        {notificationBadgeCount > 0 ? "Action required" : "All caught up"}
                      </span>
                    </div>
                    <div className="p-3 space-y-3">
                      <div className="flex items-center justify-between rounded-lg border border-gray-800/80 bg-gray-800/40 px-3 py-3">
                        <div>
                          <p className="text-sm font-medium text-white">Pending reviews</p>
                          <p className="text-xs text-gray-400">
                            Posts & trader feedback awaiting approval
                          </p>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-gray-700 text-yellow-400 hover:bg-yellow-500/10"
                          onClick={() => {
                            setActiveTab("reviews")
                            setNotificationsOpen(false)
                          }}
                        >
                          {dashboardStats.pendingReviews}
                        </Button>
                      </div>
                      <div className="flex items-center justify-between rounded-lg border border-gray-800/80 bg-gray-800/40 px-3 py-3">
                        <div>
                          <p className="text-sm font-medium text-white">Unread messages</p>
                          <p className="text-xs text-gray-400">
                            User conversations needing replies
                          </p>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-gray-700 text-yellow-400 hover:bg-yellow-500/10"
                          onClick={() => {
                            setActiveTab("messages")
                            setNotificationsOpen(false)
                          }}
                        >
                          {dashboardStats.unreadMessages}
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
              whileHover={{ y: -5, scale: 1.02 }}
            >
              <Card className={`card-material bg-gradient-to-br ${stat.color} ${stat.borderColor} hover:shadow-xl transition-all duration-300`}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`${stat.iconColor} text-sm font-medium mb-1`}>{stat.label}</p>
                      <p className="text-2xl font-bold text-white mb-1">{stat.value}</p>
                      <p className="text-xs text-gray-400">{stat.change}</p>
                    </div>
                    <div className={`w-12 h-12 bg-gradient-to-r ${stat.color.replace("/10", "/20")} rounded-xl flex items-center justify-center`}>
                      <stat.icon className={`w-6 h-6 ${stat.iconColor}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-5 bg-navy-800/50 border-navy-700">
              <TabsTrigger
                value="overview"
                className="flex items-center space-x-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-yellow-500 data-[state=active]:to-orange-500 data-[state=active]:text-navy-900"
              >
                <BarChart3 className="w-4 h-4" />
                <span>Overview</span>
              </TabsTrigger>
              <TabsTrigger
                value="posts"
                className="flex items-center space-x-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-yellow-500 data-[state=active]:to-orange-500 data-[state=active]:text-navy-900"
              >
                <FileText className="w-4 h-4" />
                <span>Posts</span>
              </TabsTrigger>
              <TabsTrigger
                value="videos"
                className="flex items-center space-x-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-yellow-500 data-[state=active]:to-orange-500 data-[state=active]:text-navy-900"
              >
                <Video className="w-4 h-4" />
                <span>Videos</span>
              </TabsTrigger>
              <TabsTrigger
                value="reviews"
                className="flex items-center space-x-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-yellow-500 data-[state=active]:to-orange-500 data-[state=active]:text-navy-900"
              >
                <Star className="w-4 h-4" />
                <span>Reviews</span>
              </TabsTrigger>
              <TabsTrigger
                value="messages"
                className="flex items-center space-x-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-yellow-500 data-[state=active]:to-orange-500 data-[state=active]:text-navy-900"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Messages</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-6">
              <DashboardOverview stats={dashboardStats} activity={recentActivity} />
            </TabsContent>

            <TabsContent value="posts" className="mt-6">
              <PerformancePostsManager />
            </TabsContent>

            <TabsContent value="videos" className="mt-6">
              <VideoManager />
            </TabsContent>

            <TabsContent value="reviews" className="mt-6">
              <ReviewsManager />
            </TabsContent>

            <TabsContent value="messages" className="mt-6">
              <motion.div
                className="h-[70vh]"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
              >
                <div className="flex h-full">
                  <div className="w-1/3 border-r border-gray-700/50 pr-4">
                    <ConversationsList onSelectConversation={setSelectedConversationId} selectedConversationId={selectedConversationId} />
                  </div>
                  <div className="flex-1 pl-4">
                    {selectedConversationId ? (
                      <ChatInterface conversationId={selectedConversationId} />
                    ) : (
                      <div className="flex-1 flex items-center justify-center text-gray-300">
                        <div className="text-center">
                          <MessageSquare className="w-16 h-16 mx-auto mb-4 text-gray-500" />
                          <p className="text-lg">Select a conversation</p>
                          <p className="text-sm text-gray-400">to view messages</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>

      <MessagesModal isOpen={showMessagesModal} onClose={() => setShowMessagesModal(false)} />
      <NewPostModal isOpen={showNewPostModal} onClose={() => setShowNewPostModal(false)} />
      <AddVideoModal isOpen={showAddVideoModal} onClose={() => setShowAddVideoModal(false)} />
    </div>
  )
}



