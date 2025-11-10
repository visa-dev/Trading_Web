"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Settings, Shield, Users } from "lucide-react"

export default function AccountManagementPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-16">
      <div className="max-w-5xl mx-auto px-4 space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm uppercase tracking-wide text-yellow-400 flex items-center space-x-2">
              <Shield className="w-4 h-4" />
              <span>Account Management</span>
            </p>
            <h1 className="mt-3 text-4xl font-bold text-white">Manage Your Trading Account</h1>
            <p className="mt-3 text-gray-300 max-w-2xl">
              This page is coming soon. We&apos;re preparing a unified hub for profile, security,
              permissions, and copy-trading preferences. Stay tuned for updates.
            </p>
          </div>
          <Button asChild variant="outline" className="btn-material-outline">
            <Link href="/">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="card-material border border-slate-700/60">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-white">
                <Settings className="w-5 h-5 text-yellow-400" />
                <span>Profile & Security</span>
              </CardTitle>
              <CardDescription>
                Update personal details, enable two-factor authentication, and manage login activity.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="card-material border border-slate-700/60">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-white">
                <Users className="w-5 h-5 text-yellow-400" />
                <span>Copy Trading Controls</span>
              </CardTitle>
              <CardDescription>
                Configure signal preferences, manage followed traders, and tune risk exposure.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        <Card className="card-material border border-slate-700/60">
          <CardHeader>
            <CardTitle className="text-white">What&apos;s Coming Next</CardTitle>
            <CardDescription>
              We&apos;re working on powerful tooling so you can self-serve key account actions:
            </CardDescription>
          </CardHeader>
          <CardContent className="text-gray-300 space-y-3">
            <ul className="list-disc list-inside space-y-2">
              <li>Granular access management for copy-trading channels</li>
              <li>Automated KYC verification and document uploads</li>
              <li>Integrated billing and payout history</li>
              <li>Real-time alerts for strategy updates and drawdown thresholds</li>
            </ul>
            <p className="pt-2 text-sm text-gray-400">
              Need something specific? <Link href="/contact" className="text-yellow-400 hover:underline">Contact our team</Link> and we&apos;ll prioritize it.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

