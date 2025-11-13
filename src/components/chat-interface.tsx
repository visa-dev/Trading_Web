"use client"

import { useEffect, useState, useRef, useCallback } from "react"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Send, MessageSquare } from "lucide-react"
import { addCacheBusting } from "@/lib/chat-utils"

interface Message {
  id: string
  content: string
  senderId: string
  createdAt: Date
  read: boolean
  sender: {
    username: string
    image?: string | null
    role: "USER" | "TRADER"
  }
}

interface ChatInterfaceProps {
  conversationId: string
}

export function ChatInterface({ conversationId }: ChatInterfaceProps) {
  const { data: session } = useSession()
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const fetchMessages = useCallback(async () => {
    if (!conversationId) return
    
    try {
      const response = await fetch(addCacheBusting(`/api/conversations/${conversationId}/messages`))
      if (response.ok) {
        const data = await response.json()
        setMessages(data.messages || [])
      }
    } catch (error) {
      console.error('Error fetching messages:', error)
    } finally {
      setLoading(false)
    }
  }, [conversationId])

  useEffect(() => {
    if (conversationId) {
      fetchMessages()
    }
  }, [conversationId, fetchMessages])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!newMessage.trim() || sending) return

    setSending(true)
    const messageContent = newMessage.trim()
    setNewMessage("")

    try {
      const response = await fetch(`/api/conversations/${conversationId}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: messageContent,
        }),
      })

      if (response.ok) {
        fetchMessages() // Refresh messages
      } else {
        setNewMessage(messageContent) // Restore message on error
      }
    } catch (error) {
      console.error('Error sending message:', error)
      setNewMessage(messageContent) // Restore message on error
    } finally {
      setSending(false)
    }
  }

  const formatMessageTime = (date: Date) => {
    return new Date(date).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  if (loading) {
    return (
      <Card className="h-full card-material">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-white">
            <MessageSquare className="w-5 h-5" />
            <span>Loading conversation...</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-96">
          <div className="text-center text-gray-300">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-400 mx-auto mb-4"></div>
            <p>Loading messages...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="h-full flex flex-col card-material">
      <CardHeader className="border-b border-gray-700/50">
        <CardTitle className="flex items-center space-x-2 text-white">
          <MessageSquare className="w-5 h-5" />
          <span>Chat</span>
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 min-h-0">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center text-gray-300">
                <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p>No messages yet</p>
                <p className="text-sm text-gray-400">Start the conversation!</p>
              </div>
            </div>
          ) : (
            messages.map((message) => {
              const isOwnMessage = message.sender.role === "TRADER"
              
              return (
                <div
                  key={message.id}
                  className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex items-start space-x-3 max-w-xs lg:max-w-md ${
                    isOwnMessage ? 'flex-row-reverse space-x-reverse' : ''
                  }`}>
                    <Avatar className="w-8 h-8 flex-shrink-0">
                      <AvatarImage src={message.sender.image || ""} />
                      <AvatarFallback>
                        {message.sender.username.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className={`flex flex-col ${
                      isOwnMessage ? 'items-end' : 'items-start'
                    }`}>
                      <div
                        className={`px-4 py-2 rounded-lg ${
                          isOwnMessage
                            ? 'bg-yellow-500 text-black'
                            : 'bg-gray-800 text-white border border-gray-700'
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                      </div>
                      
                      <div className={`flex items-center space-x-1 mt-1 ${
                        isOwnMessage ? 'flex-row-reverse space-x-reverse' : ''
                      }`}>
                        <span className="text-xs text-gray-400">
                          {formatMessageTime(message.createdAt)}
                        </span>
                        {isOwnMessage && (
                          <span className="text-xs text-gray-400">
                            {message.read ? '✓✓' : '✓'}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div className="border-t border-gray-700/50 p-4 bg-gray-900/50">
          <form onSubmit={sendMessage} className="flex space-x-2">
            <Textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              rows={1}
              className="flex-1 resize-none bg-gray-800 border-gray-700 text-white placeholder-gray-400"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  sendMessage(e)
                }
              }}
            />
            <Button 
              type="submit" 
              disabled={!newMessage.trim() || sending}
              className="btn-material"
            >
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </div>
      </CardContent>
    </Card>
  )
}
