"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"

interface CreatePostFormProps {
  onSuccess: () => void
}

export function CreatePostForm({ onSuccess }: CreatePostFormProps) {
  const initialFormState = {
    title: "",
    description: "",
    type: "PERFORMANCE" as "PERFORMANCE" | "ANALYTICS",
    profitLoss: "",
    winRate: "",
    drawdown: "",
    riskReward: "",
    videoUrl: "",
    published: false
  }
  const [formData, setFormData] = useState(initialFormState)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

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
      if (!imageFile) {
        toast.error('Please upload a featured image for this post')
        return
      }

      let uploadedImageUrl: string | null = null

      if (imageFile) {
        const uploadFormData = new FormData()
        uploadFormData.append('file', imageFile)
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
        uploadedImageUrl = uploadData.url
      }

      const isPerformancePost = formData.type === "PERFORMANCE"

      const response = await fetch('/api/posts', {
        method: 'POST',
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
          imageUrl: uploadedImageUrl,
          videoUrl: formData.videoUrl.trim() || null,
          published: formData.published,
        }),
      })

      if (response.ok) {
        toast.success('Post created successfully!')
        setFormData(initialFormState)
        setImageFile(null)
        setImagePreview(null)
        onSuccess()
      } else {
        toast.error('Failed to create post')
      }
    } catch (error) {
      toast.error('An error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setImageFile(file)
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
      setImageFile(null)
      setImagePreview(null)
    }
  }

  useEffect(() => {
    return () => {
      if (imagePreview && imagePreview.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview)
      }
    }
  }, [imagePreview])

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
        <Label htmlFor="postImage">Featured Image</Label>
        <Input
          id="postImage"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
        />
        {imagePreview && (
          <div className="relative mt-2">
            <img
              src={imagePreview}
              alt="Post preview"
              className="w-full h-48 object-cover rounded-lg border border-gray-700"
            />
            <p className="text-xs text-gray-400 mt-2">
              This image will be uploaded to secure storage and used as the post cover.
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
            setFormData(initialFormState)
            if (imagePreview && imagePreview.startsWith("blob:")) {
              URL.revokeObjectURL(imagePreview)
            }
            setImageFile(null)
            setImagePreview(null)
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
          {isSubmitting ? "Creating..." : "Create Post"}
        </Button>
      </div>
    </form>
  )
}
