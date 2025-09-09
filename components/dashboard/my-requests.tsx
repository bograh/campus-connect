"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Package, MapPin, Clock, Search, Filter, Plus, MessageCircle, Eye } from "lucide-react"
import Link from "next/link"

export function MyRequests() {
  const [filter, setFilter] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")

  const requests = [
    {
      id: "REQ001",
      title: "Textbook Delivery",
      description: "Need someone to pick up my calculus textbook from the library and bring it to my dorm",
      from: "Main Library - 2nd Floor",
      to: "North Hall, Room 204",
      status: "pending",
      createdAt: "2024-01-20T10:30:00Z",
      budget: "$5",
      urgency: "medium",
      category: "Books",
      responses: 3,
    },
    {
      id: "REQ002",
      title: "Lunch Pickup",
      description: "Can someone grab my pre-ordered lunch from the cafeteria? I'm stuck in class.",
      from: "Campus Cafeteria",
      to: "Engineering Building, Room 301",
      status: "matched",
      createdAt: "2024-01-20T11:45:00Z",
      budget: "$3",
      urgency: "high",
      category: "Food",
      responses: 1,
      matchedWith: {
        name: "Sarah Johnson",
        avatar: "/student-sarah.jpg",
        rating: 4.9,
      },
    },
    {
      id: "REQ003",
      title: "Package from Mail Center",
      description: "Large package arrived at student mail center, need help carrying it to my apartment",
      from: "Student Mail Center",
      to: "Off-Campus Apartments, Building C",
      status: "in-progress",
      createdAt: "2024-01-19T14:20:00Z",
      budget: "$8",
      urgency: "low",
      category: "Package",
      responses: 1,
      matchedWith: {
        name: "Mike Chen",
        avatar: "/student-mike.jpg",
        rating: 4.7,
      },
    },
    {
      id: "REQ004",
      title: "Grocery Run",
      description: "Need someone to pick up groceries from the campus store",
      from: "Campus Store",
      to: "South Dorms, Room 156",
      status: "completed",
      createdAt: "2024-01-18T16:00:00Z",
      budget: "$6",
      urgency: "medium",
      category: "Groceries",
      responses: 2,
      completedAt: "2024-01-18T18:30:00Z",
      rating: 5,
    },
  ]

  const filteredRequests = requests.filter((request) => {
    const matchesFilter = filter === "all" || request.status === filter
    const matchesSearch =
      request.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "secondary"
      case "matched":
        return "default"
      case "in-progress":
        return "outline"
      case "completed":
        return "secondary"
      default:
        return "secondary"
    }
  }

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "high":
        return "text-red-600"
      case "medium":
        return "text-yellow-600"
      case "low":
        return "text-green-600"
      default:
        return "text-gray-600"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">My Requests</h1>
          <p className="text-muted-foreground">Manage your delivery requests and track their progress</p>
        </div>
        <Link href="/dashboard/requests/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Request
          </Button>
        </Link>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search requests..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Requests</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="matched">Matched</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Requests List */}
      <div className="space-y-4">
        {filteredRequests.map((request) => (
          <Card key={request.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-lg">{request.title}</CardTitle>
                    <Badge variant={getStatusColor(request.status)}>{request.status.replace("-", " ")}</Badge>
                    <Badge variant="outline" className={getUrgencyColor(request.urgency)}>
                      {request.urgency} priority
                    </Badge>
                  </div>
                  <CardDescription>{request.description}</CardDescription>
                </div>
                <div className="text-right">
                  <div className="text-lg font-semibold text-primary">{request.budget}</div>
                  <div className="text-sm text-muted-foreground">{request.category}</div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">From:</span> {request.from}
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">To:</span> {request.to}
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Posted:</span> {new Date(request.createdAt).toLocaleDateString()}
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Package className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Responses:</span> {request.responses}
                </div>
              </div>

              {request.matchedWith && (
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={request.matchedWith.avatar || "/placeholder.svg"}
                      alt={request.matchedWith.name}
                    />
                    <AvatarFallback>
                      {request.matchedWith.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="font-medium">{request.matchedWith.name}</div>
                    <div className="text-sm text-muted-foreground">Rating: {request.matchedWith.rating}/5.0</div>
                  </div>
                  <Button size="sm" variant="outline">
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Chat
                  </Button>
                </div>
              )}

              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Eye className="mr-2 h-4 w-4" />
                  View Details
                </Button>
                {request.status === "pending" && (
                  <Button variant="outline" size="sm">
                    Edit Request
                  </Button>
                )}
                {request.status === "completed" && request.rating && (
                  <Badge variant="outline" className="text-yellow-600">
                    Rated: {request.rating}/5 stars
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredRequests.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No requests found</h3>
            <p className="text-muted-foreground mb-4">
              {filter === "all"
                ? "You haven't created any delivery requests yet."
                : `No requests with status "${filter}" found.`}
            </p>
            <Link href="/dashboard/requests/new">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create Your First Request
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
