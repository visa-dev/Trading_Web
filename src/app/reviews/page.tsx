"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Star, MessageSquare, FileText, Video } from "lucide-react"
import { LoadingSpinner } from "@/components/loading-spinner"
import { motion } from "framer-motion"

interface Review {
  id: string
  rating: number
  comment?: string | null
  type: "POST" | "VIDEO"
  status: "PENDING" | "APPROVED" | "REJECTED"
  createdAt: string
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

export default function ReviewsPage() {
  const { data: session, status } = useSession()
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === "loading") return
    if (!session) {
      redirect("/auth/signin")
    }
    fetchReviews()
  }, [session, status, fetchReviews])

  const fetchReviews = async () => {
    try {
      const response = await fetch('/api/reviews')
      if (response.ok) {
        const data = await response.json()
        // Filter to show only user's own reviews
        const userReviews = data.reviews.filter((review: Review) => 
          review.user.username === session?.user?.name
        )
        setReviews(userReviews)
      }
    } catch (error) {
      console.error('Error fetching reviews:', error)
    } finally {
      setLoading(false)
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "APPROVED":
        return "bg-green-100 text-green-800"
      case "REJECTED":
        return "bg-red-100 text-red-800"
      case "PENDING":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 flex items-center justify-center">
        <LoadingSpinner message="Fetching your reviews..." />
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Reviews</h1>
          <p className="text-gray-600">
            View and manage your submitted reviews
          </p>
        </motion.div>

        {reviews.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card>
              <CardContent className="text-center py-12">
                <MessageSquare className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No reviews yet</h3>
                <p className="text-gray-600 mb-4">
                  You haven&apos;t submitted any reviews yet. Start reviewing trading performance posts and videos!
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    href="/posts"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-amber-600 hover:bg-amber-700"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Browse Posts
                  </Link>
                  <Link
                    href="/videos"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-amber-600 bg-white hover:bg-amber-50"
                  >
                    <Video className="w-4 h-4 mr-2" />
                    Browse Videos
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {reviews.map((review, index) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4 flex-1">
                        <Avatar>
                          <AvatarImage src={review.user.image || ""} />
                          <AvatarFallback className="bg-gradient-to-r from-amber-100 to-orange-100 text-amber-700">
                            {review.user.username.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <h4 className="font-medium text-gray-900">{review.user.username}</h4>
                              <p className="text-sm text-gray-500">
                                {review.type} Review • {new Date(review.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="flex items-center space-x-2">
                              {renderStars(review.rating)}
                              <Badge className={getStatusColor(review.status)}>
                                {review.status}
                              </Badge>
                            </div>
                          </div>
                          
                          <div className="mb-3">
                            <p className="text-sm text-gray-600 mb-1">
                              Reviewing: <span className="font-medium text-gray-900">
                                {review.post?.title || review.video?.title}
                              </span>
                            </p>
                            {review.comment && (
                              <p className="text-gray-700 bg-gray-50 p-3 rounded-lg mt-2">
                                {review.comment}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
