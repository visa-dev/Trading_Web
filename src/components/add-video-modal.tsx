"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { X, Video, ExternalLink } from "lucide-react"
import { toast } from "sonner"

interface AddVideoModalProps {
  isOpen: boolean
  onClose: () => void
}

export function AddVideoModal({ isOpen, onClose }: AddVideoModalProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    youtubeUrl: ""
  })
  const [loading, setLoading] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/videos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        toast.success("Video added successfully!")
        onClose()
        setFormData({
          title: "",
          description: "",
          youtubeUrl: ""
        })
      } else {
        toast.error("Failed to add video")
      }
    } catch (error) {
      console.error('Error adding video:', error)
      toast.error("Error adding video")
    } finally {
      setLoading(false)
    }
  }

  const extractVideoId = (url: string) => {
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
    const match = url.match(regex)
    return match ? match[1] : null
  }

  const getThumbnailUrl = (url: string) => {
    const videoId = extractVideoId(url)
    return videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : null
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl card-material">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold text-white">
              Add New Video
            </DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="title" className="text-white">Video Title</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Enter video title"
                className="bg-gray-800 border-gray-700 text-white"
                required
              />
            </div>

            <div>
              <Label htmlFor="description" className="text-white">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Enter video description"
                className="bg-gray-800 border-gray-700 text-white"
                rows={3}
                required
              />
            </div>

            <div>
              <Label htmlFor="youtubeUrl" className="text-white">YouTube URL</Label>
              <Input
                id="youtubeUrl"
                name="youtubeUrl"
                type="url"
                value={formData.youtubeUrl}
                onChange={handleInputChange}
                placeholder="https://www.youtube.com/watch?v=..."
                className="bg-gray-800 border-gray-700 text-white"
                required
              />
              {formData.youtubeUrl && getThumbnailUrl(formData.youtubeUrl) && (
                <div className="mt-2">
                  <img
                    src={getThumbnailUrl(formData.youtubeUrl)}
                    alt="Video thumbnail"
                    className="w-32 h-20 object-cover rounded border border-gray-600"
                  />
                </div>
              )}
            </div>

          </div>

          <div className="flex justify-end space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-gray-600 text-gray-300 hover:bg-gray-800"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="btn-material"
            >
              {loading ? "Adding..." : "Add Video"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
