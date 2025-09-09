"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Car, MapPin, Clock, DollarSign, Search, Filter, Plus, Users, Eye } from "lucide-react"
import Link from "next/link"

export function MyTrips() {
  const [filter, setFilter] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")

  const trips = [
    {
      id: "TRIP001",
      title: "Campus to Downtown",
      description: "Regular trip to downtown area, can carry small packages",
      route: "Main Campus → Downtown Shopping District",
      departureTime: "2024-01-21T15:00:00Z",
      status: "scheduled",
      capacity: "2/4 items",
      earnings: "$15",
      requests: [
        {
          id: "REQ005",
          title: "Coffee Shop Pickup",
          requester: "Emma Davis",
          avatar: "/student-emma.jpg",
          payment: "$5",
        },
        {
          id: "REQ006",
          title: "Book Return",
          requester: "Alex Johnson",
          avatar: "/student-alex-studying.png",
          payment: "$3",
        },
      ],
    },
    {
      id: "TRIP002",
      title: "Library to Dorms",
      description: "Evening trip from library to dormitory area",
      route: "Main Library → North & South Dorms",
      departureTime: "2024-01-22T10:00:00Z",
      status: "active",
      capacity: "1/3 items",
      earnings: "$8",
      requests: [
        {
          id: "REQ007",
          title: "Textbook Delivery",
          requester: "Sarah Wilson",
          avatar: "/student-sarah-w.jpg",
          payment: "$8",
        },
      ],
    },
    {
      id: "TRIP003",
      title: "Cafeteria Run",
      description: "Quick lunch delivery from cafeteria to various buildings",
      route: "Campus Cafeteria → Engineering & Science Buildings",
      departureTime: "2024-01-20T12:30:00Z",
      status: "completed",
      capacity: "3/3 items",
      earnings: "$18",
      completedAt: "2024-01-20T13:15:00Z",
      rating: 4.9,
      requests: [
        {
          id: "REQ008",
          title: "Lunch Delivery",
          requester: "Mike Brown",
          avatar: "/student-mike-b.jpg",
          payment: "$6",
        },
        {
          id: "REQ009",
          title: "Sandwich Pickup",
          requester: "Lisa Chen",
          avatar: "/student-lisa.jpg",
          payment: "$4",
        },
        {
          id: "REQ010",
          title: "Salad Delivery",
          requester: "Tom Davis",
          avatar: "/student-tom.jpg",
          payment: "$8",
        },
      ],
    },
  ]

  const filteredTrips = trips.filter((trip) => {
    const matchesFilter = filter === "all" || trip.status === filter
    const matchesSearch =
      trip.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled":
        return "secondary"
      case "active":
        return "default"
      case "completed":
        return "outline"
      default:
        return "secondary"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">My Trips</h1>
          <p className="text-muted-foreground">Manage your delivery trips and track earnings</p>
        </div>
        <Link href="/dashboard/trips/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Trip
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
                placeholder="Search trips..."
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
                <SelectItem value="all">All Trips</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Trips List */}
      <div className="space-y-4">
        {filteredTrips.map((trip) => (
          <Card key={trip.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-lg">{trip.title}</CardTitle>
                    <Badge variant={getStatusColor(trip.status)}>{trip.status}</Badge>
                  </div>
                  <CardDescription>{trip.description}</CardDescription>
                </div>
                <div className="text-right">
                  <div className="text-lg font-semibold text-green-600">{trip.earnings}</div>
                  <div className="text-sm text-muted-foreground">{trip.capacity}</div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Route:</span> {trip.route}
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{trip.status === "completed" ? "Completed:" : "Departure:"}</span>
                  {new Date(trip.status === "completed" ? trip.completedAt! : trip.departureTime).toLocaleString()}
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Requests:</span> {trip.requests.length}
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Total Earnings:</span> {trip.earnings}
                </div>
              </div>

              {trip.requests.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Delivery Requests:</h4>
                  <div className="space-y-2">
                    {trip.requests.map((request) => (
                      <div key={request.id} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={request.avatar || "/placeholder.svg"} alt={request.requester} />
                          <AvatarFallback>
                            {request.requester
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="font-medium text-sm">{request.title}</div>
                          <div className="text-xs text-muted-foreground">by {request.requester}</div>
                        </div>
                        <div className="text-sm font-medium text-green-600">{request.payment}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Eye className="mr-2 h-4 w-4" />
                  View Details
                </Button>
                {trip.status === "scheduled" && (
                  <Button variant="outline" size="sm">
                    Edit Trip
                  </Button>
                )}
                {trip.status === "completed" && trip.rating && (
                  <Badge variant="outline" className="text-yellow-600">
                    Rated: {trip.rating}/5 stars
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredTrips.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Car className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No trips found</h3>
            <p className="text-muted-foreground mb-4">
              {filter === "all"
                ? "You haven't created any delivery trips yet."
                : `No trips with status "${filter}" found.`}
            </p>
            <Link href="/dashboard/trips/new">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create Your First Trip
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
