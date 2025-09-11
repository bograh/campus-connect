"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
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
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { useTrip } from "@/lib/hooks/useTrips";
import { handleApiError } from "@/lib/api/client";
import { TRIP_STATUS } from "@/lib/constants/api";

interface TripDetailsProps {
  tripId: string;
}

export function TripDetails({ tripId }: TripDetailsProps) {
  const [isJoining, setIsJoining] = useState(false);
  const [showJoinForm, setShowJoinForm] = useState(false);
  const [joinMessage, setJoinMessage] = useState("");

  // Fetch real data from API
  const { trip, loading, error, refresh } = useTrip({
    tripId,
    autoLoad: true,
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
          <p className="mt-4 text-muted-foreground">Loading trip details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/browse-trips">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Trips
            </Button>
          </Link>
        </div>
        <Card>
          <CardContent className="text-center py-12">
            <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Error loading trip</h3>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={refresh} variant="outline">
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/browse-trips">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Trips
            </Button>
          </Link>
        </div>
        <Card>
          <CardContent className="text-center py-12">
            <Car className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Trip not found</h3>
            <p className="text-muted-foreground">
              The trip you're looking for doesn't exist.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Convert API data to display format
  const displayTrip = {
    id: trip.id,
    title: `${trip.fromLocation} to ${trip.toLocation}`,
    description: trip.description || "No description provided.",
    from: trip.fromLocation,
    to: trip.toLocation,
    departureDate: new Date(trip.departureTime).toISOString().split("T")[0],
    departureTime: new Date(trip.departureTime).toTimeString().slice(0, 5),
    returnDate: new Date(trip.departureTime).toISOString().split("T")[0], // Same day for now
    returnTime: new Date(
      new Date(trip.departureTime).getTime() + 4 * 60 * 60 * 1000
    )
      .toTimeString()
      .slice(0, 5), // 4 hours later
    vehicleType: trip.transportMethod,
    capacity: trip.maxDeliveries,
    availableSpots: trip.maxDeliveries - trip.currentDeliveries,
    pricePerItem: `GH₵${trip.pricePerDelivery.toFixed(2)}`,
    acceptedCategories: ["clothing", "electronics", "books-supplies"], // TODO: Add when available
    isRecurring: trip.isRecurring,
    recurringDays: [], // TODO: Add when available
    specialRequirements: trip.contactInfo || "No special requirements.",
    driver: trip.traveler
      ? {
          name: `${trip.traveler.firstName} ${trip.traveler.lastName}`,
          avatar: trip.traveler.profileImage || "/placeholder.svg",
          rating: trip.traveler.rating,
          completedTrips: trip.traveler.totalDeliveries,
          isVerified: trip.traveler.verificationStatus === "approved",
          joinDate: trip.traveler.createdAt,
          bio: `${
            trip.traveler.currentYear
              ? `${trip.traveler.currentYear} Year `
              : ""
          }${trip.traveler.programmeOfStudy || "Student"}`,
          responseTime: "Usually responds within 30 minutes",
          vehicleInfo: trip.contactInfo || "Contact for vehicle details",
        }
      : {
          name: trip.travelerName || "Anonymous Driver",
          avatar: "/placeholder.svg",
          rating: 0,
          completedTrips: 0,
          isVerified: false,
          joinDate: trip.createdAt,
          bio: "Student",
          responseTime: "Response time unknown",
          vehicleInfo: trip.contactInfo || "Contact for vehicle details",
        },
    joinedStudents: trip.joinedUsers
      ? trip.joinedUsers.map((user, index) => ({
          id: `JOIN${index + 1}`,
          student: {
            name: `${user.firstName} ${user.lastName}`,
            avatar: user.profileImage || "/placeholder.svg",
            rating: user.rating,
          },
          joinedAt: trip.createdAt, // TODO: Add actual join time when available
          itemsCount: 1, // TODO: Add actual item count when available
          message: "Joined this trip", // TODO: Add actual message when available
        }))
      : [],
    status: trip.status,
    createdAt: trip.createdAt,
  };

  const handleJoinTrip = async () => {
    setIsJoining(true);
    try {
      // TODO: Implement join trip API call
      // This would require the tripsService.joinTrip method
      console.log(
        "Join trip functionality needs to be implemented with API call"
      );
      setIsJoining(false);
      setShowJoinForm(false);
      setJoinMessage("");
    } catch (error) {
      console.error("Failed to join trip:", error);
      setIsJoining(false);
    }
  };

  const getVehicleIcon = (vehicleType: string) => {
    return <Car className="h-4 w-4" />;
  };

  const getVehicleLabel = (vehicleType: string) => {
    switch (vehicleType) {
      case "car":
        return "Car";
      case "suv":
        return "SUV";
      case "truck":
        return "Pickup Truck";
      case "bike":
        return "Bicycle";
      case "walking":
        return "Walking";
      default:
        return vehicleType;
    }
  };

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
          <p className="text-muted-foreground">
            Review the trip details and join if interested
          </p>
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
                    <CardTitle className="text-xl">
                      {displayTrip.title}
                    </CardTitle>
                    <Badge variant="outline" className="gap-1">
                      {getVehicleIcon(displayTrip.vehicleType)}
                      {getVehicleLabel(displayTrip.vehicleType)}
                    </Badge>
                    {displayTrip.isRecurring && (
                      <Badge variant="secondary">Recurring</Badge>
                    )}
                    {displayTrip.availableSpots > 0 ? (
                      <Badge variant="default">Available</Badge>
                    ) : (
                      <Badge variant="outline">Full</Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>
                      Posted{" "}
                      {new Date(displayTrip.createdAt).toLocaleDateString()}
                    </span>
                    <span>•</span>
                    <span>
                      {displayTrip.capacity - displayTrip.availableSpots} joined
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-primary">
                    {displayTrip.pricePerItem}
                  </div>
                  <div className="text-sm text-muted-foreground">per item</div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Description</h4>
                <p className="text-muted-foreground">
                  {displayTrip.description}
                </p>
              </div>

              <Separator />

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-medium text-sm">Starting Point</div>
                      <div className="text-sm text-muted-foreground">
                        {displayTrip.from}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-medium text-sm">Destination</div>
                      <div className="text-sm text-muted-foreground">
                        {displayTrip.to}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="font-medium text-sm">Date</div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(
                          displayTrip.departureDate
                        ).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="font-medium text-sm">Departure Time</div>
                      <div className="text-sm text-muted-foreground">
                        {displayTrip.departureTime}
                      </div>
                    </div>
                  </div>
                  {displayTrip.returnTime && (
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <div className="font-medium text-sm">Return Time</div>
                        <div className="text-sm text-muted-foreground">
                          {displayTrip.returnTime}
                        </div>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="font-medium text-sm">Capacity</div>
                      <div className="text-sm text-muted-foreground">
                        {displayTrip.availableSpots}/{displayTrip.capacity}{" "}
                        spots available
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <h4 className="font-medium">Accepted Item Categories</h4>
                <div className="flex flex-wrap gap-1">
                  {displayTrip.acceptedCategories.map((category) => (
                    <Badge key={category} variant="outline" className="text-xs">
                      {category.replace("-", " ")}
                    </Badge>
                  ))}
                </div>
              </div>

              {displayTrip.isRecurring && (
                <>
                  <Separator />
                  <div className="space-y-2">
                    <h4 className="font-medium">Recurring Schedule</h4>
                    <div className="flex flex-wrap gap-1">
                      {displayTrip.recurringDays.map((day) => (
                        <Badge
                          key={day}
                          variant="secondary"
                          className="text-xs capitalize"
                        >
                          {day}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {displayTrip.specialRequirements && (
                <>
                  <Separator />
                  <div>
                    <h4 className="font-medium mb-2">Special Requirements</h4>
                    <p className="text-sm text-muted-foreground">
                      {displayTrip.specialRequirements}
                    </p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Joined Students */}
          {displayTrip.joinedStudents.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>
                  Joined Students ({displayTrip.joinedStudents.length})
                </CardTitle>
                <CardDescription>
                  Other students who have joined this trip
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {displayTrip.joinedStudents.map((join) => (
                  <div
                    key={join.id}
                    className="flex gap-3 p-3 border rounded-lg"
                  >
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src={join.student.avatar || "/placeholder.svg"}
                        alt={join.student.name}
                      />
                      <AvatarFallback>
                        {join.student.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">
                          {join.student.name}
                        </span>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          {join.student.rating}
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {join.itemsCount} items
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {join.message}
                      </p>
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
                  <AvatarImage
                    src={displayTrip.driver.avatar || "/placeholder.svg"}
                    alt={displayTrip.driver.name}
                  />
                  <AvatarFallback>
                    {displayTrip.driver.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">
                      {displayTrip.driver.name}
                    </span>
                    {displayTrip.driver.isVerified && (
                      <Shield className="h-4 w-4 text-primary" />
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    {displayTrip.driver.rating}/5.0 •{" "}
                    {displayTrip.driver.completedTrips} trips
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <p className="text-muted-foreground">
                  {displayTrip.driver.bio}
                </p>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  {displayTrip.driver.responseTime}
                </div>
                <div className="text-muted-foreground">
                  Member since{" "}
                  {new Date(displayTrip.driver.joinDate).toLocaleDateString()}
                </div>
                <div className="text-muted-foreground">
                  Vehicle: {displayTrip.driver.vehicleInfo}
                </div>
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
                  <Button
                    className="w-full"
                    onClick={() => setShowJoinForm(true)}
                    disabled={displayTrip.availableSpots === 0}
                  >
                    {displayTrip.availableSpots > 0 ? "Join Trip" : "Trip Full"}
                  </Button>
                  <div className="text-center text-sm text-muted-foreground">
                    {displayTrip.availableSpots} of {displayTrip.capacity} spots
                    available
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
                    <Button
                      onClick={handleJoinTrip}
                      disabled={isJoining}
                      className="flex-1"
                    >
                      {isJoining ? "Joining..." : "Confirm Join"}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowJoinForm(false);
                        setJoinMessage("");
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
                  Make sure you can meet the driver at the specified time and
                  location.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
