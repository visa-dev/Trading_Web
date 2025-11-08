"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { CreatePostForm } from "@/components/create-post-form"
import { EditPostForm } from "@/components/edit-post-form"
import { Plus, Edit, Eye, Trash2, TrendingUp, TrendingDown } from "lucide-react"
import { toast } from "sonner"

interface PerformancePost {
  id: string
  title: string
  description?: string | null
  profitLoss?: number | null
  winRate?: number | null
  drawdown?: number | null
  riskReward?: number | null
  imageUrl?: string | null
  videoUrl?: string | null
  published: boolean
  createdAt: Date
  reviews: Array<{
    id: string
    rating: number
  }>
}

export function PerformancePostsManager() {
  const [posts, setPosts] = useState<PerformancePost[]>([])
  const [loading, setLoading] = useState(true)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [editingPost, setEditingPost] = useState<PerformancePost | null>(null)

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/posts')
      if (response.ok) {
        const data = await response.json()
        setPosts(data.posts)
      }
    } catch (error) {
      console.error('Error fetching posts:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeletePost = async (postId: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return

    try {
      const response = await fetch(`/api/posts/${postId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        toast.success('Post deleted successfully')
        fetchPosts()
      } else {
        toast.error('Failed to delete post')
      }
    } catch (error) {
      toast.error('An error occurred')
    }
  }

  const handleTogglePublish = async (postId: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/posts/${postId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          published: !currentStatus,
        }),
      })

      if (response.ok) {
        toast.success(`Post ${!currentStatus ? 'published' : 'unpublished'} successfully`)
        fetchPosts()
      } else {
        toast.error('Failed to update post status')
      }
    } catch (error) {
      toast.error('An error occurred')
    }
  }

  const formatCurrency = (amount?: number | null) => {
    if (typeof amount === "number" && Number.isFinite(amount)) {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(amount)
    }
    return "N/A"
  }

  const formatPercentage = (value?: number | null) => {
    if (typeof value === "number" && Number.isFinite(value)) {
      return `${value.toFixed(1)}%`
    }
    return "N/A"
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
          <h2 className="text-2xl font-bold text-gray-900">Performance Posts</h2>
          <p className="text-gray-600">Manage your trading performance posts</p>
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-amber-600 hover:bg-amber-700">
              <Plus className="w-4 h-4 mr-2" />
              Create Post
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Performance Post</DialogTitle>
              <DialogDescription>
                Share your trading performance with detailed metrics and insights.
              </DialogDescription>
            </DialogHeader>
            <CreatePostForm 
              onSuccess={() => {
                setIsCreateDialogOpen(false)
                fetchPosts()
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      {posts.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <TrendingUp className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No posts yet</h3>
            <p className="text-gray-600 mb-4">
              Create your first trading performance post to get started.
            </p>
            <Button 
              onClick={() => setIsCreateDialogOpen(true)}
              className="bg-amber-600 hover:bg-amber-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create First Post
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => {
            const hasProfitLoss = typeof post.profitLoss === "number" && Number.isFinite(post.profitLoss)
            const profitLossValue = hasProfitLoss ? post.profitLoss! : null
            const isProfitable = hasProfitLoss && (profitLossValue ?? 0) > 0
            const averageRating = post.reviews.length > 0 
              ? post.reviews.reduce((sum, review) => sum + review.rating, 0) / post.reviews.length 
              : 0
            const riskRewardDisplay = typeof post.riskReward === "number" && Number.isFinite(post.riskReward)
              ? post.riskReward.toFixed(2)
              : "N/A"
            const descriptionText = post.description?.trim() || "No description provided."

            return (
              <Card key={post.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg line-clamp-2">{post.title}</CardTitle>
                      <CardDescription className="mt-1">
                        {new Date(post.createdAt).toLocaleDateString()}
                      </CardDescription>
                    </div>
                    <div className="flex space-x-1 ml-2">
                      <Badge variant={post.published ? "default" : "secondary"}>
                        {post.published ? "Published" : "Draft"}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className={`flex items-center space-x-1 ${
                      hasProfitLoss
                        ? (isProfitable ? 'text-green-600' : 'text-red-600')
                        : 'text-gray-500'
                    }`}>
                      {hasProfitLoss ? (
                        isProfitable ? (
                          <TrendingUp className="w-4 h-4" />
                        ) : (
                          <TrendingDown className="w-4 h-4" />
                        )
                      ) : (
                        <TrendingUp className="w-4 h-4" />
                      )}
                      <span className="font-semibold">{formatCurrency(profitLossValue)}</span>
                    </div>
                    {averageRating > 0 && (
                      <div className="text-sm text-gray-600">
                        ⭐ {averageRating.toFixed(1)} ({post.reviews.length})
                      </div>
                    )}
                  </div>

                  <p className="text-sm text-gray-600 line-clamp-3">
                    {descriptionText}
                  </p>

                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-gray-500">Win Rate:</span>
                      <span className="ml-1 font-medium">{formatPercentage(post.winRate)}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Risk/Reward:</span>
                      <span className="ml-1 font-medium">{riskRewardDisplay}</span>
                    </div>
                  </div>

                  <div className="flex space-x-2 pt-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setEditingPost(post)}
                    >
                      <Edit className="w-3 h-3 mr-1" />
                      Edit
                    </Button>
                    
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleTogglePublish(post.id, post.published)}
                    >
                      {post.published ? "Unpublish" : "Publish"}
                    </Button>
                    
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDeletePost(post.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {/* Edit Post Dialog */}
      {editingPost && (
        <Dialog open={!!editingPost} onOpenChange={() => setEditingPost(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Performance Post</DialogTitle>
              <DialogDescription>
                Update your trading performance post details.
              </DialogDescription>
            </DialogHeader>
            <EditPostForm 
              post={editingPost}
              onSuccess={() => {
                setEditingPost(null)
                fetchPosts()
              }}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
