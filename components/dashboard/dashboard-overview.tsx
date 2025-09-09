"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Package, Car, MessageCircle, Star, Clock, MapPin, Plus, TrendingUp, Shield } from "lucide-react"
import Link from "next/link"

export function DashboardOverview() {
  const stats = [
    {
      title: "Active Requests",
      value: "3",
      description: "Pending deliveries",
      icon: Package,
      color: "text-blue-600",
    },
    {
      title: "Completed Trips",
      value: "12",
      description: "This month",
      icon: Car,
      color: "text-green-600",
    },
    {
      title: "Messages",
      value: "5",
      description: "Unread",
      icon: MessageCircle,
      color: "text-orange-600",
    },
    {
      title: "Rating",
      value: "4.8",
      description: "Average rating",
      icon: Star,
      color: "text-yellow-600",
    },
  ]

  const recentRequests = [
    {
      id: "REQ001",
      title: "Textbook Delivery",
      from: "Library",
      to: "Dorm Room 204",
      status: "pending",
      time: "2 hours ago",
      requester: "Sarah Johnson",
    },
    {
      id: "REQ002",
      title: "Lunch Pickup",
      from: "Campus Cafeteria",
      to: "Engineering Building",
      status: "matched",
      time: "4 hours ago",
      requester: "Mike Chen",
    },
    {
      id: "REQ003",
      title: "Package from Mail Center",
      from: "Student Mail Center",
      to: "Apartment Complex",
      status: "in-progress",
      time: "1 day ago",
      requester: "Emma Davis",
    },
  ]

  const upcomingTrips = [
    {
      id: "TRIP001",
      route: "Campus → Downtown",
      time: "Today, 3:00 PM",
      capacity: "2/4 items",
      earnings: "$15",
    },
    {
      id: "TRIP002",
      route: "Library → Dorms",
      time: "Tomorrow, 10:00 AM",
      capacity: "1/3 items",
      earnings: "$8",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Welcome back, John!</h1>
          <p className="text-muted-foreground">Here's what's happening with your deliveries today.</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="gap-1">
            <Shield className="h-3 w-3" />
            Verified Student
          </Badge>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Get started with your next delivery or trip</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <Link href="/dashboard/requests/new">
              <Button className="w-full h-20 flex-col gap-2">
                <Plus className="h-6 w-6" />
                Post New Request
              </Button>
            </Link>
            <Link href="/dashboard/trips/new">
              <Button variant="outline" className="w-full h-20 flex-col gap-2 bg-transparent">
                <Car className="h-6 w-6" />
                Share a Trip
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Requests */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Requests</CardTitle>
            <CardDescription>Your latest delivery requests</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentRequests.map((request) => (
              <div key={request.id} className="flex items-center gap-4 p-3 border rounded-lg">
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium">{request.title}</h4>
                    <Badge
                      variant={
                        request.status === "pending"
                          ? "secondary"
                          : request.status === "matched"
                            ? "default"
                            : "outline"
                      }
                    >
                      {request.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    {request.from} → {request.to}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {request.time} • by {request.requester}
                  </div>
                </div>
              </div>
            ))}
            <Link href="/dashboard/requests">
              <Button variant="ghost" className="w-full">
                View All Requests
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Upcoming Trips */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Trips</CardTitle>
            <CardDescription>Your scheduled delivery trips</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingTrips.map((trip) => (
              <div key={trip.id} className="flex items-center gap-4 p-3 border rounded-lg">
                <div className="flex-1 space-y-1">
                  <h4 className="font-medium">{trip.route}</h4>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {trip.time}
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Capacity: {trip.capacity}</span>
                    <span className="font-medium text-green-600">{trip.earnings}</span>
                  </div>
                </div>
              </div>
            ))}
            <Link href="/dashboard/trips">
              <Button variant="ghost" className="w-full">
                View All Trips
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Performance Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            This Month's Performance
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Deliveries Completed</span>
                <span>12/15</span>
              </div>
              <Progress value={80} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>On-Time Rate</span>
                <span>95%</span>
              </div>
              <Progress value={95} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Customer Rating</span>
                <span>4.8/5.0</span>
              </div>
              <Progress value={96} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
