"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { PerformanceCard } from "@/components/performance-card"
import { Hero } from "@/components/hero"
import { SocialTradingOverview } from "@/components/social-trading-overview"
import { Footer } from "@/components/footer"
import { MyFXBookIframe } from "@/components/myfxbook-iframe"
import { ReviewsCarousel } from "@/components/reviews-carousel"
import { VideoCard } from "@/components/video-card"
import { VideoModal } from "@/components/video-modal"
import { LoadingSpinner } from "@/components/loading-spinner"
import { motion } from "framer-motion"
import { TrendingUp, BarChart3, Shield, ArrowRight, Zap, Sparkles, Brain, Eye, Video } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

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

interface TradingVideo {
  id: string
  title: string
  youtubeUrl: string
  description: string
  createdAt: string | Date
}

export default function Home() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [performancePosts, setPerformancePosts] = useState<PerformancePost[]>([])
  const [analyticsPosts, setAnalyticsPosts] = useState<PerformancePost[]>([])
  const [videos, setVideos] = useState<TradingVideo[]>([])
  const [postsLoading, setPostsLoading] = useState(true)
  const [videosLoading, setVideosLoading] = useState(true)
  const [selectedVideo, setSelectedVideo] = useState<TradingVideo | null>(null)
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false)
  const [showAllPerformanceLinks, setShowAllPerformanceLinks] = useState(false)
  const userRole = (session?.user as { role?: string } | undefined)?.role ?? null

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/posts?published=true')
      if (response.ok) {
        const data = await response.json()
        const postsArray: PerformancePost[] = Array.isArray(data) ? data : (data.posts || [])
        const performance = postsArray.filter((post) => post.type === "PERFORMANCE").slice(0, 6)
        const analytics = postsArray.filter((post) => post.type === "ANALYTICS").slice(0, 6)
        setPerformancePosts(performance)
        setAnalyticsPosts(analytics)
      }
    } catch (error) {
      console.error('Error fetching performance posts:', error)
    } finally {
      setPostsLoading(false)
    }
  }

  const handleWatchVideo = (video: TradingVideo) => {
    setSelectedVideo(video)
    setIsVideoModalOpen(true)
  }

  const handleCloseVideoModal = () => {
    setIsVideoModalOpen(false)
    setSelectedVideo(null)
  }

  const fetchVideos = async () => {
    try {
      const response = await fetch('/api/videos')
      if (response.ok) {
        const data = await response.json()
        setVideos(data.videos.slice(0, 6)) // Show only first 6 videos
      }
    } catch (error) {
      console.error('Error fetching videos:', error)
    } finally {
      setVideosLoading(false)
    }
  }

  useEffect(() => {
    if (userRole === "TRADER") {
      router.push('/dashboard')
      return
    }
    
    // Fetch posts and videos for all non-traders (including non-authenticated users)
    fetchPosts()
    fetchVideos()
  }, [userRole, router])

  // Show loading while checking session or redirecting traders
  if (status === "loading" || userRole === "TRADER") {
    return (
      <div className="min-h-screen hero-bg flex items-center justify-center">
        <LoadingSpinner message="Preparing your dashboard..." />
      </div>
    )
  }

  const features = [
    {
      icon: Brain,
      title: "Signal-Driven Analytics",
      description: "Advanced quantitative models analyze market patterns and predict trends with 94% accuracy",
      color: "text-purple-400",
      bgColor: "from-purple-500/10 to-pink-500/10",
      borderColor: "border-purple-500/20",
      iconBg: "from-purple-500 to-pink-500"
    },
    {
      icon: Zap,
      title: "Real-time Execution",
      description: "Lightning-fast trade execution with sub-millisecond latency and institutional-grade infrastructure",
      color: "text-blue-400",
      bgColor: "from-blue-500/10 to-cyan-500/10",
      borderColor: "border-blue-500/20",
      iconBg: "from-blue-500 to-cyan-500"
    },
    {
      icon: Shield,
      title: "Advanced Risk Management",
      description: "Multi-layered risk controls with adaptive position sizing and dynamic stop-loss algorithms",
      color: "text-green-400",
      bgColor: "from-green-500/10 to-emerald-500/10",
      borderColor: "border-green-500/20",
      iconBg: "from-green-500 to-emerald-500"
    },
    {
      icon: Eye,
      title: "Predictive Insights",
      description: "Next-generation market analysis with sentiment tracking and predictive modeling capabilities",
      color: "text-orange-400",
      bgColor: "from-orange-500/10 to-yellow-500/10",
      borderColor: "border-orange-500/20",
      iconBg: "from-orange-500 to-yellow-500"
    }
  ]

  const accountPerformanceLinks = [
    {
      label: "Primary Dashboard",
      description: "Account management performance overview on SocialTradeTools",
      href: "https://my.socialtradertools.com/view/LktDiabPtIzhEnNt",
    },
    {
      label: "Live Performance #1",
      description: "Verified live performance stream with key account metrics",
      href: "https://my.socialtradertools.com/view/MyimZHO9sgMkMxiw",
    },
    {
      label: "Live Performance #2",
      description: "Diversified strategy performance feed updated in real time",
      href: "https://my.socialtradertools.com/view/C3pe6Rbmad180C1Y",
    },
    {
      label: "Live Performance #3",
      description: "Extended account analytics and equity growth tracking",
      href: "https://my.socialtradertools.com/view/BdkyYOHAqk9WJPFt",
    },
  ]

  const visiblePerformanceLinks = showAllPerformanceLinks
    ? accountPerformanceLinks
    : accountPerformanceLinks.slice(0, 2)

  return (
    <div className="min-h-screen">
      <Hero />
      <SocialTradingOverview />
      
      {/* MyFXBook Iframe Section */}
      <MyFXBookIframe />
      
      {/* Modern Features Section */}
      <section className="section-spacing bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700">
        <div className="max-w-7xl mx-auto container-responsive">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center space-x-2 mb-6">
              <Sparkles className="w-5 h-5 text-yellow-400" />
              <span className="text-sm font-medium text-yellow-400 uppercase tracking-wider">Next-Generation Technology</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
              Powered by
              <span className="block gradient-text-gold animate-gradient" style={{ backgroundSize: "200% 200%" }}>
                Advanced Signal Intelligence
              </span>
            </h2>
            <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto">
              Experience the future of trading with cutting-edge quantitative research and real-time signal processing
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 items-stretch">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                className="group h-full"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
              >
                <div className={`card-material flex h-full flex-col justify-between p-8 hover:border-yellow-400/50 transition-all duration-500 bg-gradient-to-br ${feature.bgColor} border ${feature.borderColor}`}>
                  <motion.div
                    className={`w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-r ${feature.iconBg} flex items-center justify-center shadow-lg group-hover:scale-110 transition-all duration-300`}
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                  >
                    <feature.icon className="w-8 h-8 text-white" />
                  </motion.div>
                  
                  <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-yellow-400 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-300 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Analytics Posts Section */}
      <section className="section-spacing bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700">
        <div className="max-w-7xl mx-auto container-responsive">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center space-x-2 mb-6">
              <TrendingUp className="w-5 h-5 text-yellow-400" />
              <span className="text-sm font-medium text-yellow-400 uppercase tracking-wider">Market Intelligence</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
              Deep-Dive
              <span className="block gradient-text-gold animate-gradient" style={{ backgroundSize: "200% 200%" }}>
                Analytics Posts
              </span>
            </h2>
            <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto">
              Explore strategy breakdowns and signal-backed analysis from our professional traders.
            </p>
          </motion.div>

          {postsLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <motion.div
                  key={`analytics-skeleton-${i}`}
                  className="animate-pulse"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                >
                  <div className="card-material p-6">
                    <div className="h-6 bg-gray-700 rounded mb-4"></div>
                    <div className="h-4 bg-gray-700 rounded mb-2"></div>
                    <div className="h-4 bg-gray-700 rounded w-3/4 mb-6"></div>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="h-16 bg-gray-700 rounded"></div>
                      <div className="h-16 bg-gray-700 rounded"></div>
                    </div>
                    <div className="h-8 bg-gray-700 rounded"></div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : analyticsPosts.length > 0 ? (
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              {analyticsPosts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <PerformanceCard post={post} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              className="text-center py-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="card-material p-12 max-w-xl mx-auto">
                <BarChart3 className="w-16 h-16 mx-auto mb-6 text-gray-400" />
                <h3 className="text-xl font-bold text-white mb-4">No Analytics Posts Yet</h3>
                <p className="text-gray-300">
                  Traders will soon share in-depth analytics and strategy breakdowns here.
                </p>
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* Live Performance Section */}
      <section className="section-spacing performance-bg">
        <div className="max-w-7xl mx-auto container-responsive">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center space-x-2 mb-6">
              <BarChart3 className="w-5 h-5 text-yellow-400" />
              <span className="text-sm font-medium text-yellow-400 uppercase tracking-wider">Live Performance</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
              Real-Time
              <span className="block gradient-text-gold animate-gradient" style={{ backgroundSize: "200% 200%" }}>
                Trading Results
              </span>
            </h2>
            <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto">
              Witness the power of signal-driven trading with live performance data and transparent analytics
            </p>
          </motion.div>

         

          {postsLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <motion.div
                  key={i}
                  className="animate-pulse"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                >
                  <div className="card-material p-6">
                    <div className="h-6 bg-gray-700 rounded mb-4"></div>
                    <div className="h-4 bg-gray-700 rounded mb-2"></div>
                    <div className="h-4 bg-gray-700 rounded w-3/4 mb-6"></div>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="h-16 bg-gray-700 rounded"></div>
                      <div className="h-16 bg-gray-700 rounded"></div>
                    </div>
                    <div className="h-8 bg-gray-700 rounded"></div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : performancePosts.length > 0 ? (
            <motion.div 
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              {performancePosts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <PerformanceCard post={post} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div 
              className="text-center py-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="card-material p-12 max-w-md mx-auto">
                <TrendingUp className="w-16 h-16 mx-auto mb-6 text-gray-400" />
                <h3 className="text-xl font-bold text-white mb-4">No Performance Posts Yet</h3>
                <p className="text-gray-300 mb-6">
                  Trading results will be published here once new performance posts go live. Check back soon for verified updates.
                </p>
                <Link 
                  href="/copy-trading"
                  className="inline-flex items-center px-6 py-3 btn-material"
                >
                  <Zap className="w-4 h-4 mr-2" />
                  Copy Trading
                </Link>
              </div>
            </motion.div>
          )}

          {/* Modern CTA Section */}
          <motion.div 
            className="text-center mt-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link 
                href="/posts"
                className="inline-flex items-center px-8 py-4 btn-material text-lg shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Eye className="w-5 h-5 mr-3" />
                Explore All Performance
                <ArrowRight className="w-5 h-5 ml-3" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Trading Videos Section */}
      <section className="section-spacing bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700">
        <div className="max-w-7xl mx-auto container-responsive">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center space-x-2 mb-6">
              <Video className="w-5 h-5 text-yellow-500" />
              <span className="text-sm font-medium text-yellow-400 uppercase tracking-wider">Trading Education</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
              Watch & Learn from
              <span className="block gradient-text-gold animate-gradient" style={{ backgroundSize: "200% 200%" }}>
                Expert Analysis
              </span>
            </h2>
            <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto">
              Learn trading strategies, market insights, and performance breakdowns from professional trader videos
            </p>
          </motion.div>

          <div className="space-y-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <h3 className="text-2xl font-semibold text-white mb-6">Education Videos</h3>
              {videosLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <motion.div
                      key={`video-skeleton-${i}`}
                      className="animate-pulse"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: i * 0.1 }}
                    >
                      <div className="bg-gray-800/50 rounded-xl shadow-lg p-6">
                        <div className="h-48 bg-gray-700 rounded mb-4"></div>
                        <div className="h-6 bg-gray-700 rounded mb-4"></div>
                        <div className="h-4 bg-gray-700 rounded mb-2"></div>
                        <div className="h-4 bg-gray-700 rounded w-3/4 mb-4"></div>
                        <div className="h-10 bg-gray-700 rounded"></div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : videos.length > 0 ? (
                <motion.div 
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.8 }}
                  viewport={{ once: true }}
                >
                  {videos.map((video, index) => (
                    <motion.div
                      key={video.id}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      viewport={{ once: true }}
                    >
                      <VideoCard video={video} onWatch={handleWatchVideo} />
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <motion.div 
                  className="text-center py-16"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  viewport={{ once: true }}
                >
                  <div className="bg-gray-800/50 rounded-xl shadow-lg p-12 max-w-md mx-auto">
                    <Video className="w-16 h-16 mx-auto mb-6 text-gray-400" />
                    <h3 className="text-xl font-bold text-white mb-4">No Videos Yet</h3>
                    <p className="text-gray-300 mb-6">
                      Trading performance videos are being uploaded. Check back soon for educational content.
                    </p>
                    <Link 
                      href="/auth/signin"
                      className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-lg hover:from-yellow-600 hover:to-orange-600 transition-all"
                    >
                      <Zap className="w-4 h-4 mr-2" />
                      Get Started
                    </Link>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </div>

          {/* CTA Section */}
          {videos.length > 0 && (
            <motion.div 
              className="text-center mt-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link 
                  href="/videos"
                  className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white rounded-xl text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <Video className="w-5 h-5 mr-3" />
                  Watch All Videos
                  <ArrowRight className="w-5 h-5 ml-3" />
                </Link>
              </motion.div>
            </motion.div>
          )}
        </div>
      </section>

      <VideoModal
        video={selectedVideo}
        isOpen={isVideoModalOpen}
        onClose={handleCloseVideoModal}
      />

      {/* Reviews Carousel Section */}
      <ReviewsCarousel />

      <Footer />
    </div>
  )
}