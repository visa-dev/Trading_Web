"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Play, Calendar, ArrowRight, Star } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import { resolveVideoSource } from "@/lib/video-sources"

interface TradingVideo {
  id: string
  title: string
  youtubeUrl: string
  description: string
  performanceMetrics?: Record<string, unknown>
  createdAt: Date | string
}

interface VideoCardProps {
  video: TradingVideo
  onWatch?: (video: TradingVideo) => void
}

export function VideoCard({ video, onWatch }: VideoCardProps) {
  const videoSource = resolveVideoSource(video.youtubeUrl)
  const thumbnailUrl = videoSource?.thumbnail ?? null

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      whileHover={{ 
        y: -12, 
        scale: 1.02,
        transition: { duration: 0.3, ease: "easeOut" }
      }}
      className="group"
    >
      <Card className="relative overflow-hidden bg-gray-800/50 backdrop-blur-sm border border-gray-700 shadow-xl hover:shadow-2xl transition-all duration-500">
        {/* Animated gradient overlay */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        <motion.div 
          className="relative aspect-video overflow-hidden"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.4 }}
        >
          {thumbnailUrl ? (
            <img
              src={thumbnailUrl}
              alt={video.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 space-y-3 text-gray-300">
              <Play className="w-10 h-10" />
              <span className="text-sm uppercase tracking-wide">Video Preview</span>
            </div>
          )}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
          
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <motion.div
              className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center shadow-2xl backdrop-blur-sm"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <Play className="w-8 h-8 text-white ml-1" />
            </motion.div>
          </div>

          <motion.div
            className="pointer-events-none absolute bottom-4 right-4"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="bg-black/80 backdrop-blur-sm text-white px-3 py-1 rounded-lg text-sm font-medium">
              Trading Video
            </div>
          </motion.div>
        </motion.div>
      
        <CardHeader className="relative pb-4">
          <div className="flex items-start justify-between">
            <div className="flex-1 pr-4">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <CardTitle className="text-xl font-bold text-white line-clamp-2 group-hover:text-yellow-400 transition-colors duration-300 leading-tight">
                  {video.title}
                </CardTitle>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="mt-2 flex items-center space-x-4"
              >
                <div className="flex items-center space-x-2 text-sm text-gray-300">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(video.createdAt).toLocaleDateString()}</span>
                </div>
              </motion.div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <p className="text-gray-300 line-clamp-3 leading-relaxed">
              {video.description}
            </p>
          </motion.div>

          {/* Performance metrics */}
          {video.performanceMetrics && (
            <motion.div 
              className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 p-4 rounded-xl border border-blue-700/50"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
            >
              <div className="flex items-center space-x-3 mb-2">
                <div className="p-2 bg-blue-500 rounded-lg">
                  <Star className="w-4 h-4 text-white" />
                </div>
                <div className="text-sm font-semibold text-blue-300">Performance Metrics</div>
              </div>
              <div className="text-xs text-gray-300 bg-gray-900/50 p-2 rounded-lg">
                {typeof video.performanceMetrics === 'string' 
                  ? video.performanceMetrics 
                  : JSON.stringify(video.performanceMetrics, null, 2)
                }
              </div>
            </motion.div>
          )}

          {/* Action button */}
          <motion.div 
            className="pt-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <motion.div 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {onWatch ? (
                <Button
                  size="sm"
                  onClick={() => onWatch(video)}
                  className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 group"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Watch Video
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                </Button>
              ) : (
                <Button
                  asChild
                  size="sm"
                  className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 group"
                >
                  <Link href={`/videos/${video.id}`} className="flex items-center justify-center">
                    <Play className="w-4 h-4 mr-2" />
                    Watch Video
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                  </Link>
                </Button>
              )}
            </motion.div>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  )
}