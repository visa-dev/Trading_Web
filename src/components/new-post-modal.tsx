"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { X, Upload, Image as ImageIcon } from "lucide-react"
import { toast } from "sonner"

interface NewPostModalProps {
  isOpen: boolean
  onClose: () => void
}

export function NewPostModal({ isOpen, onClose }: NewPostModalProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    profitLoss: "",
    winRate: "",
    drawdown: "",
    riskReward: "",
    imageFile: null as File | null
  })
  const [loading, setLoading] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData(prev => ({
        ...prev,
        imageFile: file
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const formDataToSend = new FormData()
      formDataToSend.append('title', formData.title)
      formDataToSend.append('description', formData.description)
      formDataToSend.append('profitLoss', formData.profitLoss)
      formDataToSend.append('winRate', formData.winRate)
      formDataToSend.append('drawdown', formData.drawdown)
      formDataToSend.append('riskReward', formData.riskReward)
      formDataToSend.append('published', 'true')
      
      if (formData.imageFile) {
        formDataToSend.append('image', formData.imageFile)
      }

      const response = await fetch('/api/posts', {
        method: 'POST',
        body: formDataToSend
      })

      if (response.ok) {
        toast.success("Post created successfully!")
        onClose()
        setFormData({
          title: "",
          description: "",
          profitLoss: "",
          winRate: "",
          drawdown: "",
          riskReward: "",
          imageFile: null
        })
      } else {
        toast.error("Failed to create post")
      }
    } catch (error) {
      console.error('Error creating post:', error)
      toast.error("Error creating post")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl card-material">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold text-white">
              Create New Post
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
              <Label htmlFor="title" className="text-white">Title</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Enter post title"
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
                placeholder="Enter post description"
                className="bg-gray-800 border-gray-700 text-white"
                rows={3}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="profitLoss" className="text-white">Profit/Loss ($)</Label>
                <Input
                  id="profitLoss"
                  name="profitLoss"
                  type="number"
                  value={formData.profitLoss}
                  onChange={handleInputChange}
                  placeholder="0"
                  className="bg-gray-800 border-gray-700 text-white"
                  required
                />
              </div>

              <div>
                <Label htmlFor="winRate" className="text-white">Win Rate (%)</Label>
                <Input
                  id="winRate"
                  name="winRate"
                  type="number"
                  value={formData.winRate}
                  onChange={handleInputChange}
                  placeholder="0"
                  className="bg-gray-800 border-gray-700 text-white"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="drawdown" className="text-white">Drawdown (%)</Label>
                <Input
                  id="drawdown"
                  name="drawdown"
                  type="number"
                  value={formData.drawdown}
                  onChange={handleInputChange}
                  placeholder="0"
                  className="bg-gray-800 border-gray-700 text-white"
                  required
                />
              </div>

              <div>
                <Label htmlFor="riskReward" className="text-white">Risk/Reward Ratio</Label>
                <Input
                  id="riskReward"
                  name="riskReward"
                  type="number"
                  step="0.1"
                  value={formData.riskReward}
                  onChange={handleInputChange}
                  placeholder="0"
                  className="bg-gray-800 border-gray-700 text-white"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="image" className="text-white">Trading Chart Image (Optional)</Label>
              <div className="mt-2">
                <input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <label
                  htmlFor="image"
                  className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-600 rounded-lg cursor-pointer hover:border-yellow-400 transition-colors"
                >
                  {formData.imageFile ? (
                    <div className="text-center">
                      <ImageIcon className="w-8 h-8 mx-auto text-yellow-400 mb-2" />
                      <p className="text-sm text-white">{formData.imageFile.name}</p>
                    </div>
                  ) : (
                    <div className="text-center">
                      <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                      <p className="text-sm text-gray-400">Click to upload image</p>
                    </div>
                  )}
                </label>
              </div>
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
              {loading ? "Creating..." : "Create Post"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
