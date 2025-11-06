"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Star, MessageSquare, Check, X, Award } from "lucide-react"
import { toast } from "sonner"

interface Review {
  id: string
  rating: number
  comment?: string | null
  type: "POST" | "VIDEO"
  status: "PENDING" | "APPROVED" | "REJECTED"
  createdAt: Date
  user: {
    username: string
    image?: string | null
  }
  post?: {
    title: string
  }
  video?: {
    title: string
  }
}

interface TraderReview {
  id: string
  rating: number
  comment: string
  status: "PENDING" | "APPROVED" | "REJECTED"
  createdAt: Date
  user: {
    username: string
    image?: string | null
  }
}

export function ReviewsManager() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [traderReviews, setTraderReviews] = useState<TraderReview[]>([])
  const [loading, setLoading] = useState(true)
  const [traderReviewsLoading, setTraderReviewsLoading] = useState(true)
  const [filter, setFilter] = useState<"ALL" | "PENDING" | "APPROVED" | "REJECTED">("PENDING")
  const [activeTab, setActiveTab] = useState<"posts" | "trader">("posts")

  useEffect(() => {
    fetchReviews()
    fetchTraderReviews()
  }, [])

  const fetchReviews = async () => {
    try {
      const response = await fetch('/api/reviews')
      if (response.ok) {
        const data = await response.json()
        setReviews(data.reviews)
      }
    } catch (error) {
      console.error('Error fetching reviews:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchTraderReviews = async () => {
    try {
      const response = await fetch('/api/trader-reviews')
      if (response.ok) {
        const data = await response.json()
        setTraderReviews(data.reviews)
      }
    } catch (error) {
      console.error('Error fetching trader reviews:', error)
    } finally {
      setTraderReviewsLoading(false)
    }
  }

  const handleReviewStatus = async (reviewId: string, status: "APPROVED" | "REJECTED") => {
    try {
      const response = await fetch(`/api/reviews/${reviewId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      })

      if (response.ok) {
        toast.success(`Review ${status.toLowerCase()} successfully`)
        fetchReviews()
      } else {
        toast.error('Failed to update review status')
      }
    } catch (error) {
      toast.error('An error occurred')
    }
  }

  const handleTraderReviewStatus = async (reviewId: string, status: "APPROVED" | "REJECTED") => {
    try {
      const response = await fetch(`/api/trader-reviews/${reviewId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      })

      if (response.ok) {
        toast.success(`Trader review ${status.toLowerCase()} successfully`)
        fetchTraderReviews()
      } else {
        toast.error('Failed to update trader review status')
      }
    } catch (error) {
      toast.error('An error occurred')
    }
  }

  const renderStars = (rating: number) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating
                ? "text-yellow-400 fill-current"
                : "text-gray-300"
            }`}
          />
        ))}
      </div>
    )
  }

  const filteredReviews = reviews.filter(review => 
    filter === "ALL" || review.status === filter
  )

  const filteredTraderReviews = traderReviews.filter(review => 
    filter === "ALL" || review.status === filter
  )

  const renderPostReviewCard = (review: Review) => (
    <Card key={review.id}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4 flex-1">
            <Avatar>
              <AvatarImage src={review.user.image || ""} />
              <AvatarFallback>
                {review.user.username.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h4 className="font-medium">{review.user.username}</h4>
                  <p className="text-sm text-gray-500">
                    {review.type} Review • {new Date(review.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  {renderStars(review.rating)}
                  <Badge variant={
                    review.status === "APPROVED" ? "default" :
                    review.status === "REJECTED" ? "destructive" : "secondary"
                  }>
                    {review.status}
                  </Badge>
                </div>
              </div>
              
              <div className="mb-3">
                <p className="text-sm text-gray-600 mb-1">
                  Reviewing: <span className="font-medium">
                    {review.post?.title || review.video?.title}
                  </span>
                </p>
                {review.comment && (
                  <p className="text-gray-700">{review.comment}</p>
                )}
              </div>
              
              {review.status === "PENDING" && (
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    onClick={() => handleReviewStatus(review.id, "APPROVED")}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Check className="w-3 h-3 mr-1" />
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleReviewStatus(review.id, "REJECTED")}
                  >
                    <X className="w-3 h-3 mr-1" />
                    Reject
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  const renderTraderReviewCard = (review: TraderReview) => (
    <Card key={review.id}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4 flex-1">
            <Avatar>
              <AvatarImage src={review.user.image || ""} />
              <AvatarFallback>
                {review.user.username.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h4 className="font-medium">{review.user.username}</h4>
                  <p className="text-sm text-gray-500">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  {renderStars(review.rating)}
                  <Badge variant={
                    review.status === "APPROVED" ? "default" :
                    review.status === "REJECTED" ? "destructive" : "secondary"
                  }>
                    {review.status}
                  </Badge>
                </div>
              </div>
              
              <div className="mb-3">
                <p className="text-gray-700">{review.comment}</p>
              </div>
              
              {review.status === "PENDING" && (
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    onClick={() => handleTraderReviewStatus(review.id, "APPROVED")}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Check className="w-3 h-3 mr-1" />
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleTraderReviewStatus(review.id, "REJECTED")}
                  >
                    <X className="w-3 h-3 mr-1" />
                    Reject
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  const renderEmptyState = (type: string) => (
    <Card>
      <CardContent className="text-center py-12">
        <MessageSquare className="w-16 h-16 mx-auto mb-4 text-gray-300" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No {type} reviews found</h3>
        <p className="text-gray-600">
          {filter === "ALL" 
            ? `No ${type} reviews have been submitted yet.` 
            : `No ${filter.toLowerCase()} ${type} reviews found.`
          }
        </p>
      </CardContent>
    </Card>
  )

  if (loading || traderReviewsLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardContent className="p-6 animate-pulse">
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-full"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Reviews Management</h2>
          <p className="text-gray-400">Moderate user reviews for posts, videos, and trader profile</p>
        </div>
        
        <div className="flex space-x-2">
          {(["ALL", "PENDING", "APPROVED", "REJECTED"] as const).map((status) => (
            <Button
              key={status}
              variant={filter === status ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter(status)}
              className={filter === status ? "bg-amber-600 hover:bg-amber-700" : ""}
            >
              {status}
            </Button>
          ))}
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "posts" | "trader")}>
        <TabsList className="grid w-full grid-cols-2 bg-gray-800/50 border-gray-700">
          <TabsTrigger 
            value="posts" 
            className="flex items-center space-x-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-yellow-500 data-[state=active]:to-orange-500 data-[state=active]:text-gray-900"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Posts & Videos</span>
          </TabsTrigger>
          <TabsTrigger 
            value="trader" 
            className="flex items-center space-x-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-yellow-500 data-[state=active]:to-orange-500 data-[state=active]:text-gray-900"
          >
            <Award className="w-4 h-4" />
            <span>Trader Reviews</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="posts" className="mt-6">
          <div className="space-y-4">
            {filteredReviews.length === 0 ? renderEmptyState("posts & videos") : filteredReviews.map(renderPostReviewCard)}
          </div>
        </TabsContent>

        <TabsContent value="trader" className="mt-6">
          <div className="space-y-4">
            {filteredTraderReviews.length === 0 ? renderEmptyState("trader") : filteredTraderReviews.map(renderTraderReviewCard)}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
