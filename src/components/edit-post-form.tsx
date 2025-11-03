"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

interface PerformancePost {
  id: string
  title: string
  description: string
  profitLoss: number
  winRate: number
  drawdown: number
  riskReward: number
  imageUrl?: string | null
  videoUrl?: string | null
  published: boolean
}

interface EditPostFormProps {
  post: PerformancePost
  onSuccess: () => void
}

export function EditPostForm({ post, onSuccess }: EditPostFormProps) {
  const [formData, setFormData] = useState({
    title: post.title,
    description: post.description,
    profitLoss: post.profitLoss.toString(),
    winRate: post.winRate.toString(),
    drawdown: post.drawdown.toString(),
    riskReward: post.riskReward.toString(),
    imageUrl: post.imageUrl || "",
    videoUrl: post.videoUrl || "",
    published: post.published
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch(`/api/posts/${post.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          profitLoss: parseFloat(formData.profitLoss),
          winRate: parseFloat(formData.winRate),
          drawdown: parseFloat(formData.drawdown),
          riskReward: parseFloat(formData.riskReward),
        }),
      })

      if (response.ok) {
        toast.success('Post updated successfully!')
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

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
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
        <Label htmlFor="description">Description *</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          placeholder="Describe your trading performance..."
          rows={4}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="profitLoss">Profit/Loss ($) *</Label>
          <Input
            id="profitLoss"
            type="number"
            step="0.01"
            value={formData.profitLoss}
            onChange={(e) => handleInputChange('profitLoss', e.target.value)}
            placeholder="1500.00"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="winRate">Win Rate (%) *</Label>
          <Input
            id="winRate"
            type="number"
            step="0.1"
            min="0"
            max="100"
            value={formData.winRate}
            onChange={(e) => handleInputChange('winRate', e.target.value)}
            placeholder="75.5"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="drawdown">Max Drawdown (%) *</Label>
          <Input
            id="drawdown"
            type="number"
            step="0.1"
            min="0"
            max="100"
            value={formData.drawdown}
            onChange={(e) => handleInputChange('drawdown', e.target.value)}
            placeholder="12.3"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="riskReward">Risk/Reward Ratio *</Label>
          <Input
            id="riskReward"
            type="number"
            step="0.01"
            min="0"
            value={formData.riskReward}
            onChange={(e) => handleInputChange('riskReward', e.target.value)}
            placeholder="1.50"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="imageUrl">Image URL (optional)</Label>
        <Input
          id="imageUrl"
          type="url"
          value={formData.imageUrl}
          onChange={(e) => handleInputChange('imageUrl', e.target.value)}
          placeholder="https://example.com/image.jpg"
        />
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
          onClick={() => onSuccess()}
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
