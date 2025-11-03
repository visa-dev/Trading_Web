"use client"

import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"
import { useEffect, useState } from "react"
import { DashboardOverview } from "@/components/dashboard-overview"
import { PerformancePostsManager } from "@/components/performance-posts-manager"
import { VideoManager } from "@/components/video-manager"
import { ReviewsManager } from "@/components/reviews-manager"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart3, FileText, MessageSquare, Star, Video, TrendingUp, Users, DollarSign, Activity, Settings, Bell, Zap, X } from "lucide-react"
import { motion } from "framer-motion"
import { LoadingSpinner } from "@/components/loading-spinner"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MessagesModal } from "@/components/messages-modal"
import { NewPostModal } from "@/components/new-post-modal"
import { AddVideoModal } from "@/components/add-video-modal"
import { ConversationsList } from "@/components/conversations-list"
import { ChatInterface } from "@/components/chat-interface"

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const [dashboardStats, setDashboardStats] = useState({
    totalPosts: 0,
    totalViews: 0,
    totalRevenue: 0,
    activeUsers: 0,
    avgRating: 0,
    totalMessages: 0
  })
  const [loading, setLoading] = useState(true)
  const [showMessagesModal, setShowMessagesModal] = useState(false)
  const [showNewPostModal, setShowNewPostModal] = useState(false)
  const [showAddVideoModal, setShowAddVideoModal] = useState(false)
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null)

  useEffect(() => {
    if (status === "loading") return
    if (!session) {
      redirect("/auth/signin")
    }
    if (session?.user?.role !== "TRADER") {
      redirect("/")
    }
    
    // Fetch dashboard stats
    fetchDashboardStats()
  }, [session, status])

  const fetchDashboardStats = async () => {
    try {
      // Simulate API call for dashboard stats
      await new Promise(resolve => setTimeout(resolve, 1000))
      setDashboardStats({
        totalPosts: 12,
        totalViews: 2847,
        totalRevenue: 15750,
        activeUsers: 156,
        avgRating: 4.8,
        totalMessages: 23
      })
    } catch (error) {
      console.error('Error fetching dashboard stats:', error)
    } finally {
      setLoading(false)
    }
  }

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen hero-bg flex items-center justify-center">
        <LoadingSpinner message="Loading your dashboard..." size="lg" />
      </div>
    )
  }

  if (!session || session.user?.role !== "TRADER") {
    return null
  }

  const stats = [
    {
      icon: BarChart3,
      label: "Total Posts",
      value: dashboardStats.totalPosts,
      change: "+2 this week",
      color: "from-blue-500/10 to-cyan-500/10",
      iconColor: "text-blue-400",
      borderColor: "border-blue-500/20"
    },
    {
      icon: TrendingUp,
      label: "Total Views",
      value: dashboardStats.totalViews.toLocaleString(),
      change: "+12% from last month",
      color: "from-green-500/10 to-emerald-500/10",
      iconColor: "text-green-400",
      borderColor: "border-green-500/20"
    },
    {
      icon: DollarSign,
      label: "Revenue",
      value: `$${dashboardStats.totalRevenue.toLocaleString()}`,
      change: "+8% this quarter",
      color: "from-yellow-500/10 to-orange-500/10",
      iconColor: "text-yellow-400",
      borderColor: "border-yellow-500/20"
    },
    {
      icon: Users,
      label: "Active Users",
      value: dashboardStats.activeUsers,
      change: "+5 new this week",
      color: "from-purple-500/10 to-pink-500/10",
      iconColor: "text-purple-400",
      borderColor: "border-purple-500/20"
    },
    {
      icon: Star,
      label: "Avg Rating",
      value: dashboardStats.avgRating.toFixed(1),
      change: "Based on 89 reviews",
      color: "from-orange-500/10 to-red-500/10",
      iconColor: "text-orange-400",
      borderColor: "border-orange-500/20"
    },
    {
      icon: MessageSquare,
      label: "Messages",
      value: dashboardStats.totalMessages,
      change: "3 unread",
      color: "from-indigo-500/10 to-blue-500/10",
      iconColor: "text-indigo-400",
      borderColor: "border-indigo-500/20"
    }
  ]

  return (
    <div className="min-h-screen hero-bg py-8">
      <div className="max-w-7xl mx-auto container-responsive">
        
        {/* Header Section */}
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
              <p className="text-xl text-gray-300">
                Manage your trading performance and user interactions
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Button className="btn-material">
                <Bell className="w-4 h-4 mr-2" />
                Notifications
              </Button>
              <Button className="btn-material">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
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
                    <div className={`w-12 h-12 bg-gradient-to-r ${stat.color.replace('/10', '/20')} rounded-xl flex items-center justify-center`}>
                      <stat.icon className={`w-6 h-6 ${stat.iconColor}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>


        {/* Main Dashboard Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <Tabs defaultValue="overview" className="w-full">
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
              <DashboardOverview />
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
                  {/* Conversations List */}
                  <div className="w-1/3 border-r border-gray-700/50 pr-4">
                    <ConversationsList 
                      onSelectConversation={setSelectedConversationId}
                      selectedConversationId={selectedConversationId}
                    />
                  </div>
                  
                  {/* Chat Interface */}
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

      {/* Modals */}
      <MessagesModal 
        isOpen={showMessagesModal} 
        onClose={() => setShowMessagesModal(false)} 
      />
      <NewPostModal 
        isOpen={showNewPostModal} 
        onClose={() => setShowNewPostModal(false)} 
      />
      <AddVideoModal 
        isOpen={showAddVideoModal} 
        onClose={() => setShowAddVideoModal(false)} 
      />
    </div>
  )
}