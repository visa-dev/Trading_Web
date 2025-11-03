"use client"

import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"
import { useEffect, useState } from "react"
import { ChatInterface } from "@/components/chat-interface"
import { ConversationsList } from "@/components/conversations-list"
import { ChatStats } from "@/components/chat-stats"

export default function ChatPage() {
  const { data: session, status } = useSession()
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null)

  useEffect(() => {
    if (status === "loading") return
    if (!session) {
      redirect("/auth/signin")
    }
    // Only allow traders to access this page
    if (session?.user?.role !== "TRADER") {
      redirect("/")
    }
  }, [session, status])

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!session || session.user?.role !== "TRADER") {
    return null
  }

  return (
    <div className="min-h-screen hero-bg">
      <div className="max-w-7xl mx-auto container-responsive py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Messages</h1>
          <p className="text-gray-300 mt-2">
            Manage conversations with users and provide trading insights
          </p>
        </div>

        <ChatStats />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-200px)]">
          <div className="lg:col-span-1">
            <ConversationsList 
              onSelectConversation={setSelectedConversationId}
              selectedConversationId={selectedConversationId}
            />
          </div>
          
          <div className="lg:col-span-3">
            {selectedConversationId ? (
              <ChatInterface conversationId={selectedConversationId} />
            ) : (
              <div className="h-full flex items-center justify-center card-material">
                <div className="text-center text-gray-300">
                  <p className="text-lg">Select a conversation to start chatting</p>
                  <p className="text-sm text-gray-400 mt-2">Choose a user conversation from the sidebar</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
