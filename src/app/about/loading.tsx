import { LoadingSpinner } from "@/components/loading-spinner"

export default function AboutLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-8">
      <LoadingSpinner message="Loading Sahan's story..." size="lg" />
    </div>
  )
}
