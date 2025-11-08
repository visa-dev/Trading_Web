import Link from "next/link"
import { Button } from "@/components/ui/button"

export const dynamic = "force-dynamic"

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center space-y-6">
      <div className="space-y-3">
        <p className="text-sm font-medium text-yellow-400 uppercase tracking-wide">
          404 - Page Not Found
        </p>
        <h1 className="text-4xl font-bold text-white">
          Oops! We couldn&apos;t find that page.
        </h1>
        <p className="text-lg text-gray-300 max-w-xl mx-auto">
          The page you&apos;re looking for might have been moved, deleted, or never existed.
          Let&apos;s get you back on track.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <Button asChild className="btn-material">
          <Link href="/">
            Back to Home
          </Link>
        </Button>
        <Button asChild variant="outline" className="border-yellow-400/40 text-yellow-300 hover:bg-yellow-400/10">
          <Link href="/contact">
            Contact Support
          </Link>
        </Button>
      </div>
    </div>
  )
}

