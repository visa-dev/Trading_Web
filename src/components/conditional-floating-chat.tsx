"use client"

import { useSession } from "next-auth/react"
import { FloatingChat } from "./floating-chat"

export function ConditionalFloatingChat() {
  const { data: session } = useSession()

  if (!session?.user) {
    return null
  }

  if (session.user.role === "TRADER") {
    return null
  }

  return <FloatingChat />
}
