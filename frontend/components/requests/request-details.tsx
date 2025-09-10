"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  MapPin,
  Clock,
  Package,
  MessageCircle,
  Star,
  Shield,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Send,
} from "lucide-react"
import Link from "next/link"

interface RequestDetailsProps {
  requestId: string
}

export function RequestDetails({ requestId }: RequestDetailsProps) {
  const [isAccepting, setIsAccepting] = useState(false)
  const [showResponseForm, setShowResponseForm] = useState(false)
  const [responseMessage, setResponseMessage] = useState("")

  // Mock data - in real app, this would be fetched based on requestId
  const request = {
    id: requestId,
    title: "Coffee Shop Pickup",
    description:
      "Need someone to grab my pre-ordered coffee and pastry from the campus coffee shop. I have a back-to-back class schedule and can't make it there before they close the pre-order window. The order is already paid for, just need pickup and delivery.",
    from: "Campus Coffee Shop - Main Floor, Student Union",
    to: "Science Building, Room 301 (3rd Floor)",
    budget: "$4",
    urgency: "medium",
    category: "food-beverages",
    createdAt: "2024-01-21T09:15:00Z",
    deadline: "2024-01-21T11:00:00Z",
    specialInstructions:
      "Please ask for order under 'Emma Wilson'. The coffee shop is located on the main floor of the student union. I'll be in room 301 until 11:30 AM. Please text me when you're on your way up!",
    requester: {
      name: "Emma Wilson",
      avatar: "/student-emma.jpg",
      rating: 4.9,
      completedDeliveries: 23,
      isVerified: true,
      joinDate: "2023-08-15",
      bio: "Junior studying Biology. Always punctual and appreciative of help! I often need delivery assistance during my lab sessions.",
      responseTime: "Usually responds within 10 minutes",
    },
    responses: [
      {
        id: "RESP001",
        responder: {
          name: "Mike Chen",
          avatar: "/student-mike.jpg",
          rating: 4.7,
          completedDeliveries: 18,
        },
        message: "I can help with this! I'm heading to the student union anyway around 10:30 AM.",
        timestamp: "2024-01-21T09:25:00Z",
        status: "pending",
      },
      {
        id: "RESP002",
        responder: {
          name: "Sarah Johnson",
          avatar: "/student-sarah.jpg",
          rating: 4.9,
          completedDeliveries: 31,
        },
        message: "Available to help! I have experience with coffee shop pickups and I'm very reliable.",
        timestamp: "2024-01-21T09:35:00Z",
        status: "pending",
      },
    ],
    status: "pending",
  }

  const handleAcceptRequest = async () => {
    setIsAccepting(true)
    // Simulate API call
    setTimeout(() => {
      setIsAccepting(false)
      console.log("Request accepted:", requestId)
    }, 1000)
  }

  const handleSendResponse = async () => {
    if (!responseMessage.trim()) return

    console.log("Sending response:", responseMessage)
    setResponseMessage("")
    setShowResponseForm(false)
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
      <div className="flex items-center gap-4">
        <Link href="/dashboard/browse">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Browse
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Request Details</h1>
          <p className="text-muted-foreground">Review the request details and respond if interested</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Request Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Request Overview */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <CardTitle className="text-xl">{request.title}</CardTitle>
                    <Badge
                      variant={getUrgencyBadgeVariant(request.urgency)}
                      className={getUrgencyColor(request.urgency)}
                    >
                      {request.urgency} priority
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>Posted {new Date(request.createdAt).toLocaleDateString()}</span>
                    <span>•</span>
                    <span>{request.responses.length} responses</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-primary">{request.budget}</div>
                  <div className="text-sm text-muted-foreground">Budget</div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Description</h4>
                <p className="text-muted-foreground">{request.description}</p>
              </div>

              <Separator />

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-medium text-sm">Pickup Location</div>
                      <div className="text-sm text-muted-foreground">{request.from}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-medium text-sm">Delivery Location</div>
                      <div className="text-sm text-muted-foreground">{request.to}</div>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="font-medium text-sm">Deadline</div>
                      <div className="text-sm text-muted-foreground">{new Date(request.deadline).toLocaleString()}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="font-medium text-sm">Category</div>
                      <div className="text-sm text-muted-foreground">Food & Beverages</div>
                    </div>
                  </div>
                </div>
              </div>

              {request.specialInstructions && (
                <>
                  <Separator />
                  <div>
                    <h4 className="font-medium mb-2">Special Instructions</h4>
                    <p className="text-sm text-muted-foreground">{request.specialInstructions}</p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Existing Responses */}
          {request.responses.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Other Responses ({request.responses.length})</CardTitle>
                <CardDescription>See who else has responded to this request</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {request.responses.map((response) => (
                  <div key={response.id} className="flex gap-3 p-3 border rounded-lg">
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src={response.responder.avatar || "/placeholder.svg"}
                        alt={response.responder.name}
                      />
                      <AvatarFallback>
                        {response.responder.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">{response.responder.name}</span>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          {response.responder.rating}
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {response.responder.completedDeliveries} deliveries
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">{response.message}</p>
                      <div className="text-xs text-muted-foreground">
                        {new Date(response.timestamp).toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Requester Profile */}
          <Card>
            <CardHeader>
              <CardTitle>Requester Profile</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={request.requester.avatar || "/placeholder.svg"} alt={request.requester.name} />
                  <AvatarFallback>
                    {request.requester.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{request.requester.name}</span>
                    {request.requester.isVerified && <Shield className="h-4 w-4 text-primary" />}
                  </div>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    {request.requester.rating}/5.0 • {request.requester.completedDeliveries} deliveries
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <p className="text-muted-foreground">{request.requester.bio}</p>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  {request.requester.responseTime}
                </div>
                <div className="text-muted-foreground">
                  Member since {new Date(request.requester.joinDate).toLocaleDateString()}
                </div>
              </div>

              <Button variant="outline" className="w-full bg-transparent" asChild>
                <Link href={`/dashboard/messages/req-${request.id}`}>
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Message Requester
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Action Card */}
          <Card>
            <CardHeader>
              <CardTitle>Respond to Request</CardTitle>
              <CardDescription>Accept this request or send a message</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {!showResponseForm ? (
                <div className="space-y-3">
                  <Button className="w-full" onClick={handleAcceptRequest} disabled={isAccepting}>
                    {isAccepting ? "Accepting..." : "Accept Request"}
                  </Button>
                  <Button variant="outline" className="w-full bg-transparent" asChild>
                    <Link href={`/dashboard/messages/req-${request.id}`}>
                      <MessageCircle className="mr-2 h-4 w-4" />
                      Start Chat
                    </Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor="response">Your Response</Label>
                    <Textarea
                      id="response"
                      placeholder="Introduce yourself and explain why you're the right person for this delivery..."
                      value={responseMessage}
                      onChange={(e) => setResponseMessage(e.target.value)}
                      rows={4}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleSendResponse} disabled={!responseMessage.trim()} className="flex-1">
                      <Send className="mr-2 h-4 w-4" />
                      Send
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowResponseForm(false)
                        setResponseMessage("")
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}

              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-xs">
                  Only respond if you can complete this delivery safely and on time.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
