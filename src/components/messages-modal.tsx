"use client"

import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ConversationsList } from "@/components/conversations-list"
import { ChatInterface } from "@/components/chat-interface"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface MessagesModalProps {
  isOpen: boolean
  onClose: () => void
}

export function MessagesModal({ isOpen, onClose }: MessagesModalProps) {
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl w-[95vw] card-material max-h-[90vh] p-0 overflow-hidden flex flex-col">
        <DialogHeader className="p-6 border-b border-gray-700/50">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold text-white">
              Messages Inbox
            </DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </DialogHeader>
        
        <div className="flex flex-1 min-h-[320px] flex-col overflow-hidden lg:flex-row">
          {/* Conversations List */}
          <div className="w-full border-b border-gray-700/50 overflow-y-auto lg:w-1/3 lg:border-b-0 lg:border-r">
            <ConversationsList 
              onSelectConversation={setSelectedConversationId}
              selectedConversationId={selectedConversationId}
            />
          </div>
          
          {/* Chat Interface */}
          <div className="flex-1 overflow-y-auto">
            {selectedConversationId ? (
              <ChatInterface conversationId={selectedConversationId} />
            ) : (
              <div className="h-full flex items-center justify-center">
                <div className="text-center text-gray-300">
                  <p className="text-lg">Select a conversation to start chatting</p>
                  <p className="text-sm text-gray-400 mt-2">Choose a user conversation from the sidebar</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
