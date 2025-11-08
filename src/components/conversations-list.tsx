"use client"

import { useEffect, useState, useCallback } from "react"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { MessageSquare, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { addCacheBusting } from "@/lib/chat-utils"

interface Conversation {
  id: string
  lastMessage?: string | null
  unreadCount: number
  updatedAt: Date
  user?: {
    username: string
    image?: string | null
  }
  trader?: {
    username: string
    image?: string | null
  }
}

interface ConversationsListProps {
  onSelectConversation: (conversationId: string) => void
  selectedConversationId: string | null
}

export function ConversationsList({ onSelectConversation, selectedConversationId }: ConversationsListProps) {
  const { data: session } = useSession()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [loading, setLoading] = useState(true)

  const fetchConversations = useCallback(async () => {
    try {
      const response = await fetch(addCacheBusting('/api/conversations'))
      if (response.ok) {
        const data = await response.json()
        setConversations(data.conversations || [])
      }
    } catch (error) {
      console.error('Error fetching conversations:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchConversations()
  }, [fetchConversations])

  const startNewConversation = async () => {
    try {
      const response = await fetch('/api/conversations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      })

      if (response.ok) {
        const data = await response.json()
        fetchConversations() // Refresh the list
        onSelectConversation(data.conversation.id)
      }
    } catch (error) {
      console.error('Error starting conversation:', error)
    }
  }

  const formatLastMessageTime = (date: Date) => {
    const now = new Date()
    const diffInHours = (now.getTime() - new Date(date).getTime()) / (1000 * 60 * 60)
    
    if (diffInHours < 1) {
      return 'Just now'
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`
    } else {
      return new Date(date).toLocaleDateString()
    }
  }

  if (loading) {
    return (
      <Card className="card-material">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-white">
            <MessageSquare className="w-5 h-5" />
            <span>Conversations</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center space-x-3 animate-pulse">
                <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="card-material">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-white">
          <div className="flex items-center space-x-2">
            <MessageSquare className="w-5 h-5" />
            <span>Conversations</span>
          </div>
          {session?.user?.role === "USER" && (
            <Button size="sm" onClick={startNewConversation} className="btn-material">
              <Plus className="w-4 h-4" />
            </Button>
          )}
        </CardTitle>
        <CardDescription className="text-gray-300">
          {session?.user?.role === "TRADER" 
            ? "Manage user conversations" 
            : "Start a conversation with the trader"
          }
        </CardDescription>
      </CardHeader>

      <CardContent className="p-0">
        {conversations.length === 0 ? (
          <div className="p-6 text-center text-gray-300">
            <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p>No conversations yet</p>
            {session?.user?.role === "USER" && (
              <Button 
                onClick={startNewConversation}
                className="mt-4 btn-material"
              >
                Start Conversation
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-1">
            {conversations.map((conversation) => {
              const otherUser = session?.user?.role === "TRADER" 
                ? conversation.user 
                : conversation.trader

              return (
                <div
                  key={conversation.id}
                  className={`p-4 cursor-pointer hover:bg-gray-800/50 border-b border-gray-700/50 transition-colors duration-200 ${
                    selectedConversationId === conversation.id 
                      ? 'bg-yellow-500/10 border-yellow-400/30' 
                      : ''
                  }`}
                  onClick={() => onSelectConversation(conversation.id)}
                >
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={otherUser?.image || ""} />
                      <AvatarFallback>
                        {otherUser?.username?.charAt(0).toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-white truncate">
                          {otherUser?.username || "Unknown User"}
                        </p>
                        {/* Unread count badge hidden */}
                      </div>
                      
                      <div className="flex items-center justify-between mt-1">
                        <p className="text-xs text-gray-300 truncate">
                          {conversation.lastMessage || "No messages yet"}
                        </p>
                        <p className="text-xs text-gray-400">
                          {formatLastMessageTime(conversation.updatedAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
