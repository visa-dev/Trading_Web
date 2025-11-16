"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Mail, Lock, Eye, EyeOff, Save, ArrowLeft, AlertCircle, CheckCircle2 } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import { motion } from "framer-motion"
import { LoadingSpinner } from "@/components/loading-spinner"

export default function SettingsPage() {
  const { data: session, update } = useSession()
  const user = session?.user ?? null

  // Email change state
  const [newEmail, setNewEmail] = useState("")
  const [emailPassword, setEmailPassword] = useState("")
  const [showEmailPassword, setShowEmailPassword] = useState(false)
  const [isChangingEmail, setIsChangingEmail] = useState(false)

  // Password change state
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isChangingPassword, setIsChangingPassword] = useState(false)

  if (!user) {
    return (
      <div className="min-h-screen hero-bg flex items-center justify-center">
        <LoadingSpinner message="Loading settings..." />
      </div>
    )
  }

  const handleEmailChange = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!newEmail.trim()) {
      toast.error("Please enter a new email address")
      return
    }

    if (!emailPassword) {
      toast.error("Please enter your password to confirm email change")
      return
    }

    if (newEmail.trim().toLowerCase() === user.email?.toLowerCase()) {
      toast.error("New email must be different from your current email")
      return
    }

    setIsChangingEmail(true)

    try {
      const response = await fetch("/api/settings/email", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          newEmail: newEmail.trim().toLowerCase(),
          password: emailPassword,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to update email")
      }

      // Update session
      await update({
        user: {
          email: data.email,
        },
      })

      toast.success("Email updated successfully")
      setNewEmail("")
      setEmailPassword("")
    } catch (error) {
      console.error("Email change error:", error)
      toast.error(error instanceof Error ? error.message : "Failed to update email")
    } finally {
      setIsChangingEmail(false)
    }
  }

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!currentPassword) {
      toast.error("Please enter your current password")
      return
    }

    if (!newPassword) {
      toast.error("Please enter a new password")
      return
    }

    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters long")
      return
    }

    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match")
      return
    }

    if (currentPassword === newPassword) {
      toast.error("New password must be different from current password")
      return
    }

    setIsChangingPassword(true)

    try {
      const response = await fetch("/api/settings/password", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to update password")
      }

      toast.success("Password updated successfully")
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
    } catch (error) {
      console.error("Password change error:", error)
      toast.error(error instanceof Error ? error.message : "Failed to update password")
    } finally {
      setIsChangingPassword(false)
    }
  }

  const getPasswordStrength = (password: string) => {
    if (password.length === 0) return { strength: 0, label: "", color: "" }
    if (password.length < 8) return { strength: 1, label: "Weak", color: "text-red-400" }
    
    let strength = 0
    if (password.length >= 8) strength++
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++
    if (/\d/.test(password)) strength++
    if (/[^a-zA-Z\d]/.test(password)) strength++

    if (strength <= 1) return { strength, label: "Weak", color: "text-red-400" }
    if (strength === 2) return { strength, label: "Fair", color: "text-yellow-400" }
    if (strength === 3) return { strength, label: "Good", color: "text-blue-400" }
    return { strength, label: "Strong", color: "text-green-400" }
  }

  const passwordStrength = getPasswordStrength(newPassword)

  return (
    <div className="min-h-screen hero-bg py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <Link 
            href="/dashboard" 
            className="inline-flex items-center text-yellow-400 hover:text-yellow-300 transition-colors mb-6 text-sm sm:text-base"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Link>
          
          <div className="text-center mb-8">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2">Account Settings</h1>
            <p className="text-sm sm:text-base text-gray-400">Manage your email and password</p>
          </div>
        </motion.div>

        <div className="space-y-6">
          {/* Current Account Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Card className="card-material bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-2">
                  <CheckCircle2 className="w-5 h-5 text-green-400" />
                  <span>Current Account Information</span>
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Your account details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-gray-400 text-sm">Current Email</Label>
                    <div className="p-3 bg-gray-700/30 border border-gray-600 rounded-lg">
                      <p className="text-white font-medium">{user.email || "Not set"}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-400 text-sm">Account Role</Label>
                    <div className="p-3 bg-gray-700/30 border border-gray-600 rounded-lg">
                      <p className="text-white font-medium">{user.role || "USER"}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Change Email */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="card-material bg-gradient-to-br from-yellow-500/5 to-orange-500/5 border-yellow-500/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-2">
                  <Mail className="w-5 h-5 text-yellow-400" />
                  <span>Change Email Address</span>
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Update your email address. You'll need to confirm with your password.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleEmailChange} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="newEmail" className="text-white">New Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        id="newEmail"
                        type="email"
                        placeholder="Enter new email address"
                        value={newEmail}
                        onChange={(e) => setNewEmail(e.target.value)}
                        className="pl-10 bg-gray-800/50 border-gray-700 text-white placeholder-gray-400 focus:border-yellow-400"
                        required
                        disabled={isChangingEmail}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="emailPassword" className="text-white">Confirm with Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        id="emailPassword"
                        type={showEmailPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        value={emailPassword}
                        onChange={(e) => setEmailPassword(e.target.value)}
                        className="pl-10 pr-10 bg-gray-800/50 border-gray-700 text-white placeholder-gray-400 focus:border-yellow-400"
                        required
                        disabled={isChangingEmail}
                      />
                      <button
                        type="button"
                        onClick={() => setShowEmailPassword(!showEmailPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                        disabled={isChangingEmail}
                      >
                        {showEmailPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={isChangingEmail || !newEmail.trim() || !emailPassword}
                    className="w-full btn-material disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isChangingEmail ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Updating Email...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Update Email
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>

          {/* Change Password */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Card className="card-material bg-gradient-to-br from-blue-500/5 to-cyan-500/5 border-blue-500/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-2">
                  <Lock className="w-5 h-5 text-blue-400" />
                  <span>Change Password</span>
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Update your password to keep your account secure.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePasswordChange} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword" className="text-white">Current Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        id="currentPassword"
                        type={showCurrentPassword ? "text" : "password"}
                        placeholder="Enter current password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="pl-10 pr-10 bg-gray-800/50 border-gray-700 text-white placeholder-gray-400 focus:border-blue-400"
                        required
                        disabled={isChangingPassword}
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                        disabled={isChangingPassword}
                      >
                        {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="newPassword" className="text-white">New Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        id="newPassword"
                        type={showNewPassword ? "text" : "password"}
                        placeholder="Enter new password (min. 8 characters)"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="pl-10 pr-10 bg-gray-800/50 border-gray-700 text-white placeholder-gray-400 focus:border-blue-400"
                        required
                        disabled={isChangingPassword}
                        minLength={8}
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                        disabled={isChangingPassword}
                      >
                        {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {newPassword && (
                      <div className="flex items-center space-x-2 mt-2">
                        <div className="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden">
                          <div
                            className={`h-full transition-all duration-300 ${
                              passwordStrength.strength <= 1
                                ? "bg-red-500 w-1/4"
                                : passwordStrength.strength === 2
                                ? "bg-yellow-500 w-2/4"
                                : passwordStrength.strength === 3
                                ? "bg-blue-500 w-3/4"
                                : "bg-green-500 w-full"
                            }`}
                          />
                        </div>
                        <span className={`text-xs font-medium ${passwordStrength.color}`}>
                          {passwordStrength.label}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-white">Confirm New Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm new password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="pl-10 pr-10 bg-gray-800/50 border-gray-700 text-white placeholder-gray-400 focus:border-blue-400"
                        required
                        disabled={isChangingPassword}
                        minLength={8}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                        disabled={isChangingPassword}
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {confirmPassword && newPassword && confirmPassword !== newPassword && (
                      <div className="flex items-center space-x-2 mt-2 text-red-400 text-sm">
                        <AlertCircle className="w-4 h-4" />
                        <span>Passwords do not match</span>
                      </div>
                    )}
                    {confirmPassword && newPassword && confirmPassword === newPassword && newPassword.length >= 8 && (
                      <div className="flex items-center space-x-2 mt-2 text-green-400 text-sm">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Passwords match</span>
                      </div>
                    )}
                  </div>

                  <Button
                    type="submit"
                    disabled={
                      isChangingPassword ||
                      !currentPassword ||
                      !newPassword ||
                      !confirmPassword ||
                      newPassword !== confirmPassword ||
                      newPassword.length < 8 ||
                      currentPassword === newPassword
                    }
                    className="w-full btn-material disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isChangingPassword ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Updating Password...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Update Password
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

