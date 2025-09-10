"use client";

import { useEffect, useMemo, useState } from "react";
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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  MapPin,
  Clock,
  Search,
  Filter,
  Car,
  Users,
  Star,
  Shield,
  Calendar,
  Plus,
} from "lucide-react";
import Link from "next/link";
import { useTrips } from "@/lib/hooks";

export function BrowseTrips() {
  const [filter, setFilter] = useState("all");
  const [vehicleFilter, setVehicleFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const { trips, loading, error, totalTrips, loadTrips } = useTrips({
    page: 1,
    limit: 20,
    autoLoad: false,
  });

  useEffect(() => {
    console.log("BrowseTrips: Loading trips...");
    loadTrips(1, 20);
  }, []);

  useEffect(() => {
    console.log("BrowseTrips state:", { trips, loading, error, totalTrips });
  }, [trips, loading, error, totalTrips]);

  const vehicleTypes = [
    { value: "all", label: "All Vehicles" },
    { value: "car", label: "Car" },
    { value: "suv", label: "SUV" },
    { value: "truck", label: "Pickup Truck" },
    { value: "bike", label: "Bicycle" },
    { value: "walking", label: "Walking" },
  ];

  // Map backend trips to UI and filter client-side
  const filteredTrips = useMemo(() => {
    const list = (trips || []).map((t) => {
      const availableSpots = Math.max(
        (t.maxDeliveries || 0) - (t.currentDeliveries || 0),
        0
      );
      return {
        id: t.id,
        title: `${t.fromLocation} → ${t.toLocation}`,
        description: t.description || "",
        from: t.fromLocation,
        to: t.toLocation,
        departureDate: t.departureTime
          ? new Date(t.departureTime).toISOString().slice(0, 10)
          : "",
        departureTime: t.departureTime
          ? new Date(t.departureTime).toLocaleTimeString()
          : "",
        returnDate: null,
        returnTime: null,
        vehicleType: t.transportMethod || "car",
        capacity: t.maxDeliveries || 0,
        availableSpots,
        pricePerItem:
          t.pricePerDelivery != null
            ? `GH₵${Number(t.pricePerDelivery).toFixed(2)}`
            : "",
        acceptedCategories: [] as string[],
        isRecurring: !!t.isRecurring,
        driver: {
          name: t.travelerName || "Traveler",
          avatar: "/placeholder.svg",
          rating: 0,
          completedTrips: 0,
          isVerified: true,
        },
        createdAt: t.createdAt || new Date().toISOString(),
      };
    });

    return list.filter((trip) => {
      const matchesSearch =
        (trip.title || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (trip.description || "")
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        (trip.from || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (trip.to || "").toLowerCase().includes(searchQuery.toLowerCase());
      const matchesVehicle =
        vehicleFilter === "all" || trip.vehicleType === vehicleFilter;
      const matchesAvailability =
        filter === "all" || (filter === "available" && trip.availableSpots > 0);
      return matchesSearch && matchesVehicle && matchesAvailability;
    });
  }, [trips, searchQuery, vehicleFilter, filter]);

  const getVehicleIcon = (vehicleType: string) => {
    switch (vehicleType) {
      case "car":
      case "suv":
      case "truck":
        return <Car className="h-4 w-4" />;
      default:
        return <Car className="h-4 w-4" />;
    }
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Browse Trips</h1>
          <p className="text-muted-foreground">
            Find trips from verified students and join their routes
          </p>
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
        {loading && (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              Loading trips...
            </CardContent>
          </Card>
        )}
        {!loading &&
          filteredTrips.map((trip) => (
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
                      {trip.isRecurring && (
                        <Badge variant="secondary">Recurring</Badge>
                      )}
                      {trip.availableSpots > 0 ? (
                        <Badge variant="default">Available</Badge>
                      ) : (
                        <Badge variant="outline">Full</Badge>
                      )}
                    </div>
                    <CardDescription className="text-sm">
                      {trip.description}
                    </CardDescription>
                  </div>
                  <div className="text-right ml-4">
                    <div className="text-xl font-bold text-primary">
                      {trip.pricePerItem}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      per item
                    </div>
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
                    <span>
                      {trip.departureDate
                        ? new Date(trip.departureDate).toLocaleDateString()
                        : ""}
                    </span>
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
                {trip.acceptedCategories &&
                  trip.acceptedCategories.length > 0 && (
                    <div className="space-y-2">
                      <span className="text-sm font-medium">
                        Accepted Items:
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {trip.acceptedCategories.map((category: string) => (
                          <Badge
                            key={category}
                            variant="outline"
                            className="text-xs"
                          >
                            {category.replace("-", " ")}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                {/* Driver Info */}
                <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={"/placeholder.svg"} alt={"Traveler"} />
                    <AvatarFallback>{"TR"}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{trip.driver.name}</span>
                      {trip.driver.isVerified && (
                        <Shield className="h-4 w-4 text-primary" />
                      )}
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
                    <Button
                      className="w-full"
                      disabled={trip.availableSpots === 0}
                    >
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

      {!loading && filteredTrips.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Car className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No trips found</h3>
            <p className="text-muted-foreground mb-4">
              No trips match your current filters. Try adjusting your search
              criteria.
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery("");
                setFilter("all");
                setVehicleFilter("all");
              }}
            >
              Clear Filters
            </Button>
          </CardContent>
        </Card>
      )}
      {error && (
        <Card>
          <CardContent className="text-center py-4 text-red-600">
            <h3 className="font-semibold mb-2">Error loading trips</h3>
            <p>{error}</p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => loadTrips(1, 20)}
            >
              Try Again
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
