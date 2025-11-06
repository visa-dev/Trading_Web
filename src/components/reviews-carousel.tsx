"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star, Quote, ChevronDown, ChevronUp, Edit3 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"

interface Review {
  id: string
  rating: number
  comment: string
  createdAt: string
  user: {
    username: string
    image?: string | null
  }
}

interface ReviewsCarouselProps {
  reviews?: Review[]
}

export function ReviewsCarousel({ reviews: propReviews }: ReviewsCarouselProps) {
  const { data: session } = useSession()
  const router = useRouter()
  const [showAll, setShowAll] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [rating, setRating] = useState(5)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [comment, setComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)

  // Fetch reviews from API
  useEffect(() => {
    fetchReviews()
  }, [])

  const fetchReviews = async () => {
    try {
      const response = await fetch('/api/trader-reviews?status=APPROVED')
      if (response.ok) {
        const data = await response.json()
        setReviews(data.reviews || [])
      }
    } catch (error) {
      console.error('Error fetching reviews:', error)
    } finally {
      setLoading(false)
    }
  }
  
  // Use prop reviews if provided, otherwise use fetched reviews
  const displayReviews = propReviews || reviews
  
  // Show first 6 reviews initially
  const visibleReviews = showAll ? displayReviews : displayReviews.slice(0, 6)

  const handleWriteReview = () => {
    if (!session) {
      router.push('/auth/signin')
      return
    }
    setIsDialogOpen(true)
  }

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!comment.trim()) {
      toast.error("Please write a comment")
      return
    }

    if (comment.trim().length < 20) {
      toast.error("Comment must be at least 20 characters")
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/trader-reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          rating,
          comment: comment.trim(),
        }),
      })

      if (response.ok) {
        const data = await response.json()
        toast.success("Review submitted successfully! It will be visible after approval.")
        setIsDialogOpen(false)
        setComment("")
        setRating(5)
        // Note: We don't refresh reviews here because the new review is PENDING
        // and won't show up in the approved reviews list
      } else {
        const errorData = await response.json()
        toast.error(errorData.error || "Failed to submit review")
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.")
    } finally {
      setIsSubmitting(false)
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
                : "text-gray-400"
            }`}
          />
        ))}
      </div>
    )
  }


  return (
    <section className="section-spacing bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto container-responsive relative">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center space-x-2 mb-6">
            <Star className="w-5 h-5 text-yellow-400" />
            <span className="text-sm font-medium text-yellow-400 uppercase tracking-wider">Client Reviews</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
            What Our
            <span className="block gradient-text-gold animate-gradient" style={{ backgroundSize: "200% 200%" }}>
              Clients Say
            </span>
          </h2>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto">
            Real feedback from our community of traders
          </p>
        </motion.div>

        {/* Write Review Button */}
        <div className="flex justify-center mb-12">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              onClick={handleWriteReview}
              className="btn-material text-lg px-8 py-6 flex items-center space-x-2"
            >
              <Edit3 className="w-5 h-5" />
              <span>Write Review</span>
            </Button>
          </motion.div>
        </div>

        {/* Reviews Grid - Display 6 initially */}
        {loading ? (
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto mb-4"></div>
            <p className="text-gray-300">Loading reviews...</p>
          </div>
        ) : visibleReviews.length === 0 ? (
          <div className="text-center py-16">
            <div className="card-material p-12 max-w-md mx-auto">
              <Star className="w-16 h-16 mx-auto mb-6 text-gray-400" />
              <h3 className="text-xl font-bold text-white mb-4">No Reviews Yet</h3>
              <p className="text-gray-300">
                Be the first to write a review and share your experience!
              </p>
            </div>
          </div>
        ) : (
          <div className="relative">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
            >
              {visibleReviews.map((review, idx) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="card-material bg-gradient-to-br from-slate-700/50 to-slate-800/50 border-yellow-400/20 shadow-xl h-full hover:shadow-2xl transition-all duration-300">
                  <CardContent className="p-6 flex flex-col h-full">
                    {/* Quote Icon */}
                    <div className="flex justify-center mb-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-yellow-500/20 to-orange-500/20 flex items-center justify-center">
                        <Quote className="w-6 h-6 text-yellow-400" />
                      </div>
                    </div>

                    {/* Stars */}
                    <div className="flex justify-center mb-3">
                      {renderStars(review.rating)}
                    </div>

                    {/* Comment */}
                    <p className="text-sm text-gray-200 leading-relaxed mb-4 flex-grow text-center">
                      &quot;{review.comment}&quot;
                    </p>

                    {/* User Info */}
                    <div className="flex flex-col items-center space-y-2 mt-auto pt-4 border-t border-gray-600">
                      <Avatar className="w-10 h-10 ring-2 ring-yellow-400/30">
                        <AvatarImage src={review.user.image || undefined} alt={review.user.username} />
                        <AvatarFallback className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-bold text-sm">
                          {review.user.username.charAt(0).toUpperCase()}
                          {review.user.username.split(' ').length > 1 && review.user.username.split(' ')[1].charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="text-center">
                        <h4 className="font-semibold text-white text-sm">
                          {review.user.username}
                        </h4>
                        <p className="text-xs text-gray-500">
                          {new Date(review.createdAt).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric',
                            year: 'numeric' 
                          })}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

            {/* See More/Show Less Button */}
            {displayReviews.length > 6 && (
              <div className="flex justify-center mt-8">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    onClick={() => setShowAll(!showAll)}
                    className="btn-material text-lg px-8 py-6 flex items-center space-x-2"
                  >
                    <span>{showAll ? "Show Less" : "See More"}</span>
                    {showAll ? (
                      <ChevronUp className="w-5 h-5" />
                    ) : (
                      <ChevronDown className="w-5 h-5" />
                    )}
                  </Button>
                </motion.div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Review Modal Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl bg-slate-800 border-yellow-400/20">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-white">Write a Review</DialogTitle>
            <DialogDescription className="text-gray-400">
              Share your experience with Sahan Akalanka&apos;s trading services
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmitReview} className="space-y-6 mt-4">
            {/* Star Rating */}
            <div>
              <label className="block text-sm font-medium text-white mb-3">
                Rating
              </label>
              <div className="flex space-x-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    className={`cursor-pointer transition-transform hover:scale-125 ${
                      star <= (hoveredRating || rating)
                        ? "text-yellow-400"
                        : "text-gray-400"
                    }`}
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                  >
                    <Star className="w-10 h-10 fill-current" />
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-400 mt-2">
                {rating === 5 && "Excellent"}
                {rating === 4 && "Good"}
                {rating === 3 && "Average"}
                {rating === 2 && "Poor"}
                {rating === 1 && "Very Poor"}
              </p>
            </div>

            {/* Comment Textarea */}
            <div>
              <label htmlFor="comment" className="block text-sm font-medium text-white mb-2">
                Your Review
              </label>
              <Textarea
                id="comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Write your review here... Share your experience, what you liked, and any recommendations..."
                rows={6}
                className="bg-slate-700 border-gray-600 text-white placeholder-gray-400 focus:border-yellow-400"
                required
              />
              <p className="text-xs text-gray-400 mt-1">
                Minimum 20 characters
              </p>
            </div>

            {/* Submit Buttons */}
            <div className="flex justify-end space-x-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsDialogOpen(false)
                  setComment("")
                  setRating(5)
                }}
                className="border-gray-600 text-gray-300 hover:bg-slate-700"
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="btn-material"
                disabled={isSubmitting || comment.trim().length < 20}
              >
                {isSubmitting ? "Submitting..." : "Submit Review"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </section>
  )
}