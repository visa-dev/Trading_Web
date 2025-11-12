"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { useSession } from "next-auth/react"
import { motion, AnimatePresence } from "framer-motion"
import { MessageCircle, X, Send, Bot, LogIn } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { addCacheBusting } from "@/lib/chat-utils"

interface Message {
  id: string
  content: string
  senderId: string
  timestamp: Date
  sender: {
    username: string
    image: string | null
    role: "USER" | "TRADER"
  }
}

export function FloatingChat() {
  const { data: session } = useSession()
  const sessionRole = (session?.user as { role?: string } | undefined)?.role ?? null
  const sessionUserId = (session?.user as { id?: string } | undefined)?.id ?? null
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [conversationId, setConversationId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const lastSeenMessageIdRef = useRef<string | null>(null)
  const [hasIncomingTraderMessage, setHasIncomingTraderMessage] = useState(false)
  const latestMessageMetaRef = useRef<{
    id: string | null
    senderRole: "USER" | "TRADER" | null
  }>({ id: null, senderRole: null })

  const viewerIsTrader = useMemo(() => sessionRole === "TRADER", [sessionRole])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const fetchMessages = useCallback(
    async (convId?: string, options?: { showLoading?: boolean }) => {
      const id = convId || conversationId
      if (!id) return
      const showLoading = options?.showLoading ?? false

      try {
        if (showLoading) {
          setLoading(true)
        }

        const response = await fetch(addCacheBusting(`/api/conversations/${id}/messages`))
        if (response.ok) {
        const data = await response.json()
        // Convert API response to expected format
        const formattedMessages = (data.messages || []).map((msg: {
          id: string
          content: string
          senderId: string
          createdAt: string
          sender: {
            username: string
            image: string | null
            role: "USER" | "TRADER"
          }
        }) => {
          const isTrader = msg.sender.role === "TRADER"
          return {
            id: msg.id,
            content: msg.content,
            senderId: msg.senderId,
            timestamp: new Date(msg.createdAt),
            sender: {
              username: isTrader ? "Signal Expert" : msg.sender.username,
              image: msg.sender.image,
              role: msg.sender.role
            }
          }
        })
        setMessages(formattedMessages)
        if (formattedMessages.length > 0) {
          const lastMessage = formattedMessages[formattedMessages.length - 1]
          latestMessageMetaRef.current = {
            id: lastMessage.id,
            senderRole: lastMessage.sender.role,
          }
          if (!viewerIsTrader) {
            lastSeenMessageIdRef.current = lastMessage.id
            if (lastMessage.sender.role === "TRADER") {
              setHasIncomingTraderMessage(false)
            }
          }
        }
        if (viewerIsTrader) {
          setUnreadCount(0)
        }
        }
      } catch (error) {
        console.error('Error fetching messages:', error)
      } finally {
        if (showLoading) {
          setLoading(false)
        }
      }
    },
    [conversationId, viewerIsTrader]
  )

  // Initialize conversation when chat opens
  useEffect(() => {
    if (isOpen && session && !conversationId) {
      initializeConversation()
    }
  }, [isOpen, session, conversationId])

  const initializeConversation = async () => {
    try {
      // Get or create conversation with trader
      const response = await fetch('/api/conversations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({})
      })
      
      if (response.ok) {
        const data = await response.json()
        const newConversationId = data.conversation.id
        setConversationId(newConversationId)
        
        // Add welcome message if it's a new conversation
        if (data.message === "Conversation created") {
          const welcomeMessage: Message = {
            id: "welcome",
            content: "Welcome to the Signal Expert trading assistant! How can I support you today?",
            senderId: "trader",
            timestamp: new Date(),
            sender: {
              username: "Signal Expert",
              image: null,
              role: "TRADER"
            }
          }
          setMessages([welcomeMessage])
        } else {
          await fetchMessages(newConversationId, { showLoading: true })
        }
      }
    } catch (error) {
      console.error('Error initializing conversation:', error)
    }
  }

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !conversationId) return
    
    if (!session) {
      // Redirect to login if not authenticated
      window.location.href = '/auth/signin'
      return
    }

    const messageContent = newMessage
    setNewMessage("")
    setIsTyping(true)

    try {
      const response = await fetch(`/api/conversations/${conversationId}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: messageContent
        })
      })

      if (response.ok) {
        // Refresh messages to get the latest
        await fetchMessages(undefined, { showLoading: false })
      }
    } catch (error) {
      console.error('Error sending message:', error)
    } finally {
      setIsTyping(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  // Scroll to bottom when opening the chat panel
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(scrollToBottom, 0)
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  // Scroll to bottom on new messages or typing changes
  useEffect(() => {
    if (isOpen) {
      scrollToBottom()
    }
  }, [messages, isTyping, isOpen])

  if (!session) {
    return (
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <Button
          data-chat-trigger
          onClick={() => window.location.href = '/auth/signin'}
          className="w-14 h-14 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <LogIn className="w-6 h-6 text-white" />
        </Button>
      </motion.div>
    )
  }

  return (
    <>
      {/* Floating Chat Button */}
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Button
            data-chat-trigger
            onClick={() => {
              setIsOpen(!isOpen)
              if (!isOpen) {
                setHasIncomingTraderMessage(false)
                if (!viewerIsTrader && latestMessageMetaRef.current.senderRole === "TRADER") {
                  lastSeenMessageIdRef.current = latestMessageMetaRef.current.id
                }
                if (conversationId) {
                  fetchMessages(conversationId, { showLoading: true })
                }
              }
            }}
            className="w-14 h-14 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 shadow-lg hover:shadow-xl transition-all duration-300 relative"
          >
            <AnimatePresence mode="wait">
              {isOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <X className="w-6 h-6 text-white" />
                </motion.div>
              ) : (
                <motion.div
                  key="chat"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <MessageCircle className="w-6 h-6 text-white" />
                </motion.div>
              )}
            </AnimatePresence>
            {(viewerIsTrader && unreadCount > 0 && !isOpen) || (!viewerIsTrader && hasIncomingTraderMessage) ? (
              <motion.span
                key="chat-badge"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="absolute -top-1.5 -right-1.5 min-w-[1.6rem] h-6 px-1 rounded-full bg-red-500 text-white text-xs font-semibold flex items-center justify-center shadow-lg"
              >
                {viewerIsTrader ? (unreadCount > 99 ? "99+" : unreadCount) : "+1"}
              </motion.span>
            ) : null}
          </Button>
        </motion.div>

        {/* Notification Badge - Hidden */}
      </motion.div>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />
            
            {/* Chat Panel */}
            <motion.div
              className="fixed bottom-24 right-6 w-96 h-[28rem] bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden"
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              {/* Chat Header */}
              <div className="bg-gradient-to-r from-yellow-500 to-orange-500 p-4 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                    <Bot className="w-5 h-5 text-yellow-600" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">Signal Expert</h3>
                    <p className="text-xs text-yellow-100">Virtual Trading Assistant</p>
                  </div>
                </div>
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {loading && (
                  <div className="flex items-center justify-center py-6">
                    <div className="flex items-center space-x-3 text-gray-300">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-yellow-400"></div>
                      <span>Loading messages...</span>
                    </div>
                  </div>
                )}
                {messages.map((message) => {
                  const isUserMessage = message.sender.role === "USER"
                  return (
                    <motion.div
                      key={message.id}
                      className={`flex ${isUserMessage ? "justify-end" : "justify-start"} mb-3`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div
                        className={`max-w-xs px-4 py-3 rounded-2xl ${
                          isUserMessage
                            ? "bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-br-md"
                            : "bg-gray-800 text-gray-100 rounded-bl-md"
                        }`}
                      >
                        <p className="text-sm leading-relaxed">{message.content}</p>
                        <p className={`text-xs opacity-70 mt-1 ${isUserMessage ? "text-right" : "text-left"}`}>
                          {message.timestamp ? message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now'}
                        </p>
                      </div>
                    </motion.div>
                  )
                })}

                {/* Typing Indicator */}
                {isTyping && (
                  <motion.div
                    className="flex justify-start"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                  >
                    <div className="bg-gray-800 text-gray-100 px-4 py-2 rounded-2xl">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                      </div>
                    </div>
                  </motion.div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="p-4 border-t border-gray-700">
                <div className="flex space-x-2">
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message..."
                    className="flex-1 bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-yellow-400"
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                    className="btn-material px-3"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
