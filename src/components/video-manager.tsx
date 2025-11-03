"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { CreateVideoForm } from "@/components/create-video-form"
import { VideoModal } from "@/components/video-modal"
import { Plus, Play, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { motion } from "framer-motion"

interface TradingVideo {
  id: string
  title: string
  youtubeUrl: string
  description: string
  performanceMetrics?: Record<string, unknown>
  createdAt: string
}

export function VideoManager() {
  const [videos, setVideos] = useState<TradingVideo[]>([])
  const [loading, setLoading] = useState(true)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [selectedVideo, setSelectedVideo] = useState<TradingVideo | null>(null)
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false)

  useEffect(() => {
    fetchVideos()
  }, [])

  const fetchVideos = async () => {
    try {
      const response = await fetch('/api/videos')
      if (response.ok) {
        const data = await response.json()
        setVideos(data.videos)
      }
    } catch (error) {
      console.error('Error fetching videos:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleViewVideo = (video: TradingVideo) => {
    setSelectedVideo(video)
    setIsVideoModalOpen(true)
  }

  const handleDeleteVideo = async (videoId: string) => {
    if (!confirm('Are you sure you want to delete this video?')) return

    try {
      const response = await fetch(`/api/videos/${videoId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        toast.success('Video deleted successfully')
        fetchVideos()
      } else {
        toast.error('Failed to delete video')
      }
    } catch (error) {
      toast.error('An error occurred')
    }
  }

  // Extract YouTube video ID from URL
  const getYouTubeVideoId = (url: string) => {
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
    const match = url.match(regex)
    return match ? match[1] : null
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="h-8 bg-gray-200 rounded w-48 animate-pulse"></div>
          <div className="h-10 bg-gray-200 rounded w-32 animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader className="animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
              <CardContent className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Trading Videos</h2>
          <p className="text-gray-300">Manage your trading performance videos</p>
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-amber-600 hover:bg-amber-700">
              <Plus className="w-4 h-4 mr-2" />
              Add Video
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Trading Video</DialogTitle>
              <DialogDescription>
                Upload a YouTube video showcasing your trading performance.
              </DialogDescription>
            </DialogHeader>
            <CreateVideoForm 
              onSuccess={() => {
                setIsCreateDialogOpen(false)
                fetchVideos()
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      {videos.length === 0 ? (
        <Card className="bg-gray-800/50 border-gray-700">
          <CardContent className="text-center py-12">
            <Play className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium text-white mb-2">No videos yet</h3>
            <p className="text-gray-300 mb-4">
              Add your first trading performance video to get started.
            </p>
            <Button 
              onClick={() => setIsCreateDialogOpen(true)}
              className="bg-amber-600 hover:bg-amber-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add First Video
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((video, index) => {
            const videoId = getYouTubeVideoId(video.youtubeUrl)
            const thumbnailUrl = videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : null

            return (
              <motion.div
                key={video.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -8 }}
              >
                <Card className="hover:shadow-2xl transition-all duration-300 bg-gray-800/50 backdrop-blur-sm border-gray-700 shadow-lg">
                  {thumbnailUrl && (
                    <div className="aspect-video overflow-hidden rounded-t-lg relative">
                      <img
                        src={thumbnailUrl}
                        alt={video.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                        <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center">
                          <Play className="w-6 h-6 text-white ml-1" />
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <CardHeader>
                    <CardTitle className="text-lg line-clamp-2 text-white">{video.title}</CardTitle>
                    <CardDescription className="text-gray-300">
                      {new Date(video.createdAt).toLocaleDateString()}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <p className="text-sm text-gray-300 line-clamp-3">
                      {video.description}
                    </p>

                    <div className="flex space-x-2 pt-2">
                      <motion.div
                        className="flex-1"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button 
                          size="sm" 
                          className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 shadow-lg"
                          onClick={() => handleViewVideo(video)}
                        >
                          <Play className="w-4 h-4 mr-2" />
                          View Video
                        </Button>
                      </motion.div>
                      
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleDeleteVideo(video.id)}
                          className="text-red-600 hover:text-red-700 border-red-300 hover:border-red-400"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </motion.div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>
      )}

      {/* Video Modal */}
      <VideoModal 
        video={selectedVideo}
        isOpen={isVideoModalOpen}
        onClose={() => {
          setIsVideoModalOpen(false)
          setSelectedVideo(null)
        }}
      />
    </div>
  )
}
