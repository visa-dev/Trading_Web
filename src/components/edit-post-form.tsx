"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"

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
}

interface EditPostFormProps {
  post: PerformancePost
  onSuccess: () => void
}

export function EditPostForm({ post, onSuccess }: EditPostFormProps) {
  const createInitialState = (p: PerformancePost) => ({
    title: p.title,
    description: p.description ?? "",
    type: p.type ?? "PERFORMANCE",
    profitLoss: p.profitLoss != null ? p.profitLoss.toString() : "",
    winRate: p.winRate != null ? p.winRate.toString() : "",
    drawdown: p.drawdown != null ? p.drawdown.toString() : "",
    riskReward: p.riskReward != null ? p.riskReward.toString() : "",
    imageUrl: p.imageUrl ?? "",
    videoUrl: p.videoUrl ?? "",
    tradingViewLink: "",
    published: p.published,
  })

  const [formData, setFormData] = useState(() => createInitialState(post))
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [newImageFile, setNewImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  useEffect(() => {
    setFormData(createInitialState(post))
  }, [post])

  useEffect(() => {
    return () => {
      if (imagePreview && imagePreview.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview)
      }
    }
  }, [imagePreview])

  const parseNumber = (value: string): number | null => {
    const trimmed = value.trim()
    if (!trimmed) return null
    const parsed = Number(trimmed)
    return Number.isFinite(parsed) ? parsed : null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      let imageUrlToUse = formData.imageUrl.trim() || null

      if (newImageFile) {
        const uploadFormData = new FormData()
        uploadFormData.append('file', newImageFile)
        uploadFormData.append('folder', 'performance-posts')

        const uploadResponse = await fetch('/api/uploads', {
          method: 'POST',
          body: uploadFormData,
        })

        if (!uploadResponse.ok) {
          toast.error('Failed to upload image')
          return
        }

        const uploadData = await uploadResponse.json()
        imageUrlToUse = uploadData.url
      }

      const isPerformancePost = formData.type === "PERFORMANCE"

      const response = await fetch(`/api/posts/${post.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.title.trim(),
          description: formData.description.trim() || null,
          type: formData.type,
          profitLoss: isPerformancePost ? parseNumber(formData.profitLoss) : null,
          winRate: isPerformancePost ? parseNumber(formData.winRate) : null,
          drawdown: isPerformancePost ? parseNumber(formData.drawdown) : null,
          riskReward: isPerformancePost ? parseNumber(formData.riskReward) : null,
          imageUrl: imageUrlToUse,
          videoUrl: formData.videoUrl.trim() || null,
          tradingViewLink: formData.tradingViewLink.trim() || null,
          published: formData.published,
        }),
      })

      if (response.ok) {
        toast.success('Post updated successfully!')
        setFormData(prev => ({
          ...prev,
          imageUrl: imageUrlToUse ?? ""
        }))
        setNewImageFile(null)
        if (imagePreview && imagePreview.startsWith("blob:")) {
          URL.revokeObjectURL(imagePreview)
        }
        setImagePreview(null)
        onSuccess()
      } else {
        toast.error('Failed to update post')
      }
    } catch (error) {
      toast.error('An error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleImageFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setNewImageFile(file)
      const previewUrl = URL.createObjectURL(file)
      setImagePreview((previous) => {
        if (previous && previous.startsWith("blob:")) {
          URL.revokeObjectURL(previous)
        }
        return previewUrl
      })
    } else {
      if (imagePreview && imagePreview.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview)
      }
      setNewImageFile(null)
      setImagePreview(null)
    }
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleTypeChange = (value: "PERFORMANCE" | "ANALYTICS") => {
    setFormData(prev => ({
      ...prev,
      type: value,
      ...(value === "ANALYTICS"
        ? { profitLoss: "", winRate: "", drawdown: "", riskReward: "" }
        : {})
    }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">Title *</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => handleInputChange('title', e.target.value)}
          placeholder="Enter post title"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          placeholder="Describe your trading performance..."
          rows={4}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="postType">Post Type</Label>
        <Select value={formData.type} onValueChange={(value: "PERFORMANCE" | "ANALYTICS") => handleTypeChange(value)}>
          <SelectTrigger id="postType" className="bg-gray-900/30 border-gray-700">
            <SelectValue placeholder="Select post type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="PERFORMANCE">Performance Post</SelectItem>
            <SelectItem value="ANALYTICS">Analytics Post</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {formData.type === "PERFORMANCE" && (
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="profitLoss">Profit/Loss ($)</Label>
            <Input
              id="profitLoss"
              type="number"
              step="0.01"
              value={formData.profitLoss}
              onChange={(e) => handleInputChange('profitLoss', e.target.value)}
              placeholder="1500.00"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="winRate">Win Rate (%)</Label>
            <Input
              id="winRate"
              type="number"
              step="0.1"
              min="0"
              max="100"
              value={formData.winRate}
              onChange={(e) => handleInputChange('winRate', e.target.value)}
              placeholder="75.5"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="drawdown">Max Drawdown (%)</Label>
            <Input
              id="drawdown"
              type="number"
              step="0.1"
              min="0"
              max="100"
              value={formData.drawdown}
              onChange={(e) => handleInputChange('drawdown', e.target.value)}
              placeholder="12.3"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="riskReward">Risk/Reward Ratio</Label>
            <Input
              id="riskReward"
              type="number"
              step="0.01"
              min="0"
              value={formData.riskReward}
              onChange={(e) => handleInputChange('riskReward', e.target.value)}
              placeholder="1.50"
            />
          </div>
        </div>
      )}

      <div className="space-y-3">
        <Label htmlFor="imageFile">Featured Image</Label>
        {formData.imageUrl && !imagePreview && (
          <div className="mb-3 rounded-lg overflow-hidden border border-gray-700">
            <img
              src={formData.imageUrl}
              alt="Current post"
              className="w-full h-48 object-cover"
            />
          </div>
        )}
        <Input
          id="imageFile"
          type="file"
          accept="image/*"
          onChange={handleImageFileChange}
        />
        {imagePreview && (
          <div className="mt-2">
            <img
              src={imagePreview}
              alt="New post preview"
              className="w-full h-48 object-cover rounded-lg border border-gray-700"
            />
            <p className="text-xs text-gray-400 mt-2">
              Uploading a new image will replace the existing one for this post.
            </p>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="videoUrl">Video URL (optional)</Label>
        <Input
          id="videoUrl"
          type="url"
          value={formData.videoUrl}
          onChange={(e) => handleInputChange('videoUrl', e.target.value)}
          placeholder="https://www.youtube.com/watch?v=..."
        />
      </div>
      {formData.type === "ANALYTICS" && (
        <div className="space-y-2">
          <Label htmlFor="tradingViewLink">TradingView Link (optional)</Label>
          <Input
            id="tradingViewLink"
            type="url"
            value={formData.tradingViewLink}
            onChange={(e) => handleInputChange('tradingViewLink', e.target.value)}
            placeholder="https://www.tradingview.com/..."
          />
        </div>
      )}



      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="published"
          checked={formData.published}
          onChange={(e) => handleInputChange('published', e.target.checked)}
          className="rounded border-gray-300"
        />
        <Label htmlFor="published">Publish immediately</Label>
      </div>

      <div className="flex justify-end space-x-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            setFormData(createInitialState(post))
            onSuccess()
          }}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="bg-amber-600 hover:bg-amber-700"
        >
          {isSubmitting ? "Updating..." : "Update Post"}
        </Button>
      </div>
    </form>
  )
}
