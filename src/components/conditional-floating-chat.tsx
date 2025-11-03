"use client"

import { useSession } from "next-auth/react"
import { FloatingChat } from "./floating-chat"

export function ConditionalFloatingChat() {
  const { data: session } = useSession()
  
  // Only show floating chat for users, not traders
  if (session?.user?.role === "TRADER") {
    return null
  }
  
  return <FloatingChat />
}
