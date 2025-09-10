"use client";

import { useState, useMemo } from "react";
import { useMyTrips } from "@/lib/hooks";
import type { Trip, TripStatus, TransportMethod } from "@/lib/types/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Car,
  MapPin,
  Clock,
  Search,
  Filter,
  Plus,
  Eye,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { TRIP_STATUS, TRANSPORT_METHODS } from "@/lib/constants/api";

export function MyTrips() {
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const { myTrips, loading, error, loadMyTrips } = useMyTrips();

  const filteredTrips = useMemo(() => {
    if (!myTrips) return [];
    return myTrips.filter((trip: Trip) => {
      const matchesFilter = filter === "all" || trip.status === filter;
      const matchesSearch =
        trip.fromLocation.toLowerCase().includes(searchQuery.toLowerCase()) ||
        trip.toLocation.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (trip.description &&
          trip.description.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesFilter && matchesSearch;
    });
  }, [myTrips, filter, searchQuery]);

  const getStatusVariant = (status: TripStatus) => {
    const colors = {
      active: "default" as const,
      completed: "secondary" as const,
      cancelled: "destructive" as const,
    };
    return colors[status] || "secondary";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
          <p className="mt-4 text-muted-foreground">Loading your trips...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">My Trips</h1>
            <p className="text-muted-foreground">
              Manage your delivery trips and track earnings
            </p>
          </div>
          <Link href="/dashboard/trips/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Trip
            </Button>
          </Link>
        </div>
        <Card>
          <CardContent className="text-center py-12">
            <Car className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Error loading trips</h3>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={() => loadMyTrips()} variant="outline">
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">My Trips</h1>
          <p className="text-muted-foreground">
            Manage your delivery trips and track earnings
          </p>
        </div>
        <Link href="/dashboard/trips/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Trip
          </Button>
        </Link>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search trips..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Trips</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Trips List */}
      <div className="space-y-4">
        {filteredTrips.map((trip: Trip) => (
          <Card key={trip.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-lg">
                      {trip.fromLocation} → {trip.toLocation}
                    </CardTitle>
                    <Badge variant={getStatusVariant(trip.status)}>
                      {TRIP_STATUS[trip.status as keyof typeof TRIP_STATUS]
                        ?.label || trip.status}
                    </Badge>
                  </div>
                  <CardDescription>
                    {trip.description || "No description provided"}
                  </CardDescription>
                </div>
                <div className="text-right">
                  <div className="text-lg font-semibold text-green-600">
                    GH₵{trip.pricePerDelivery.toFixed(2)}/delivery
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {trip.currentDeliveries}/{trip.maxDeliveries} slots
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">From:</span> {trip.fromLocation}
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">To:</span> {trip.toLocation}
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Departure:</span>{" "}
                  {new Date(trip.departureTime).toLocaleString()}
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Car className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Transport:</span>
                  {TRANSPORT_METHODS[
                    trip.transportMethod as keyof typeof TRANSPORT_METHODS
                  ]?.label || trip.transportMethod}
                </div>
              </div>

              {trip.contactInfo && (
                <div className="p-3 bg-muted/50 rounded-lg">
                  <div className="text-sm">
                    <span className="font-medium">Contact info:</span>{" "}
                    {trip.contactInfo}
                  </div>
                </div>
              )}

              <div className="flex gap-2">
                <Link href={`/dashboard/trips/${trip.id}`}>
                  <Button variant="outline" size="sm">
                    <Eye className="mr-2 h-4 w-4" />
                    View Details
                  </Button>
                </Link>
                {trip.status === "active" && (
                  <Button variant="outline" size="sm" disabled>
                    Edit Trip
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredTrips.length === 0 && !loading && (
        <Card>
          <CardContent className="text-center py-12">
            <Car className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No trips found</h3>
            <p className="text-muted-foreground mb-4">
              {(myTrips?.length ?? 0) === 0
                ? "You haven't created any trips yet."
                : filter === "all"
                ? "No trips match your search criteria."
                : `No trips with status "${
                    filter !== "all"
                      ? TRIP_STATUS[filter as keyof typeof TRIP_STATUS]
                          ?.label || filter
                      : ""
                  }" found.`}
            </p>
            <Link href="/dashboard/trips/new">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                {(myTrips?.length ?? 0) === 0
                  ? "Create Your First Trip"
                  : "Create New Trip"}
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {loading && (
        <Card>
          <CardContent className="text-center py-12">
            <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Loading your trips...</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
