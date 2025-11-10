"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { VideoPlayer } from "@/components/video-player"

interface TradingVideo {
  id: string
  title: string
  youtubeUrl: string
  description: string
  performanceMetrics?: Record<string, unknown>
  createdAt: string | Date
}

interface VideoModalProps {
  video: TradingVideo | null
  isOpen: boolean
  onClose: () => void
}

export function VideoModal({ video, isOpen, onClose }: VideoModalProps) {
  if (!video) return null

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) {
          onClose()
        }
      }}
    >
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900">
            {video.title}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <VideoPlayer video={video} activeTab="video" />
        </div>
      </DialogContent>
    </Dialog>
  )
}
