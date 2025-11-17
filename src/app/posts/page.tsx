"use client"

import { useEffect, useState } from "react"
import { PerformanceCard } from "@/components/performance-card"
import { motion } from "framer-motion"
import { TrendingUp, BarChart3, Filter, Search, Calendar, ArrowLeft, Eye } from "lucide-react"
import { LoadingSpinner } from "@/components/loading-spinner"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ACCOUNT_PERFORMANCE_LINKS } from "@/lib/constants"

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
  reviews: Array<{ rating: number }>
}

const performanceLinks = ACCOUNT_PERFORMANCE_LINKS;

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
      const response = await fetch('/api/posts?published=true&type=PERFORMANCE')
      if (response.ok) {
        const data = await response.json()
        const postsArray: PerformancePost[] = Array.isArray(data) ? data : (data.posts || [])
        const performancePosts = postsArray.filter((post) => post.type === "PERFORMANCE")
        setPosts(performancePosts)
      }
    } catch (error) {
      console.error('Error fetching performance posts:', error)
    } finally {
      setLoading(false)
    }
  }

  const searchLower = searchTerm.toLowerCase()
  const filteredPosts = posts.filter(post => {
    const descriptionText = (post.description || "").toLowerCase()
    const matchesSearch =
      post.title.toLowerCase().includes(searchLower) ||
      descriptionText.includes(searchLower)

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

          {/* Account Management Performance Card */}
          <Card className="card-material border border-slate-800/60 bg-slate-900/60 mb-8">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl sm:text-2xl text-white px-2 sm:px-0">
                Account Management Performance
              </CardTitle>
          
            </CardHeader>

            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4 px-2 sm:px-4">
              {performanceLinks.map((link, index) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ scale: 1.03, boxShadow: "0 8px 20px rgba(0,0,0,0.5)" }}
                  whileTap={{ scale: 0.97 }}
                  className="block rounded-xl border border-slate-800/60 bg-slate-900/40 p-4 min-h-[100px] flex items-center transition-colors hover:bg-slate-900/60 cursor-pointer"
                >
                  <p className="text-xs sm:text-sm font-semibold text-yellow-400 uppercase tracking-wide">
                    {link.label}
                  </p>
                </motion.a>
              ))}
            </CardContent>
          </Card>


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
                <p className="text-gray-300">
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
                    className="btn-material mt-4"
                  >
                    Clear Filters
                  </Button>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  )
}
