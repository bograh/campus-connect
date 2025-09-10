"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { MapPin, Package, Car, Eye, MessageCircle, CheckCircle, AlertCircle } from "lucide-react"
import Link from "next/link"

interface ActiveDelivery {
  id: string
  title: string
  type: "delivery" | "trip"
  status: "matched" | "pickup" | "in-transit" | "delivered"
  progress: number
  estimatedTime: string
  partner: {
    name: string
    avatar: string
    rating: number
  }
  locations: {
    pickup: string
    dropoff: string
  }
  lastUpdate: string
}

const mockActiveDeliveries: ActiveDelivery[] = [
  {
    id: "DEL001",
    title: "Coffee Shop Pickup",
    type: "delivery",
    status: "pickup",
    progress: 25,
    estimatedTime: "15 mins",
    partner: {
      name: "Sarah Johnson",
      avatar: "/student-avatar.png",
      rating: 4.8,
    },
    locations: {
      pickup: "Campus Coffee Shop",
      dropoff: "Science Building, Room 301",
    },
    lastUpdate: "Driver arrived at pickup location",
  },
  {
    id: "TRIP001",
    title: "Campus to Downtown Trip",
    type: "trip",
    status: "in-transit",
    progress: 60,
    estimatedTime: "8 mins",
    partner: {
      name: "Mike Chen",
      avatar: "/student-avatar.png",
      rating: 4.9,
    },
    locations: {
      pickup: "Main Campus Gate",
      dropoff: "Downtown Shopping District",
    },
    lastUpdate: "En route to destination",
  },
  {
    id: "DEL002",
    title: "Textbook Delivery",
    type: "delivery",
    status: "delivered",
    progress: 100,
    estimatedTime: "Completed",
    partner: {
      name: "Emma Wilson",
      avatar: "/student-avatar.png",
      rating: 4.7,
    },
    locations: {
      pickup: "Main Library",
      dropoff: "North Hall, Room 204",
    },
    lastUpdate: "Package delivered successfully",
  },
]

export function DeliveryTracking() {
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all")

  const filteredDeliveries = mockActiveDeliveries.filter((delivery) => {
    if (filter === "active") return delivery.status !== "delivered"
    if (filter === "completed") return delivery.status === "delivered"
    return true
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "matched":
        return "secondary"
      case "pickup":
        return "default"
      case "in-transit":
        return "default"
      case "delivered":
        return "outline"
      default:
        return "secondary"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "matched":
        return AlertCircle
      case "pickup":
        return Package
      case "in-transit":
        return Car
      case "delivered":
        return CheckCircle
      default:
        return Package
    }
  }

  return (
    <div className="space-y-6">
      {/* Filter Buttons */}
      <div className="flex gap-2">
        <Button variant={filter === "all" ? "default" : "outline"} onClick={() => setFilter("all")}>
          All Deliveries
        </Button>
        <Button variant={filter === "active" ? "default" : "outline"} onClick={() => setFilter("active")}>
          Active ({mockActiveDeliveries.filter((d) => d.status !== "delivered").length})
        </Button>
        <Button variant={filter === "completed" ? "default" : "outline"} onClick={() => setFilter("completed")}>
          Completed ({mockActiveDeliveries.filter((d) => d.status === "delivered").length})
        </Button>
      </div>

      {/* Active Deliveries */}
      <div className="space-y-4">
        {filteredDeliveries.map((delivery) => {
          const StatusIcon = getStatusIcon(delivery.status)

          return (
            <Card key={delivery.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-lg">{delivery.title}</CardTitle>
                      <Badge variant={getStatusColor(delivery.status)}>
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {delivery.status.replace("-", " ")}
                      </Badge>
                      {delivery.type === "delivery" ? (
                        <Package className="h-4 w-4 text-blue-500" />
                      ) : (
                        <Car className="h-4 w-4 text-green-500" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{delivery.lastUpdate}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-semibold">{delivery.estimatedTime}</div>
                    <div className="text-sm text-muted-foreground">
                      {delivery.status === "delivered" ? "Completed" : "ETA"}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Progress Bar */}
                {delivery.status !== "delivered" && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{delivery.progress}%</span>
                    </div>
                    <Progress value={delivery.progress} className="h-2" />
                  </div>
                )}

                {/* Locations */}
                <div className="grid gap-3 md:grid-cols-2">
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="font-medium">Pickup</div>
                      <div className="text-muted-foreground">{delivery.locations.pickup}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="font-medium">Drop-off</div>
                      <div className="text-muted-foreground">{delivery.locations.dropoff}</div>
                    </div>
                  </div>
                </div>

                {/* Partner Info */}
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={delivery.partner.avatar || "/placeholder.svg"} />
                      <AvatarFallback>
                        {delivery.partner.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{delivery.partner.name}</div>
                      <div className="text-sm text-muted-foreground">Rating: {delivery.partner.rating}/5.0</div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" asChild>
                      <Link href={`/dashboard/messages/${delivery.type}-${delivery.id}`}>
                        <MessageCircle className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button size="sm" variant="outline" asChild>
                      <Link href={`/dashboard/tracking/${delivery.id}`}>
                        <Eye className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {filteredDeliveries.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No deliveries found</h3>
            <p className="text-muted-foreground">
              {filter === "active"
                ? "You don't have any active deliveries right now"
                : filter === "completed"
                  ? "No completed deliveries yet"
                  : "Start by creating a request or joining a trip"}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
