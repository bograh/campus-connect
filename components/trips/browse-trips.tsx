"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MapPin, Clock, Search, Filter, Car, Users, Star, Shield, Calendar, Plus } from "lucide-react"
import Link from "next/link"

export function BrowseTrips() {
  const [filter, setFilter] = useState("all")
  const [vehicleFilter, setVehicleFilter] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")

  const availableTrips = [
    {
      id: "TRIP201",
      title: "Campus to Downtown Mall",
      description: "Regular shopping trip to downtown mall, can handle small to medium packages",
      from: "Main Campus - Student Union",
      to: "Downtown Shopping Mall",
      departureDate: "2024-01-22",
      departureTime: "14:00",
      returnDate: "2024-01-22",
      returnTime: "18:00",
      vehicleType: "car",
      capacity: 4,
      availableSpots: 2,
      pricePerItem: "$5",
      acceptedCategories: ["clothing", "electronics", "books-supplies"],
      isRecurring: false,
      driver: {
        name: "Alex Johnson",
        avatar: "/student-alex-studying.png",
        rating: 4.8,
        completedTrips: 15,
        isVerified: true,
      },
      createdAt: "2024-01-21T10:00:00Z",
    },
    {
      id: "TRIP202",
      title: "Library to Dorms Route",
      description: "Daily evening route from library to dormitory area, perfect for book deliveries",
      from: "Main Library",
      to: "North & South Dorms",
      departureDate: "2024-01-22",
      departureTime: "20:00",
      vehicleType: "bike",
      capacity: 3,
      availableSpots: 3,
      pricePerItem: "$2",
      acceptedCategories: ["books-supplies", "documents", "food-beverages"],
      isRecurring: true,
      recurringDays: ["monday", "tuesday", "wednesday", "thursday", "friday"],
      driver: {
        name: "Sarah Martinez",
        avatar: "/student-sarah-w.jpg",
        rating: 4.9,
        completedTrips: 28,
        isVerified: true,
      },
      createdAt: "2024-01-20T15:30:00Z",
    },
    {
      id: "TRIP203",
      title: "Grocery Run to Supermarket",
      description: "Weekly grocery trip, can handle large packages and multiple bags",
      from: "Campus Parking Lot B",
      to: "MegaMart Supermarket",
      departureDate: "2024-01-23",
      departureTime: "10:00",
      returnDate: "2024-01-23",
      returnTime: "12:00",
      vehicleType: "suv",
      capacity: 6,
      availableSpots: 4,
      pricePerItem: "$8",
      acceptedCategories: ["groceries", "packages-mail"],
      isRecurring: true,
      recurringDays: ["saturday"],
      driver: {
        name: "Mike Thompson",
        avatar: "/student-mike-b.jpg",
        rating: 4.7,
        completedTrips: 22,
        isVerified: true,
      },
      createdAt: "2024-01-19T12:15:00Z",
    },
    {
      id: "TRIP204",
      title: "Airport Shuttle Service",
      description: "Trip to airport for holiday break, can take packages for students flying home",
      from: "Main Campus",
      to: "City Airport",
      departureDate: "2024-01-25",
      departureTime: "08:00",
      vehicleType: "car",
      capacity: 3,
      availableSpots: 1,
      pricePerItem: "$15",
      acceptedCategories: ["packages-mail", "clothing"],
      isRecurring: false,
      driver: {
        name: "Emma Davis",
        avatar: "/student-emma.jpg",
        rating: 5.0,
        completedTrips: 12,
        isVerified: true,
      },
      createdAt: "2024-01-18T09:45:00Z",
    },
  ]

  const vehicleTypes = [
    { value: "all", label: "All Vehicles" },
    { value: "car", label: "Car" },
    { value: "suv", label: "SUV" },
    { value: "truck", label: "Pickup Truck" },
    { value: "bike", label: "Bicycle" },
    { value: "walking", label: "Walking" },
  ]

  const filteredTrips = availableTrips.filter((trip) => {
    const matchesSearch =
      trip.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.from.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.to.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesVehicle = vehicleFilter === "all" || trip.vehicleType === vehicleFilter
    const matchesAvailability = filter === "all" || (filter === "available" && trip.availableSpots > 0)
    return matchesSearch && matchesVehicle && matchesAvailability
  })

  const getVehicleIcon = (vehicleType: string) => {
    switch (vehicleType) {
      case "car":
      case "suv":
      case "truck":
        return <Car className="h-4 w-4" />
      default:
        return <Car className="h-4 w-4" />
    }
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Browse Trips</h1>
          <p className="text-muted-foreground">Find trips from verified students and join their routes</p>
        </div>
        <Link href="/dashboard/trips/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Share Trip
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
                placeholder="Search trips by route, destination..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={vehicleFilter} onValueChange={setVehicleFilter}>
              <SelectTrigger className="w-full lg:w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {vehicleTypes.map((vehicle) => (
                  <SelectItem key={vehicle.value} value={vehicle.value}>
                    {vehicle.label}
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
                <SelectItem value="all">All Trips</SelectItem>
                <SelectItem value="available">Available Spots</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Trips List */}
      <div className="space-y-4">
        {filteredTrips.map((trip) => (
          <Card key={trip.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <CardTitle className="text-lg">{trip.title}</CardTitle>
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
                  <CardDescription className="text-sm">{trip.description}</CardDescription>
                </div>
                <div className="text-right ml-4">
                  <div className="text-xl font-bold text-primary">{trip.pricePerItem}</div>
                  <div className="text-xs text-muted-foreground">per item</div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-3 md:grid-cols-2">
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <span className="font-medium">From:</span>
                  <span className="truncate">{trip.from}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <span className="font-medium">To:</span>
                  <span className="truncate">{trip.to}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Date:</span>
                  <span>{new Date(trip.departureDate).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Departure:</span>
                  <span>{trip.departureTime}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Capacity:</span>
                  <span>
                    {trip.availableSpots}/{trip.capacity} spots available
                  </span>
                </div>
                {trip.returnTime && (
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Return:</span>
                    <span>{trip.returnTime}</span>
                  </div>
                )}
              </div>

              {/* Accepted Categories */}
              <div className="space-y-2">
                <span className="text-sm font-medium">Accepted Items:</span>
                <div className="flex flex-wrap gap-1">
                  {trip.acceptedCategories.map((category) => (
                    <Badge key={category} variant="outline" className="text-xs">
                      {category.replace("-", " ")}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Driver Info */}
              <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={trip.driver.avatar || "/placeholder.svg"} alt={trip.driver.name} />
                  <AvatarFallback>
                    {trip.driver.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{trip.driver.name}</span>
                    {trip.driver.isVerified && <Shield className="h-4 w-4 text-primary" />}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      {trip.driver.rating}/5.0
                    </div>
                    <span>{trip.driver.completedTrips} trips</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Link href={`/dashboard/trips/${trip.id}`} className="flex-1">
                  <Button className="w-full" disabled={trip.availableSpots === 0}>
                    {trip.availableSpots > 0 ? "Join Trip" : "Trip Full"}
                  </Button>
                </Link>
                <Button variant="outline" size="sm">
                  View Details
                </Button>
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
              No trips match your current filters. Try adjusting your search criteria.
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery("")
                setFilter("all")
                setVehicleFilter("all")
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
