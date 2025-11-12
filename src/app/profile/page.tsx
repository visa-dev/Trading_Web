"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import Cropper, { Area } from "react-easy-crop"
import { User, Mail, Shield, Calendar, Image as ImageIcon, Upload, Trash } from "lucide-react"
import { LoadingSpinner } from "@/components/loading-spinner"
import { toast } from "sonner"
import { getCroppedImage } from "@/lib/crop-image"

const revokeObjectUrl = (url: string | null) => {
  if (url && url.startsWith("blob:")) {
    URL.revokeObjectURL(url)
  }
}

export default function ProfilePage() {
  const { data: session, update } = useSession()
  const user = session?.user ?? null

  const [preparedFile, setPreparedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  const [cropDialogOpen, setCropDialogOpen] = useState(false)
  const [cropImageSrc, setCropImageSrc] = useState<string | null>(null)
  const [filePendingCrop, setFilePendingCrop] = useState<File | null>(null)
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)

  useEffect(() => {
    return () => {
      revokeObjectUrl(previewUrl)
      revokeObjectUrl(cropImageSrc)
    }
  }, [previewUrl, cropImageSrc])

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null
    event.target.value = ""

    if (!file) {
      return
    }

    const objectUrl = URL.createObjectURL(file)
    setFilePendingCrop(file)
    setCropImageSrc(objectUrl)
    setCropDialogOpen(true)
    setCrop({ x: 0, y: 0 })
    setZoom(1)
    setCroppedAreaPixels(null)
  }

  const onCropComplete = useCallback((_: Area, areaPixels: Area) => {
    setCroppedAreaPixels(areaPixels)
  }, [])

  const closeCropDialog = () => {
    setCropDialogOpen(false)
    revokeObjectUrl(cropImageSrc)
    setCropImageSrc(null)
    setFilePendingCrop(null)
    setCroppedAreaPixels(null)
  }

  const applyCrop = async () => {
    if (!cropImageSrc || !filePendingCrop || !croppedAreaPixels) {
      toast.error("Select and crop an image first.")
      return
    }

    try {
      const blob = await getCroppedImage(cropImageSrc, croppedAreaPixels)
      const fileName = filePendingCrop.name || `profile-${Date.now()}.jpg`
      const croppedFile = new File([blob], fileName, { type: blob.type || filePendingCrop.type || "image/jpeg" })

      const newPreview = URL.createObjectURL(blob)
      revokeObjectUrl(previewUrl)
      setPreviewUrl(newPreview)
      setPreparedFile(croppedFile)
      toast.success("Image ready to upload")
    } catch (error) {
      console.error(error)
      toast.error("Failed to crop image")
    } finally {
      closeCropDialog()
    }
  }

  const uploadProfilePhoto = async () => {
    if (!preparedFile) {
      toast.error("Please choose and crop a photo before uploading.")
      return
    }

    setIsUploading(true)

    try {
      const formData = new FormData()
      formData.append("file", preparedFile)
      formData.append("folder", "profile-images")

      const uploadResponse = await fetch("/api/uploads", {
        method: "POST",
        body: formData,
      })

      if (!uploadResponse.ok) {
        throw new Error("Upload failed")
      }

      const { url } = await uploadResponse.json()

      const updateResponse = await fetch("/api/profile/photo", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl: url }),
      })

      if (!updateResponse.ok) {
        throw new Error("Failed to save profile photo")
      }

      await update({ user: { image: url } })
      toast.success("Profile photo updated")

      revokeObjectUrl(previewUrl)
      setPreviewUrl(url)
      setPreparedFile(null)
    } catch (error) {
      console.error(error)
      toast.error("Could not update profile photo")
    } finally {
      setIsUploading(false)
    }
  }

  const removeProfilePhoto = async () => {
    setIsUploading(true)
    try {
      const response = await fetch("/api/profile/photo", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl: null }),
      })

      if (!response.ok) {
        throw new Error("Failed to remove photo")
      }

      await update({ user: { image: null } })
      toast.success("Profile photo removed")
      setPreparedFile(null)
      revokeObjectUrl(previewUrl)
      setPreviewUrl(null)
    } catch (error) {
      console.error(error)
      toast.error("Could not remove profile photo")
    } finally {
      setIsUploading(false)
    }
  }

  const displayImage = useMemo(() => {
    if (previewUrl) return previewUrl
    return user?.image ?? null
  }, [previewUrl, user?.image])

  const role = useMemo(() => {
    return (user as { role?: string } | null)?.role ?? "USER"
  }, [user])

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <LoadingSpinner message="Fetching your profile..." />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">My Profile</h1>
          <p className="text-gray-400">Manage your account information and profile photo</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-2">
                  <User className="w-5 h-5" />
                  <span>Personal Information</span>
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Your account details at a glance
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
                      <p className="text-white font-medium">{user.name || "Not set"}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300 flex items-center space-x-2">
                      <Mail className="w-4 h-4" />
                      <span>Email Address</span>
                    </label>
                    <div className="p-3 bg-gray-700/30 border border-gray-600 rounded-lg">
                      <p className="text-white font-medium">{user.email || "Not set"}</p>
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
                      {role}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-2">
                  <ImageIcon className="w-5 h-5" />
                  <span>Profile Picture</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center overflow-hidden">
                  {displayImage ? (
                    <img src={displayImage} alt="Profile" className="w-24 h-24 object-cover" />
                  ) : (
                    <User className="w-12 h-12 text-gray-900" />
                  )}
                </div>
                <p className="text-sm text-gray-400 mb-4">
                  {displayImage ? "Profile picture" : "No profile picture"}
                </p>
                <div className="space-y-3">
                  <Input id="profilePhoto" type="file" accept="image/*" onChange={handleFileChange} />
                  <Button
                    type="button"
                    onClick={uploadProfilePhoto}
                    disabled={isUploading || !preparedFile}
                    className="w-full bg-amber-600 hover:bg-amber-700 flex items-center justify-center space-x-2"
                  >
                    <Upload className="w-4 h-4" />
                    <span>{isUploading ? "Uploading..." : "Upload Photo"}</span>
                  </Button>
                  {(user.image || previewUrl) && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={removeProfilePhoto}
                      disabled={isUploading}
                      className="w-full flex items-center justify-center space-x-2 border-red-500/40 text-red-400 hover:bg-red-500/10"
                    >
                      <Trash className="w-4 h-4" />
                      <span>Remove Photo</span>
                    </Button>
                  )}
                </div>
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
                    {role === "TRADER" ? "Trader" : "User"}
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

      <Dialog open={cropDialogOpen} onOpenChange={(open) => (!open ? closeCropDialog() : setCropDialogOpen(true))}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Crop Profile Photo</DialogTitle>
          </DialogHeader>
          <div className="relative w-full h-80 bg-gray-900 rounded-lg overflow-hidden">
            {cropImageSrc && (
              <Cropper
                image={cropImageSrc}
                crop={crop}
                zoom={zoom}
                aspect={1}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            )}
          </div>
          <div className="mt-4">
            <label htmlFor="cropZoomRange" className="text-sm text-gray-400 mb-2 block">
              Zoom
            </label>
            <input
              id="cropZoomRange"
              type="range"
              min={1}
              max={3}
              step={0.1}
              value={zoom}
              onChange={(event) => setZoom(Number(event.target.value))}
              className="w-full"
            />
          </div>
          <DialogFooter className="flex justify-end space-x-3">
            <Button type="button" variant="outline" onClick={closeCropDialog}>
              Cancel
            </Button>
            <Button type="button" onClick={applyCrop}>
              Apply Crop
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

