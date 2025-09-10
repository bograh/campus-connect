"use client";

import { useState } from "react";
import { useTrips, useTripUtils } from "@/lib/hooks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { CreateTripRequest, TransportMethod } from "@/lib/types/api";

export function TripsExample() {
  const {
    trips,
    loading,
    error,
    currentPage,
    totalPages,
    hasNextPage,
    hasPreviousPage,
    createTrip,
    joinTrip,
    loadNextPage,
    loadPreviousPage,
    clearError,
    refresh,
  } = useTrips();

  const { formatDepartureTime, getAvailableSpots } = useTripUtils();

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState<CreateTripRequest>({
    fromLocation: "",
    toLocation: "",
    departureDate: "",
    departureTime: "",
    availableSeats: 1,
    pricePerDelivery: 0,
    vehicleType: "car" as TransportMethod,
    description: "",
    contactInfo: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await createTrip(formData);
      setShowCreateForm(false);
      // Reset form
      setFormData({
        fromLocation: "",
        toLocation: "",
        departureDate: "",
        departureTime: "",
        availableSeats: 1,
        pricePerDelivery: 0,
        vehicleType: "car" as TransportMethod,
        description: "",
        contactInfo: "",
      });
    } catch (error) {
      // Error is handled by the hook
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "pricePerDelivery"
          ? parseFloat(value) || 0
          : name === "availableSeats"
          ? parseInt(value) || 1
          : value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleJoinTrip = async (tripId: string) => {
    try {
      await joinTrip({ tripId });
    } catch (error) {
      // Error is handled by the hook
    }
  };

  const getTransportIcon = (transportMethod: TransportMethod) => {
    switch (transportMethod) {
      case "car":
        return "🚗";
      case "motorcycle":
        return "🏍️";
      case "bicycle":
        return "🚴";
      case "walking":
        return "🚶";
      case "public_transport":
        return "🚌";
      default:
        return "🚗";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Available Trips</h2>
        <div className="flex gap-2">
          <Button onClick={refresh} variant="outline" disabled={loading}>
            Refresh
          </Button>
          <Button onClick={() => setShowCreateForm(!showCreateForm)}>
            {showCreateForm ? "Cancel" : "Create Trip"}
          </Button>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
          <Button
            variant="ghost"
            size="sm"
            className="ml-auto"
            onClick={clearError}
          >
            ×
          </Button>
        </Alert>
      )}

      {showCreateForm && (
        <Card>
          <CardHeader>
            <CardTitle>Create Trip</CardTitle>
            <CardDescription>
              Offer a trip and help other students with deliveries
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="fromLocation">From</Label>
                  <Input
                    id="fromLocation"
                    name="fromLocation"
                    value={formData.fromLocation}
                    onChange={handleInputChange}
                    placeholder="e.g., KNUST Campus"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="toLocation">To</Label>
                  <Input
                    id="toLocation"
                    name="toLocation"
                    value={formData.toLocation}
                    onChange={handleInputChange}
                    placeholder="e.g., Kejetia Market"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="departureDate">Departure Date</Label>
                  <Input
                    id="departureDate"
                    name="departureDate"
                    type="date"
                    value={formData.departureDate}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="departureTime">Departure Time</Label>
                  <Input
                    id="departureTime"
                    name="departureTime"
                    type="time"
                    value={formData.departureTime}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="availableSeats">Available Seats</Label>
                  <Input
                    id="availableSeats"
                    name="availableSeats"
                    type="number"
                    min="1"
                    max="20"
                    value={formData.availableSeats}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="pricePerDelivery">
                    Price per Delivery (GHS)
                  </Label>
                  <Input
                    id="pricePerDelivery"
                    name="pricePerDelivery"
                    type="number"
                    min="0"
                    step="0.50"
                    value={formData.pricePerDelivery}
                    onChange={handleInputChange}
                    placeholder="20.00"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="vehicleType">Transport Method</Label>
                  <Select
                    value={formData.vehicleType}
                    onValueChange={(value) =>
                      handleSelectChange("vehicleType", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="car">🚗 Car</SelectItem>
                      <SelectItem value="motorcycle">🏍️ Motorcycle</SelectItem>
                      <SelectItem value="bicycle">🚴 Bicycle</SelectItem>
                      <SelectItem value="walking">🚶 Walking</SelectItem>
                      <SelectItem value="public_transport">
                        🚌 Public Transport
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Additional details about your trip..."
                />
              </div>

              <div>
                <Label htmlFor="contactInfo">Contact Information</Label>
                <Input
                  id="contactInfo"
                  name="contactInfo"
                  value={formData.contactInfo}
                  onChange={handleInputChange}
                  placeholder="WhatsApp: +233123456789"
                />
              </div>

              <Button type="submit" disabled={loading}>
                {loading ? "Creating..." : "Create Trip"}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {loading && !showCreateForm && (
        <div className="text-center py-8">Loading trips...</div>
      )}

      <div className="grid gap-4">
        {trips.map((trip) => (
          <Card key={trip.id}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    {getTransportIcon(trip.transportMethod)}
                    {trip.fromLocation} → {trip.toLocation}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    By {trip.travelerName} • Posted{" "}
                    {new Date(trip.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <Badge className={getStatusColor(trip.status)}>
                  {trip.status}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <Label className="text-sm font-medium">Departure</Label>
                  <p>{formatDepartureTime(trip.departureTime)}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">
                    Price per Delivery
                  </Label>
                  <p className="font-semibold text-green-600">
                    GHS {trip.pricePerDelivery}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <Label className="text-sm font-medium">Available Spots</Label>
                  <p>
                    {getAvailableSpots(trip)} of {trip.maxDeliveries}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Transport</Label>
                  <p className="capitalize flex items-center gap-1">
                    {getTransportIcon(trip.transportMethod)}{" "}
                    {trip.transportMethod.replace("_", " ")}
                  </p>
                </div>
              </div>

              {trip.description && (
                <div className="mb-4">
                  <Label className="text-sm font-medium">Description</Label>
                  <p className="text-sm">{trip.description}</p>
                </div>
              )}

              {trip.contactInfo && (
                <div className="mb-4">
                  <Label className="text-sm font-medium">Contact</Label>
                  <p className="text-sm">{trip.contactInfo}</p>
                </div>
              )}

              <div className="flex justify-between items-center">
                <div className="flex gap-1">
                  {getAvailableSpots(trip) === 0 && (
                    <Badge variant="destructive">Full</Badge>
                  )}
                  {trip.isRecurring && (
                    <Badge variant="outline">Recurring</Badge>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    View Details
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleJoinTrip(trip.id)}
                    disabled={getAvailableSpots(trip) === 0}
                  >
                    {getAvailableSpots(trip) === 0 ? "Trip Full" : "Join Trip"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4">
          <Button
            onClick={loadPreviousPage}
            disabled={!hasPreviousPage || loading}
            variant="outline"
          >
            Previous
          </Button>
          <span className="text-sm">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            onClick={loadNextPage}
            disabled={!hasNextPage || loading}
            variant="outline"
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
