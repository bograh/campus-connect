"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, MapPin, Package, Car, MessageCircle, Star, CheckCircle, AlertCircle } from "lucide-react"
import Link from "next/link"
import { RatingDialog } from "./rating-dialog"

interface DeliveryDetailsProps {
  deliveryId: string
}

export function DeliveryDetails({ deliveryId }: DeliveryDetailsProps) {
  const [showRating, setShowRating] = useState(false)

  // Mock data - in real app, fetch based on deliveryId
  const delivery = {
    id: deliveryId,
    title: "Coffee Shop Pickup",
    type: "delivery" as const,
    status: "delivered" as const,
    progress: 100,
    partner: {
      name: "Sarah Johnson",
      avatar: "/student-avatar.png",
      rating: 4.8,
      completedDeliveries: 23,
    },
    locations: {
      pickup: "Campus Coffee Shop - Main Floor, Student Union",
      dropoff: "Science Building, Room 301 (3rd Floor)",
    },
    timeline: [
      {
        status: "matched",
        time: "10:30 AM",
        description: "Matched with Sarah Johnson",
        completed: true,
      },
      {
        status: "pickup",
        time: "1:45 PM",
        description: "Driver arrived at pickup location",
        completed: true,
      },
      {
        status: "in-transit",
        time: "2:00 PM",
        description: "Package picked up, en route to destination",
        completed: true,
      },
      {
        status: "delivered",
        time: "2:15 PM",
        description: "Package delivered successfully",
        completed: true,
      },
    ],
    payment: "$5.00",
    createdAt: "2024-01-21T10:30:00Z",
    completedAt: "2024-01-21T14:15:00Z",
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
      <div className="flex items-center gap-4">
        <Link href="/dashboard/tracking">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Tracking
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Delivery Details</h1>
          <p className="text-muted-foreground">Track your delivery progress</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Delivery Overview */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-xl">{delivery.title}</CardTitle>
                    <Badge variant="outline">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      {delivery.status}
                    </Badge>
                    {delivery.type === "delivery" ? (
                      <Package className="h-4 w-4 text-blue-500" />
                    ) : (
                      <Car className="h-4 w-4 text-green-500" />
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>Started {new Date(delivery.createdAt).toLocaleString()}</span>
                    {delivery.completedAt && (
                      <>
                        <span>•</span>
                        <span>Completed {new Date(delivery.completedAt).toLocaleString()}</span>
                      </>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-green-600">{delivery.payment}</div>
                  <div className="text-sm text-muted-foreground">Payment</div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Progress */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Delivery Progress</span>
                  <span>{delivery.progress}%</span>
                </div>
                <Progress value={delivery.progress} className="h-3" />
              </div>

              <Separator />

              {/* Locations */}
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div>
                    <div className="font-medium text-sm">Pickup Location</div>
                    <div className="text-sm text-muted-foreground">{delivery.locations.pickup}</div>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div>
                    <div className="font-medium text-sm">Drop-off Location</div>
                    <div className="text-sm text-muted-foreground">{delivery.locations.dropoff}</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>Delivery Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {delivery.timeline.map((event, index) => {
                  const StatusIcon = getStatusIcon(event.status)
                  return (
                    <div key={index} className="flex gap-4">
                      <div
                        className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                          event.completed ? "bg-green-100 text-green-600" : "bg-muted text-muted-foreground"
                        }`}
                      >
                        <StatusIcon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 pb-4">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">{event.description}</h4>
                          <span className="text-sm text-muted-foreground">{event.time}</span>
                        </div>
                        <Badge variant="outline" className="mt-1">
                          {event.status.replace("-", " ")}
                        </Badge>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Partner Profile */}
          <Card>
            <CardHeader>
              <CardTitle>Delivery Partner</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
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
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    {delivery.partner.rating}/5.0 • {delivery.partner.completedDeliveries} deliveries
                  </div>
                </div>
              </div>

              <Button variant="outline" className="w-full bg-transparent" asChild>
                <Link href={`/dashboard/messages/${delivery.type}-${delivery.id}`}>
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Message Partner
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Actions */}
          {delivery.status === "delivered" && (
            <Card>
              <CardHeader>
                <CardTitle>Rate Your Experience</CardTitle>
              </CardHeader>
              <CardContent>
                <Button className="w-full" onClick={() => setShowRating(true)}>
                  <Star className="mr-2 h-4 w-4" />
                  Rate Delivery Partner
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <RatingDialog
        open={showRating}
        onOpenChange={setShowRating}
        partnerName={delivery.partner.name}
        deliveryTitle={delivery.title}
      />
    </div>
  )
}
