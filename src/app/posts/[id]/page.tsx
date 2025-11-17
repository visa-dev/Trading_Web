import { notFound } from "next/navigation"
import { prisma } from "@/lib/db"
import { PerformancePostDetails } from "@/components/performance-post-details"
import { ReviewsSection } from "@/components/reviews-section"

interface PostPageProps {
  params: Promise<{
    id: string
  }>
  searchParams: Promise<{
    tab?: string
  }>
}

async function getPost(id: string) {
  try {
    const post = await prisma.performancePost.findUnique({
      where: {
        id,
        published: true
      },
      include: {
        reviews: {
          where: {
            status: "APPROVED"
          },
          include: {
            user: {
              select: {
                username: true,
                image: true
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          }
        }
      }
    })
    return post
  } catch (error) {
    console.error('Error fetching post:', error)
    return null
  }
}

export default async function PostPage({ params, searchParams }: PostPageProps) {
  const { id } = await params
  const { tab } = await searchParams
  const post = await getPost(id)

  if (!post) {
    notFound()
  }

  const activeTab = tab || 'details'

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <PerformancePostDetails post={post} activeTab={activeTab} />
        <div className="mt-12">
          <ReviewsSection 
            reviews={post.reviews} 
            postId={post.id} 
            type="POST"
          />
        </div>
      </div>
    </div>
  )
}