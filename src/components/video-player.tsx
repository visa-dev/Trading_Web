"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileText, BarChart3 } from "lucide-react"
import { resolveVideoSource } from "@/lib/video-sources"

interface TradingVideo {
  id: string
  title: string
  youtubeUrl: string
  description: string
  performanceMetrics?: Record<string, unknown> | string
  createdAt: Date | string
}

interface VideoPlayerProps {
  video: TradingVideo
  activeTab: string
}

export function VideoPlayer({ video, activeTab }: VideoPlayerProps) {
  const videoSource = resolveVideoSource(video.youtubeUrl)
  const allowAttributes = videoSource?.type === "YOUTUBE"
    ? "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
    : "autoplay; picture-in-picture; fullscreen"

  return (
    <Card className="bg-gray-800/50 border-gray-700">
      <CardHeader>
        <CardTitle className="text-2xl text-white">{video.title}</CardTitle>
        <CardDescription className="text-gray-300">
          Trading Performance Analysis
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Tabs defaultValue={activeTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-gray-700/50">
            <TabsTrigger value="video" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-yellow-500 data-[state=active]:to-orange-500 data-[state=active]:text-gray-900">Video</TabsTrigger>
            <TabsTrigger value="description" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-yellow-500 data-[state=active]:to-orange-500 data-[state=active]:text-gray-900">Description</TabsTrigger>
          </TabsList>

          <TabsContent value="video">
            {videoSource ? (
              <div className="aspect-video">
                {videoSource.type === "FILE" ? (
                  <video
                    src={videoSource.embedUrl}
                    className="w-full h-full rounded-lg bg-black"
                    controls
                    controlsList="nodownload"
                    preload="metadata"
                  >
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <iframe
                    src={videoSource.embedUrl}
                    title={video.title}
                    className="w-full h-full rounded-lg"
                    allow={allowAttributes}
                    allowFullScreen
                  />
                )}
              </div>
            ) : (
              <div className="aspect-video bg-gray-700/50 rounded-lg flex items-center justify-center">
                <div className="text-center text-gray-400">
                  <p>Unable to load this video.</p>
                  <p className="text-sm">Please verify the video link or try again later.</p>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="description" className="space-y-6">
            <div className="prose max-w-none">
              <h3 className="text-lg font-semibold mb-4 text-white">Description</h3>
              <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                {video.description}
              </p>
            </div>

            {video.performanceMetrics && (
              <Card className="bg-gray-700/30 border-gray-600">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-white">
                    <BarChart3 className="w-5 h-5" />
                    <span>Performance Metrics</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-800/50 p-4 rounded-lg">
                    <pre className="text-sm text-gray-300 whitespace-pre-wrap">
                      {typeof video.performanceMetrics === 'string' 
                        ? video.performanceMetrics 
                        : JSON.stringify(video.performanceMetrics, null, 2)
                      }
                    </pre>
                  </div>
                </CardContent>
              </Card>
            )}

            <Card className="bg-gray-700/30 border-gray-600">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-white">
                  <FileText className="w-5 h-5" />
                  <span>Video Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-400">Published</label>
                    <p className="text-white">
                      {new Date(video.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-400">Duration</label>
                    <p className="text-white">Trading Analysis Video</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
