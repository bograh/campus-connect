"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MapPin, Clock, Search, Filter, Package, MessageCircle, Star, Shield } from "lucide-react"
import Link from "next/link"

export function BrowseRequests() {
  const [filter, setFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")

  const availableRequests = [
    {
      id: "REQ101",
      title: "Coffee Shop Pickup",
      description: "Need someone to grab my pre-ordered coffee and pastry from the campus coffee shop",
      from: "Campus Coffee Shop",
      to: "Science Building, Room 301",
      budget: "$4",
      urgency: "medium",
      category: "food-beverages",
      createdAt: "2024-01-21T09:15:00Z",
      deadline: "2024-01-21T11:00:00Z",
      requester: {
        name: "Emma Wilson",
        avatar: "/student-emma.jpg",
        rating: 4.9,
        completedDeliveries: 23,
        isVerified: true,
      },
      responses: 2,
    },
    {
      id: "REQ102",
      title: "Textbook Return",
      description: "Help me return these heavy textbooks to the library before the due date",
      from: "Engineering Dorms, Building A",
      to: "Main Library - Returns Desk",
      budget: "$6",
      urgency: "high",
      category: "books-supplies",
      createdAt: "2024-01-21T08:30:00Z",
      deadline: "2024-01-21T17:00:00Z",
      requester: {
        name: "Alex Thompson",
        avatar: "/student-alex-studying.png",
        rating: 4.7,
        completedDeliveries: 15,
        isVerified: true,
      },
      responses: 1,
    },
    {
      id: "REQ103",
      title: "Grocery Delivery",
      description: "Small grocery run from campus store - just a few items, can provide shopping list",
      from: "Campus Store",
      to: "South Dorms, Room 412",
      budget: "$8",
      urgency: "low",
      category: "groceries",
      createdAt: "2024-01-21T07:45:00Z",
      deadline: "2024-01-22T12:00:00Z",
      requester: {
        name: "Sarah Martinez",
        avatar: "/student-sarah-w.jpg",
        rating: 5.0,
        completedDeliveries: 31,
        isVerified: true,
      },
      responses: 4,
    },
    {
      id: "REQ104",
      title: "Package Pickup",
      description: "Large package arrived at mail center, need help carrying it to my apartment off-campus",
      from: "Student Mail Center",
      to: "University Apartments, Building C",
      budget: "$10",
      urgency: "medium",
      category: "packages-mail",
      createdAt: "2024-01-20T16:20:00Z",
      deadline: "2024-01-23T18:00:00Z",
      requester: {
        name: "Jordan Kim",
        avatar: "/placeholder.svg?height=40&width=40&text=JK",
        rating: 4.6,
        completedDeliveries: 8,
        isVerified: true,
      },
      responses: 0,
    },
  ]

  const categories = [
    { value: "all", label: "All Categories" },
    { value: "food-beverages", label: "Food & Beverages" },
    { value: "books-supplies", label: "Books & Supplies" },
    { value: "packages-mail", label: "Packages & Mail" },
    { value: "groceries", label: "Groceries" },
    { value: "electronics", label: "Electronics" },
    { value: "other", label: "Other" },
  ]

  const filteredRequests = availableRequests.filter((request) => {
    const matchesSearch =
      request.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = categoryFilter === "all" || request.category === categoryFilter
    const matchesUrgency = filter === "all" || request.urgency === filter
    return matchesSearch && matchesCategory && matchesUrgency
  })

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

  const getUrgencyBadgeVariant = (urgency: string) => {
    switch (urgency) {
      case "high":
        return "destructive"
      case "medium":
        return "secondary"
      case "low":
        return "outline"
      default:
        return "secondary"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Browse Requests</h1>
          <p className="text-muted-foreground">Find delivery requests from verified students in your area</p>
        </div>
        <Link href="/dashboard/requests/new">
          <Button>
            <Package className="mr-2 h-4 w-4" />
            Post Request
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search requests..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full lg:w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-full lg:w-48">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Urgency</SelectItem>
                <SelectItem value="high">High Priority</SelectItem>
                <SelectItem value="medium">Medium Priority</SelectItem>
                <SelectItem value="low">Low Priority</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Requests List */}
      <div className="space-y-4">
        {filteredRequests.map((request) => (
          <Card key={request.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <CardTitle className="text-lg">{request.title}</CardTitle>
                    <Badge
                      variant={getUrgencyBadgeVariant(request.urgency)}
                      className={getUrgencyColor(request.urgency)}
                    >
                      {request.urgency} priority
                    </Badge>
                    <Badge variant="outline">
                      {categories.find((c) => c.value === request.category)?.label || request.category}
                    </Badge>
                  </div>
                  <CardDescription className="text-sm">{request.description}</CardDescription>
                </div>
                <div className="text-right ml-4">
                  <div className="text-xl font-bold text-primary">{request.budget}</div>
                  <div className="text-xs text-muted-foreground">{request.responses} responses</div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-3 md:grid-cols-2">
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <span className="font-medium">From:</span>
                  <span className="truncate">{request.from}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <span className="font-medium">To:</span>
                  <span className="truncate">{request.to}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Posted:</span>
                  <span>{new Date(request.createdAt).toLocaleDateString()}</span>
                </div>
                {request.deadline && (
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Deadline:</span>
                    <span>{new Date(request.deadline).toLocaleString()}</span>
                  </div>
                )}
              </div>

              {/* Requester Info */}
              <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={request.requester.avatar || "/placeholder.svg"} alt={request.requester.name} />
                  <AvatarFallback>
                    {request.requester.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{request.requester.name}</span>
                    {request.requester.isVerified && <Shield className="h-4 w-4 text-primary" />}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      {request.requester.rating}/5.0
                    </div>
                    <span>{request.requester.completedDeliveries} deliveries</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Link href={`/dashboard/requests/${request.id}`} className="flex-1">
                  <Button className="w-full">Accept Request</Button>
                </Link>
                <Button variant="outline" size="sm">
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Message
                </Button>
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
              No delivery requests match your current filters. Try adjusting your search criteria.
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery("")
                setFilter("all")
                setCategoryFilter("all")
              }}
            >
              Clear Filters
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
