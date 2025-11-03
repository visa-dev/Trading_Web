"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageSquare, Users, Clock, TrendingUp } from "lucide-react"

interface ChatStats {
  totalConversations: number
  activeConversations: number
  totalMessages: number
  avgResponseTime: number
}

export function ChatStats() {
  const [stats, setStats] = useState<ChatStats>({
    totalConversations: 0,
    activeConversations: 0,
    totalMessages: 0,
    avgResponseTime: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/dashboard/stats')
      if (response.ok) {
        const data = await response.json()
        setStats(data.chatStats || stats)
      }
    } catch (error) {
      console.error('Error fetching chat stats:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="card-material">
            <CardContent className="p-4">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
                <div className="h-6 bg-gray-700 rounded w-1/2"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <Card className="card-material">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Total Conversations</p>
              <p className="text-2xl font-bold text-white">{stats.totalConversations}</p>
            </div>
            <MessageSquare className="w-8 h-8 text-blue-400" />
          </div>
        </CardContent>
      </Card>

      <Card className="card-material">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Active Chats</p>
              <p className="text-2xl font-bold text-white">{stats.activeConversations}</p>
            </div>
            <Users className="w-8 h-8 text-green-400" />
          </div>
        </CardContent>
      </Card>

      <Card className="card-material">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Total Messages</p>
              <p className="text-2xl font-bold text-white">{stats.totalMessages}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-yellow-400" />
          </div>
        </CardContent>
      </Card>

      <Card className="card-material">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Avg Response Time</p>
              <p className="text-2xl font-bold text-white">{stats.avgResponseTime}m</p>
            </div>
            <Clock className="w-8 h-8 text-purple-400" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
