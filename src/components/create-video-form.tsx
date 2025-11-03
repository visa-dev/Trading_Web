"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

interface CreateVideoFormProps {
  onSuccess: () => void
}

export function CreateVideoForm({ onSuccess }: CreateVideoFormProps) {
  const [formData, setFormData] = useState({
    title: "",
    youtubeUrl: "",
    description: "",
    performanceMetrics: ""
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/videos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          performanceMetrics: formData.performanceMetrics ? JSON.parse(formData.performanceMetrics) : null,
        }),
      })

      if (response.ok) {
        toast.success('Video added successfully!')
        onSuccess()
      } else {
        toast.error('Failed to add video')
      }
    } catch (error) {
      toast.error('An error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">Video Title *</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => handleInputChange('title', e.target.value)}
          placeholder="Enter video title"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="youtubeUrl">YouTube URL *</Label>
        <Input
          id="youtubeUrl"
          type="url"
          value={formData.youtubeUrl}
          onChange={(e) => handleInputChange('youtubeUrl', e.target.value)}
          placeholder="https://www.youtube.com/watch?v=..."
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description *</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          placeholder="Describe your trading performance video..."
          rows={4}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="performanceMetrics">Performance Metrics (JSON format, optional)</Label>
        <Textarea
          id="performanceMetrics"
          value={formData.performanceMetrics}
          onChange={(e) => handleInputChange('performanceMetrics', e.target.value)}
          placeholder='{"winRate": "75%", "averageProfit": "$120", "maxDrawdown": "3.2%"}'
          rows={3}
        />
        <p className="text-xs text-gray-500">
          Enter performance metrics in JSON format. Example: {`{"winRate": "75%", "averageProfit": "$120"}`}
        </p>
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
          {isSubmitting ? "Adding Video..." : "Add Video"}
        </Button>
      </div>
    </form>
  )
}
