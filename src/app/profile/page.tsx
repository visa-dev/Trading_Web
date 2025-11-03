"use client"

import { useSession } from "next-auth/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { User, Mail, Shield, Calendar, Image as ImageIcon } from "lucide-react"

export default function ProfilePage() {
  const { data: session } = useSession()

  if (!session?.user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">My Profile</h1>
          <p className="text-gray-400">View your account information</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-2">
            <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-2">
                  <User className="w-5 h-5" />
                  <span>Personal Information</span>
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Your account details and preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300 flex items-center space-x-2">
                      <User className="w-4 h-4" />
                      <span>Username</span>
                    </label>
                    <div className="p-3 bg-gray-700/30 border border-gray-600 rounded-lg">
                      <p className="text-white font-medium">{session.user.name || "Not set"}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300 flex items-center space-x-2">
                      <Mail className="w-4 h-4" />
                      <span>Email Address</span>
                    </label>
                    <div className="p-3 bg-gray-700/30 border border-gray-600 rounded-lg">
                      <p className="text-white font-medium">{session.user.email || "Not set"}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300 flex items-center space-x-2">
                    <Shield className="w-4 h-4" />
                    <span>Account Role</span>
                  </label>
                  <div className="p-3 bg-gray-700/30 border border-gray-600 rounded-lg">
                    <Badge variant="secondary" className="bg-yellow-400/20 text-yellow-400 border-yellow-400/30 text-sm">
                      {session.user.role}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Profile Picture & Stats */}
          <div className="space-y-6">
            <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-2">
                  <ImageIcon className="w-5 h-5" />
                  <span>Profile Picture</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
                  {session.user.image ? (
                    <img
                      src={session.user.image}
                      alt="Profile"
                      className="w-24 h-24 rounded-full object-cover"
                    />
                  ) : (
                    <User className="w-12 h-12 text-gray-900" />
                  )}
                </div>
                <p className="text-sm text-gray-400">
                  {session.user.image ? "Profile picture" : "No profile picture"}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-2">
                  <Calendar className="w-5 h-5" />
                  <span>Account Info</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-yellow-400">
                    {session.user.role === "TRADER" ? "Trader" : "User"}
                  </p>
                  <p className="text-sm text-gray-400">Account Type</p>
                </div>
                
                <div className="pt-4 border-t border-gray-700">
                  <p className="text-xs text-gray-500 text-center">
                    Account managed by Sahan Akalanka Trading Platform
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
