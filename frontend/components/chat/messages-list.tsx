"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, MessageCircle, Package, Car } from "lucide-react"
import Link from "next/link"

interface Conversation {
  id: string
  participant: {
    name: string
    avatar: string
    verified: boolean
    rating: number
  }
  lastMessage: {
    content: string
    timestamp: string
    unread: boolean
  }
  type: "delivery" | "trip"
  status: "active" | "completed" | "pending"
}

const mockConversations: Conversation[] = [
  {
    id: "1",
    participant: {
      name: "Sarah Johnson",
      avatar: "/student-avatar.png",
      verified: true,
      rating: 4.8,
    },
    lastMessage: {
      content: "Perfect! I'll be at the library entrance at 2 PM",
      timestamp: "2 min ago",
      unread: true,
    },
    type: "delivery",
    status: "active",
  },
  {
    id: "2",
    participant: {
      name: "Michael Chen",
      avatar: "/student-avatar.png",
      verified: true,
      rating: 4.9,
    },
    lastMessage: {
      content: "Thanks for the ride! Left a 5-star review",
      timestamp: "1 hour ago",
      unread: false,
    },
    type: "trip",
    status: "completed",
  },
  {
    id: "3",
    participant: {
      name: "Emma Wilson",
      avatar: "/student-avatar.png",
      verified: true,
      rating: 4.7,
    },
    lastMessage: {
      content: "Can you pick up the package from the bookstore?",
      timestamp: "3 hours ago",
      unread: true,
    },
    type: "delivery",
    status: "pending",
  },
]

export function MessagesList() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filter, setFilter] = useState<"all" | "delivery" | "trip">("all")

  const filteredConversations = mockConversations.filter((conv) => {
    const matchesSearch = conv.participant.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = filter === "all" || conv.type === filter
    return matchesSearch && matchesFilter
  })

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Button variant={filter === "all" ? "default" : "outline"} size="sm" onClick={() => setFilter("all")}>
            All
          </Button>
          <Button
            variant={filter === "delivery" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("delivery")}
          >
            <Package className="h-4 w-4 mr-1" />
            Deliveries
          </Button>
          <Button variant={filter === "trip" ? "default" : "outline"} size="sm" onClick={() => setFilter("trip")}>
            <Car className="h-4 w-4 mr-1" />
            Trips
          </Button>
        </div>
      </div>

      {/* Conversations List */}
      <div className="space-y-3">
        {filteredConversations.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <MessageCircle className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No conversations found</h3>
              <p className="text-muted-foreground text-center">
                {searchQuery
                  ? "Try adjusting your search terms"
                  : "Start connecting with other students to begin chatting"}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredConversations.map((conversation) => (
            <Link key={conversation.id} href={`/dashboard/messages/${conversation.id}`}>
              <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="relative">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={conversation.participant.avatar || "/placeholder.svg"} />
                        <AvatarFallback>
                          {conversation.participant.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      {conversation.participant.verified && (
                        <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1">
                          <div className="w-2 h-2 bg-white rounded-full" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold truncate">{conversation.participant.name}</h3>
                          <div className="flex items-center gap-1">
                            {conversation.type === "delivery" ? (
                              <Package className="h-4 w-4 text-blue-500" />
                            ) : (
                              <Car className="h-4 w-4 text-green-500" />
                            )}
                            <Badge
                              variant={
                                conversation.status === "active"
                                  ? "default"
                                  : conversation.status === "completed"
                                    ? "secondary"
                                    : "outline"
                              }
                            >
                              {conversation.status}
                            </Badge>
                          </div>
                        </div>
                        <span className="text-sm text-muted-foreground">{conversation.lastMessage.timestamp}</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <p
                          className={`text-sm truncate ${
                            conversation.lastMessage.unread ? "font-medium text-foreground" : "text-muted-foreground"
                          }`}
                        >
                          {conversation.lastMessage.content}
                        </p>
                        {conversation.lastMessage.unread && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full ml-2 flex-shrink-0" />
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))
        )}
      </div>
    </div>
  )
}
