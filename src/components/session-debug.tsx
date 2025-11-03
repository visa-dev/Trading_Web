"use client"

import { useSession } from "next-auth/react"
import { useEffect } from "react"

export function SessionDebug() {
  const { data: session, status } = useSession()

  useEffect(() => {
    console.log("Session updated:", {
      status,
      user: session?.user,
      timestamp: new Date().toISOString()
    })
  }, [session, status])

  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return null
  }

  return (
    <div className="fixed bottom-4 left-4 bg-black/80 text-white p-2 rounded text-xs max-w-xs">
      <div>Status: {status}</div>
      <div>Name: {session?.user?.name}</div>
      <div>Email: {session?.user?.email}</div>
      <div>Role: {session?.user?.role}</div>
    </div>
  )
}
