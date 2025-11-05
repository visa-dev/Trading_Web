import { notFound } from "next/navigation"
import { prisma } from "@/lib/db"
import { VideoPlayer } from "@/components/video-player"

interface VideoPageProps {
  params: Promise<{
    id: string
  }>
  searchParams: Promise<{
    tab?: string
  }>
}

async function getVideo(id: string) {
  try {
    const video = await prisma.tradingVideo.findUnique({
      where: {
        id
      }
    })
    return video
  } catch (error) {
    console.error('Error fetching video:', error)
    return null
  }
}

export default async function VideoPage({ params, searchParams }: VideoPageProps) {
  const { id } = await params
  const { tab } = await searchParams
  const video = await getVideo(id)

  if (!video) {
    notFound()
  }

  const activeTab = tab || 'video'

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700">
      <div className="max-w-7xl mx-auto container-responsive py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">{video.title}</h1>
          <p className="text-gray-300">
            Published on {new Date(video.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
        </div>

        <VideoPlayer video={video} activeTab={activeTab} />
      </div>
    </div>
  )
}
