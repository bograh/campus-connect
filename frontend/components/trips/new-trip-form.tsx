"use client";

import type React from "react";

import { useState } from "react";
import { useTrips } from "@/lib/hooks";
import { handleApiError } from "@/lib/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  MapPin,
  Clock,
  Users,
  ArrowLeft,
  AlertCircle,
  DollarSign,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function NewTripForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { createTrip } = useTrips({ autoLoad: false });
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    fromLocation: "",
    toLocation: "",
    departureDate: "",
    departureTime: "",
    returnDate: "",
    returnTime: "",
    capacity: "",
    vehicleType: "",
    pricePerItem: "",
    acceptedCategories: [] as string[],
    specialRequirements: "",
    isRecurring: false,
    recurringDays: [] as string[],
  });

  const vehicleTypes = [
    { value: "car", label: "Car", description: "Standard passenger vehicle" },
    { value: "suv", label: "SUV", description: "Larger vehicle, more space" },
    {
      value: "truck",
      label: "Pickup Truck",
      description: "Best for large items",
    },
    { value: "bike", label: "Bicycle", description: "Small items only" },
    { value: "walking", label: "Walking", description: "Very small items" },
  ];

  const categories = [
    "Food & Beverages",
    "Books & Supplies",
    "Packages & Mail",
    "Groceries",
    "Electronics",
    "Clothing",
    "Documents",
  ];

  const weekDays = [
    { value: "monday", label: "Monday" },
    { value: "tuesday", label: "Tuesday" },
    { value: "wednesday", label: "Wednesday" },
    { value: "thursday", label: "Thursday" },
    { value: "friday", label: "Friday" },
    { value: "saturday", label: "Saturday" },
    { value: "sunday", label: "Sunday" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Basic validation
    if (
      !formData.title ||
      !formData.fromLocation ||
      !formData.toLocation ||
      !formData.departureDate
    ) {
      setError("Please fill in all required fields");
      setIsLoading(false);
      return;
    }

    if (formData.capacity && Number.parseInt(formData.capacity) < 1) {
      setError("Capacity must be at least 1");
      setIsLoading(false);
      return;
    }

    if (formData.pricePerItem && Number.parseFloat(formData.pricePerItem) < 0) {
      setError("Price per item must be positive");
      setIsLoading(false);
      return;
    }

    try {
      // Ensure price is valid (must be > 0 per API validation)
      const pricePerDelivery = formData.pricePerItem
        ? parseFloat(formData.pricePerItem)
        : 5.0; // Default minimum price

      const availableSeats = formData.capacity
        ? parseInt(formData.capacity)
        : 1;

      // Map frontend vehicleType to backend vehicleType (API valid values)
      const vehicleTypeMap: Record<string, string> = {
        car: "car",
        suv: "car",
        truck: "car",
        bike: "bicycle",
        bicycle: "bicycle",
        motorcycle: "motorcycle",
        motorbike: "motorcycle",
        walking: "walking",
        public_transport: "public_transport",
        bus: "public_transport",
        "tro-tro": "public_transport",
      };

      const vehicleType =
        vehicleTypeMap[formData.vehicleType?.toLowerCase()] || "car";

      // Format departure time - API expects "HH:MM" format
      const departureTime = formData.departureTime || "08:00";

      // Create trip matching API specification exactly
      await createTrip({
        fromLocation: formData.fromLocation,
        toLocation: formData.toLocation,
        departureDate: formData.departureDate, // Format: "2025-01-15"
        departureTime, // Format: "08:00"
        availableSeats,
        pricePerDelivery,
        vehicleType, // Valid values: "car", "motorcycle", "bicycle", "walking", "public_transport"
        description: formData.description || undefined,
        contactInfo: "WhatsApp: Contact via CampusConnect app",
      });

      router.push("/dashboard/trips");
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (
    field: string,
    value: string | boolean | string[]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCategoryToggle = (category: string) => {
    const categoryKey = category.toLowerCase().replace(/\s+/g, "-");
    setFormData((prev) => ({
      ...prev,
      acceptedCategories: prev.acceptedCategories.includes(categoryKey)
        ? prev.acceptedCategories.filter((c) => c !== categoryKey)
        : [...prev.acceptedCategories, categoryKey],
    }));
  };

  const handleRecurringDayToggle = (day: string) => {
    setFormData((prev) => ({
      ...prev,
      recurringDays: prev.recurringDays.includes(day)
        ? prev.recurringDays.filter((d) => d !== day)
        : [...prev.recurringDays, day],
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/trips">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Trips
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Share a Trip</h1>
          <p className="text-muted-foreground">
            Create a trip and help other students with deliveries
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Basic Trip Information */}
        <Card>
          <CardHeader>
            <CardTitle>Trip Information</CardTitle>
            <CardDescription>
              Provide details about your trip route and schedule
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Trip Title *</Label>
              <Input
                id="title"
                placeholder="e.g., Campus to Downtown Mall"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe your trip route, any stops, and what types of deliveries you can handle..."
                value={formData.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                rows={3}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="fromLocation">Starting Location *</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="fromLocation"
                    placeholder="e.g., Main Campus - Student Union"
                    className="pl-10"
                    value={formData.fromLocation}
                    onChange={(e) =>
                      handleInputChange("fromLocation", e.target.value)
                    }
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="toLocation">Destination *</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="toLocation"
                    placeholder="e.g., Downtown Shopping District"
                    className="pl-10"
                    value={formData.toLocation}
                    onChange={(e) =>
                      handleInputChange("toLocation", e.target.value)
                    }
                    required
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Schedule */}
        <Card>
          <CardHeader>
            <CardTitle>Schedule</CardTitle>
            <CardDescription>
              Set your departure and return times
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="departureDate">Departure Date *</Label>
                <div className="relative">
                  <Clock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="departureDate"
                    type="date"
                    className="pl-10"
                    value={formData.departureDate}
                    onChange={(e) =>
                      handleInputChange("departureDate", e.target.value)
                    }
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="departureTime">Departure Time *</Label>
                <div className="relative">
                  <Clock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="departureTime"
                    type="time"
                    className="pl-10"
                    value={formData.departureTime}
                    onChange={(e) =>
                      handleInputChange("departureTime", e.target.value)
                    }
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="returnDate">Return Date (Optional)</Label>
                <div className="relative">
                  <Clock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="returnDate"
                    type="date"
                    className="pl-10"
                    value={formData.returnDate}
                    onChange={(e) =>
                      handleInputChange("returnDate", e.target.value)
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="returnTime">Return Time (Optional)</Label>
                <div className="relative">
                  <Clock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="returnTime"
                    type="time"
                    className="pl-10"
                    value={formData.returnTime}
                    onChange={(e) =>
                      handleInputChange("returnTime", e.target.value)
                    }
                  />
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isRecurring"
                  checked={formData.isRecurring}
                  onCheckedChange={(checked) =>
                    handleInputChange("isRecurring", checked as boolean)
                  }
                />
                <Label htmlFor="isRecurring">This is a recurring trip</Label>
              </div>

              {formData.isRecurring && (
                <div className="space-y-2 pl-6">
                  <Label>Recurring Days</Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {weekDays.map((day) => (
                      <div
                        key={day.value}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={day.value}
                          checked={formData.recurringDays.includes(day.value)}
                          onCheckedChange={() =>
                            handleRecurringDayToggle(day.value)
                          }
                        />
                        <Label htmlFor={day.value} className="text-sm">
                          {day.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Vehicle & Capacity */}
        <Card>
          <CardHeader>
            <CardTitle>Vehicle & Capacity</CardTitle>
            <CardDescription>
              Specify your transportation method and delivery capacity
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <Label>Vehicle Type</Label>
              <div className="grid gap-3 md:grid-cols-2">
                {vehicleTypes.map((vehicle) => (
                  <div
                    key={vehicle.value}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      formData.vehicleType === vehicle.value
                        ? "border-primary bg-primary/5"
                        : "border-border hover:bg-muted/50"
                    }`}
                    onClick={() =>
                      handleInputChange("vehicleType", vehicle.value)
                    }
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">{vehicle.label}</div>
                        <div className="text-sm text-muted-foreground">
                          {vehicle.description}
                        </div>
                      </div>
                      {formData.vehicleType === vehicle.value && (
                        <Badge variant="secondary">Selected</Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="capacity">Delivery Capacity</Label>
                <div className="relative">
                  <Users className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="capacity"
                    type="number"
                    min="1"
                    placeholder="Number of items you can carry"
                    className="pl-10"
                    value={formData.capacity}
                    onChange={(e) =>
                      handleInputChange("capacity", e.target.value)
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="pricePerItem">Price per Item (Optional)</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="pricePerItem"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    className="pl-10"
                    value={formData.pricePerItem}
                    onChange={(e) =>
                      handleInputChange("pricePerItem", e.target.value)
                    }
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Accepted Categories */}
        <Card>
          <CardHeader>
            <CardTitle>Accepted Item Categories</CardTitle>
            <CardDescription>
              Select what types of items you're willing to deliver
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-2">
              {categories.map((category) => {
                const categoryKey = category.toLowerCase().replace(/\s+/g, "-");
                return (
                  <div key={category} className="flex items-center space-x-2">
                    <Checkbox
                      id={categoryKey}
                      checked={formData.acceptedCategories.includes(
                        categoryKey
                      )}
                      onCheckedChange={() => handleCategoryToggle(category)}
                    />
                    <Label htmlFor={categoryKey}>{category}</Label>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Special Requirements */}
        <Card>
          <CardHeader>
            <CardTitle>Special Requirements</CardTitle>
            <CardDescription>
              Any special conditions or requirements for your trip
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="specialRequirements">Special Requirements</Label>
              <Textarea
                id="specialRequirements"
                placeholder="e.g., No fragile items, cash payment preferred, meet at specific location..."
                value={formData.specialRequirements}
                onChange={(e) =>
                  handleInputChange("specialRequirements", e.target.value)
                }
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Submit Actions */}
        <div className="flex gap-4">
          <Button type="submit" disabled={isLoading} className="flex-1">
            {isLoading ? "Creating Trip..." : "Share Trip"}
          </Button>
          <Link href="/dashboard/trips">
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </Link>
        </div>
      </form>
    </div>
  );
}
