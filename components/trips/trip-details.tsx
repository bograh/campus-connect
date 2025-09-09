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
  Car,
  Users,
  MessageCircle,
  Star,
  Shield,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Calendar,
} from "lucide-react"
import Link from "next/link"

interface TripDetailsProps {
  tripId: string
}

export function TripDetails({ tripId }: TripDetailsProps) {
  const [isJoining, setIsJoining] = useState(false)
  const [showJoinForm, setShowJoinForm] = useState(false)
  const [joinMessage, setJoinMessage] = useState("")

  // Mock data - in real app, this would be fetched based on tripId
  const trip = {
    id: tripId,
    title: "Campus to Downtown Mall",
    description:
      "Regular shopping trip to downtown mall every weekend. I have a reliable car with plenty of space for packages. I'm familiar with the area and can handle multiple stops if needed. Perfect for students who need items delivered from downtown stores.",
    from: "Main Campus - Student Union Parking Lot",
    to: "Downtown Shopping Mall - Main Entrance",
    departureDate: "2024-01-22",
    departureTime: "14:00",
    returnDate: "2024-01-22",
    returnTime: "18:00",
    vehicleType: "car",
    capacity: 4,
    availableSpots: 2,
    pricePerItem: "$5",
    acceptedCategories: ["clothing", "electronics", "books-supplies"],
    isRecurring: true,
    recurringDays: ["saturday", "sunday"],
    specialRequirements:
      "Please be ready 10 minutes before departure time. Cash payment preferred. I can wait up to 5 minutes at pickup locations. No fragile electronics without proper packaging.",
    driver: {
      name: "Alex Johnson",
      avatar: "/student-alex-studying.png",
      rating: 4.8,
      completedTrips: 15,
      isVerified: true,
      joinDate: "2023-09-10",
      bio: "Senior studying Business Administration. I love helping fellow students and have been doing regular trips to downtown for over a year. Very punctual and reliable!",
      responseTime: "Usually responds within 15 minutes",
      vehicleInfo: "2020 Honda Civic - Blue, License: ABC123",
    },
    joinedStudents: [
      {
        id: "JOIN001",
        student: {
          name: "Sarah Wilson",
          avatar: "/student-sarah-w.jpg",
          rating: 4.9,
        },
        joinedAt: "2024-01-21T10:30:00Z",
        itemsCount: 2,
        message: "Need to pick up some clothes from the mall. Thanks for offering this trip!",
      },
      {
        id: "JOIN002",
        student: {
          name: "Mike Chen",
          avatar: "/student-mike.jpg",
          rating: 4.7,
        },
        joinedAt: "2024-01-21T14:15:00Z",
        itemsCount: 1,
        message: "Just one small electronics item from Best Buy. Will be ready on time!",
      },
    ],
    status: "scheduled",
    createdAt: "2024-01-20T09:00:00Z",
  }

  const handleJoinTrip = async () => {
    setIsJoining(true)
    // Simulate API call
    setTimeout(() => {
      setIsJoining(false)
      console.log("Joined trip:", tripId, "Message:", joinMessage)
      setShowJoinForm(false)
      setJoinMessage("")
    }, 1000)
  }

  const getVehicleIcon = (vehicleType: string) => {
    return <Car className="h-4 w-4" />
  }

  const getVehicleLabel = (vehicleType: string) => {
    switch (vehicleType) {
      case "car":
        return "Car"
      case "suv":
        return "SUV"
      case "truck":
        return "Pickup Truck"
      case "bike":
        return "Bicycle"
      case "walking":
        return "Walking"
      default:
        return vehicleType
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/browse-trips">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Browse
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Trip Details</h1>
          <p className="text-muted-foreground">Review the trip details and join if interested</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Trip Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Trip Overview */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <CardTitle className="text-xl">{trip.title}</CardTitle>
                    <Badge variant="outline" className="gap-1">
                      {getVehicleIcon(trip.vehicleType)}
                      {getVehicleLabel(trip.vehicleType)}
                    </Badge>
                    {trip.isRecurring && <Badge variant="secondary">Recurring</Badge>}
                    {trip.availableSpots > 0 ? (
                      <Badge variant="default">Available</Badge>
                    ) : (
                      <Badge variant="outline">Full</Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>Posted {new Date(trip.createdAt).toLocaleDateString()}</span>
                    <span>•</span>
                    <span>{trip.capacity - trip.availableSpots} joined</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-primary">{trip.pricePerItem}</div>
                  <div className="text-sm text-muted-foreground">per item</div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Description</h4>
                <p className="text-muted-foreground">{trip.description}</p>
              </div>

              <Separator />

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-medium text-sm">Starting Point</div>
                      <div className="text-sm text-muted-foreground">{trip.from}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-medium text-sm">Destination</div>
                      <div className="text-sm text-muted-foreground">{trip.to}</div>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="font-medium text-sm">Date</div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(trip.departureDate).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="font-medium text-sm">Departure Time</div>
                      <div className="text-sm text-muted-foreground">{trip.departureTime}</div>
                    </div>
                  </div>
                  {trip.returnTime && (
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <div className="font-medium text-sm">Return Time</div>
                        <div className="text-sm text-muted-foreground">{trip.returnTime}</div>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="font-medium text-sm">Capacity</div>
                      <div className="text-sm text-muted-foreground">
                        {trip.availableSpots}/{trip.capacity} spots available
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <h4 className="font-medium">Accepted Item Categories</h4>
                <div className="flex flex-wrap gap-1">
                  {trip.acceptedCategories.map((category) => (
                    <Badge key={category} variant="outline" className="text-xs">
                      {category.replace("-", " ")}
                    </Badge>
                  ))}
                </div>
              </div>

              {trip.isRecurring && (
                <>
                  <Separator />
                  <div className="space-y-2">
                    <h4 className="font-medium">Recurring Schedule</h4>
                    <div className="flex flex-wrap gap-1">
                      {trip.recurringDays.map((day) => (
                        <Badge key={day} variant="secondary" className="text-xs capitalize">
                          {day}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {trip.specialRequirements && (
                <>
                  <Separator />
                  <div>
                    <h4 className="font-medium mb-2">Special Requirements</h4>
                    <p className="text-sm text-muted-foreground">{trip.specialRequirements}</p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Joined Students */}
          {trip.joinedStudents.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Joined Students ({trip.joinedStudents.length})</CardTitle>
                <CardDescription>Other students who have joined this trip</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {trip.joinedStudents.map((join) => (
                  <div key={join.id} className="flex gap-3 p-3 border rounded-lg">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={join.student.avatar || "/placeholder.svg"} alt={join.student.name} />
                      <AvatarFallback>
                        {join.student.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">{join.student.name}</span>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          {join.student.rating}
                        </div>
                        <span className="text-xs text-muted-foreground">{join.itemsCount} items</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{join.message}</p>
                      <div className="text-xs text-muted-foreground">
                        Joined {new Date(join.joinedAt).toLocaleString()}
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
          {/* Driver Profile */}
          <Card>
            <CardHeader>
              <CardTitle>Driver Profile</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={trip.driver.avatar || "/placeholder.svg"} alt={trip.driver.name} />
                  <AvatarFallback>
                    {trip.driver.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{trip.driver.name}</span>
                    {trip.driver.isVerified && <Shield className="h-4 w-4 text-primary" />}
                  </div>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    {trip.driver.rating}/5.0 • {trip.driver.completedTrips} trips
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <p className="text-muted-foreground">{trip.driver.bio}</p>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  {trip.driver.responseTime}
                </div>
                <div className="text-muted-foreground">
                  Member since {new Date(trip.driver.joinDate).toLocaleDateString()}
                </div>
                <div className="text-muted-foreground">Vehicle: {trip.driver.vehicleInfo}</div>
              </div>

              <Button variant="outline" className="w-full bg-transparent">
                <MessageCircle className="mr-2 h-4 w-4" />
                Message Driver
              </Button>
            </CardContent>
          </Card>

          {/* Join Trip Card */}
          <Card>
            <CardHeader>
              <CardTitle>Join This Trip</CardTitle>
              <CardDescription>Reserve your spot on this trip</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {!showJoinForm ? (
                <div className="space-y-3">
                  <Button className="w-full" onClick={() => setShowJoinForm(true)} disabled={trip.availableSpots === 0}>
                    {trip.availableSpots > 0 ? "Join Trip" : "Trip Full"}
                  </Button>
                  <div className="text-center text-sm text-muted-foreground">
                    {trip.availableSpots} of {trip.capacity} spots available
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor="joinMessage">Message to Driver</Label>
                    <Textarea
                      id="joinMessage"
                      placeholder="Tell the driver about your delivery needs, pickup details, etc..."
                      value={joinMessage}
                      onChange={(e) => setJoinMessage(e.target.value)}
                      rows={4}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleJoinTrip} disabled={isJoining} className="flex-1">
                      {isJoining ? "Joining..." : "Confirm Join"}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowJoinForm(false)
                        setJoinMessage("")
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
                  Make sure you can meet the driver at the specified time and location.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
