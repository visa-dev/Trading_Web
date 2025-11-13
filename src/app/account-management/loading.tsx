import { LoadingSpinner } from "@/components/loading-spinner"

export default function AccountManagementLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 flex items-center justify-center p-8">
      <LoadingSpinner message="Loading account management..." size="lg" />
    </div>
  )
}
