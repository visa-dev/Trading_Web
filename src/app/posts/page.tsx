"use client"

import { useEffect, useState } from "react"
import { PerformanceCard } from "@/components/performance-card"
import { motion } from "framer-motion"
import { TrendingUp, BarChart3, Filter, Search, Calendar, ArrowLeft, Eye, Star } from "lucide-react"
import { LoadingSpinner } from "@/components/loading-spinner"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface PerformancePost {
  id: string
  title: string
  description: string
  profitLoss: number
  winRate: number
  drawdown: number
  riskReward: number
  imageUrl?: string | null
  videoUrl?: string | null
  published: boolean
  createdAt: string
  reviews: Array<{
    rating: number
  }>
}

export default function PostsPage() {
  const [posts, setPosts] = useState<PerformancePost[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterPeriod, setFilterPeriod] = useState("all")

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/posts?published=true')
      if (response.ok) {
        const data = await response.json()
        console.log('API Response:', data)
        
        // Handle both response formats: {posts: [...]} or [...]
        const postsArray = Array.isArray(data) ? data : (data.posts || [])
        console.log('Posts fetched:', postsArray.length, 'posts')
        console.log('First post:', postsArray[0])
        setPosts(postsArray)
      }
    } catch (error) {
      console.error('Error fetching performance posts:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.description.toLowerCase().includes(searchTerm.toLowerCase())

    if (filterPeriod === "all") return matchesSearch
    
    const postDate = new Date(post.createdAt)
    const now = new Date()
    const daysDiff = Math.floor((now.getTime() - postDate.getTime()) / (1000 * 60 * 60 * 24))
    
    switch (filterPeriod) {
      case "week":
        return matchesSearch && daysDiff <= 7
      case "month":
        return matchesSearch && daysDiff <= 30
      case "quarter":
        return matchesSearch && daysDiff <= 90
      default:
        return matchesSearch
    }
  })

  console.log('Filtered posts:', filteredPosts.length, 'out of', posts.length, 'total posts')

  const getPerformanceStats = () => {
    if (posts.length === 0) return { totalTrades: 0, avgWinRate: 0, totalProfit: 0 }
    
    const totalTrades = posts.length
    const avgWinRate = posts.reduce((sum, post) => sum + post.winRate, 0) / totalTrades
    const totalProfit = posts.reduce((sum, post) => sum + post.profitLoss, 0)
    
    return { totalTrades, avgWinRate, totalProfit }
  }

  const stats = getPerformanceStats()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 py-12">
      <div className="max-w-7xl mx-auto container-responsive">
        
        {/* Header Section */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-yellow-400 hover:text-yellow-300 transition-colors">
                <ArrowLeft className="w-6 h-6" />
              </Link>
              <div>
                <h1 className="text-4xl font-bold text-white mb-2">
                  Trading
                  <span className="block gradient-text-gold">Performance</span>
                </h1>
                <p className="text-xl text-gray-300">
                  Real-time trading results and performance analytics
                </p>
              </div>
            </div>
          </div>

          {/* Performance Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <Card className="card-material bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-blue-500/20">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-400 text-sm font-medium">Total Trades</p>
                      <p className="text-2xl font-bold text-white">{stats.totalTrades}</p>
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                      <BarChart3 className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card className="card-material bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/20">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-400 text-sm font-medium">Avg Win Rate</p>
                      <p className="text-2xl font-bold text-white">{stats.avgWinRate.toFixed(1)}%</p>
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Card className="card-material bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border-yellow-500/20">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-yellow-400 text-sm font-medium">Total Profit</p>
                      <p className="text-2xl font-bold text-white">
                        ${stats.totalProfit.toLocaleString()}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center">
                      <Star className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Search and Filter Section */}
          <motion.div
            className="flex flex-col md:flex-row gap-4 items-center justify-between"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search trading posts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-gray-800/50 border-gray-700 text-white placeholder-gray-400 focus:border-yellow-400"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <select
                value={filterPeriod}
                onChange={(e) => setFilterPeriod(e.target.value)}
                className="bg-gray-800/50 border border-gray-700 text-white rounded-lg px-3 py-2 focus:border-yellow-400 focus:outline-none"
              >
                <option value="all">All Time</option>
                <option value="week">Last Week</option>
                <option value="month">Last Month</option>
                <option value="quarter">Last Quarter</option>
              </select>
            </div>
          </motion.div>
        </motion.div>

        {/* Posts Grid */}
        {loading ? (
          <motion.div
            className="flex items-center justify-center py-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <LoadingSpinner message="Loading trading performance data..." size="lg" />
          </motion.div>
        ) : filteredPosts.length > 0 ? (
          <>
            <div className="mb-4 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <p className="text-white">
                Debug: Rendering {filteredPosts.length} posts
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <PerformanceCard post={post} />
                </motion.div>
              ))}
            </div>
          </>
        ) : (
          <motion.div 
            className="text-center py-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Card className="card-material max-w-md mx-auto">
              <CardContent className="p-12 text-center">
                <Eye className="w-16 h-16 mx-auto mb-6 text-gray-400" />
                <h3 className="text-xl font-bold text-white mb-4">No Posts Found</h3>
                <p className="text-gray-300 mb-6">
                  {searchTerm || filterPeriod !== "all" 
                    ? "No posts match your current search or filter criteria."
                    : "No trading performance posts available yet."
                  }
                </p>
                {(searchTerm || filterPeriod !== "all") && (
                  <Button
                    onClick={() => {
                      setSearchTerm("")
                      setFilterPeriod("all")
                    }}
                    className="btn-material"
                  >
                    Clear Filters
                  </Button>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Results Summary */}
        {!loading && filteredPosts.length > 0 && (
          <motion.div
            className="mt-12 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <p className="text-gray-400">
              Showing {filteredPosts.length} of {posts.length} trading performance posts
              {searchTerm && ` for "${searchTerm}"`}
              {filterPeriod !== "all" && ` in the last ${filterPeriod}`}
            </p>
          </motion.div>
        )}
      </div>
    </div>
  )
}