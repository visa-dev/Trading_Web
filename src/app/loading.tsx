import { LoadingSpinner } from "@/components/loading-spinner"

export default function GlobalLoading() {
  return (
    <div className="min-h-screen hero-bg flex items-center justify-center p-8">
      <LoadingSpinner message="Preparing your trading experience..." size="lg" />
    </div>
  )
}
