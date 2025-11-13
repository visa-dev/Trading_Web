import { LoadingSpinner } from "@/components/loading-spinner"

export default function VideosLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 flex items-center justify-center p-8">
      <LoadingSpinner message="Fetching education videos..." size="lg" />
    </div>
  )
}
