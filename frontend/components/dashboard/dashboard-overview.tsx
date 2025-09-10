"use client";

import { useAuth, useDeliveryRequests, useMyTrips } from "@/lib/hooks";
import { useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Package,
  Car,
  MessageCircle,
  Star,
  Clock,
  MapPin,
  Plus,
  TrendingUp,
  Shield,
} from "lucide-react";
import Link from "next/link";

export function DashboardOverview() {
  const { user, loading: authLoading } = useAuth();
  const {
    requests,
    loading: requestsLoading,
    loadDeliveryRequests,
  } = useDeliveryRequests({ page: 1, limit: 5, autoLoad: false });
  const { myTrips, loading: tripsLoading } = useMyTrips();

  useEffect(() => {
    loadDeliveryRequests(1, 5);
  }, []);

  useEffect(() => {
    console.log("DashboardOverview: Auth state", {
      user: user?.firstName,
      authLoading,
    });
  }, [user, authLoading]);

  if (authLoading || !user) {
    console.log("DashboardOverview: Showing loading state", {
      authLoading,
      hasUser: !!user,
    });
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  console.log(
    "DashboardOverview: Rendering dashboard content for",
    user.firstName
  );

  const activeRequests = requests
    ? requests.filter((r) => r.status === "pending").length
    : 0;
  const completedTrips = myTrips
    ? myTrips.filter((t) => t.status === "completed").length
    : 0;

  const stats = [
    {
      title: "Total Deliveries",
      value: user.totalDeliveries.toString(),
      description: "Completed",
      icon: Package,
      color: "text-blue-600",
    },
    {
      title: "My Trips",
      value: (myTrips ? myTrips.length : 0).toString(),
      description: "Created",
      icon: Car,
      color: "text-green-600",
    },
    {
      title: "Messages",
      value: "0",
      description: "Unread",
      icon: MessageCircle,
      color: "text-orange-600",
    },
    {
      title: "Rating",
      value: user.rating.toFixed(1),
      description: "Average rating",
      icon: Star,
      color: "text-yellow-600",
    },
  ];

  const recentRequests = (requests || []).slice(0, 5);
  const upcomingTrips = (myTrips || []).slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Welcome back, {user.firstName}!
          </h1>
          <p className="text-muted-foreground">
            Here's what's happening with your deliveries today.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge
            variant={
              user.verificationStatus === "approved" ? "secondary" : "outline"
            }
            className="gap-1"
          >
            <Shield className="h-3 w-3" />
            {user.verificationStatus === "approved"
              ? "Verified Student"
              : `Verification ${user.verificationStatus}`}
          </Badge>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Get started with your next delivery or trip
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <Link href="/dashboard/requests/new">
              <Button className="w-full h-20 flex-col gap-2">
                <Plus className="h-6 w-6" />
                Post New Request
              </Button>
            </Link>
            <Link href="/dashboard/trips/new">
              <Button
                variant="outline"
                className="w-full h-20 flex-col gap-2 bg-transparent"
              >
                <Car className="h-6 w-6" />
                Share a Trip
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Requests */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Requests</CardTitle>
            <CardDescription>Your latest delivery requests</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentRequests.map((request) => (
              <div
                key={request.id}
                className="flex items-center gap-4 p-3 border rounded-lg"
              >
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium">{request.itemDescription}</h4>
                    <Badge
                      variant={
                        request.status === "pending"
                          ? "secondary"
                          : request.status === "matched"
                          ? "default"
                          : request.status === "in_transit"
                          ? "outline"
                          : "outline"
                      }
                    >
                      {request.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    {request.pickupLocation} → {request.dropoffLocation}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {new Date(request.createdAt).toLocaleString()}
                    {request.requesterName
                      ? ` • by ${request.requesterName}`
                      : null}
                  </div>
                </div>
              </div>
            ))}
            <Link href="/dashboard/requests">
              <Button variant="ghost" className="w-full">
                View All Requests
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Upcoming Trips */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Trips</CardTitle>
            <CardDescription>Your scheduled delivery trips</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingTrips.map((trip) => (
              <div
                key={trip.id}
                className="flex items-center gap-4 p-3 border rounded-lg"
              >
                <div className="flex-1 space-y-1">
                  <h4 className="font-medium">
                    {trip.fromLocation} → {trip.toLocation}
                  </h4>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {new Date(trip.departureTime).toLocaleString()}
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">
                      Capacity: {trip.currentDeliveries}/{trip.maxDeliveries}
                    </span>
                    <span className="font-medium text-green-600">
                      GH₵{trip.pricePerDelivery.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
            <Link href="/dashboard/trips">
              <Button variant="ghost" className="w-full">
                View All Trips
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Performance Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            This Month's Performance
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Total Deliveries</span>
                <span>{user.totalDeliveries}</span>
              </div>
              <Progress
                value={Math.min((user.totalDeliveries / 20) * 100, 100)}
                className="h-2"
              />
              <p className="text-xs text-muted-foreground">Lifetime total</p>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Verification Status</span>
                <span className="capitalize">{user.verificationStatus}</span>
              </div>
              <Progress
                value={
                  user.verificationStatus === "approved"
                    ? 100
                    : user.verificationStatus === "pending"
                    ? 50
                    : 0
                }
                className="h-2"
              />
              <p className="text-xs text-muted-foreground">
                Account verification
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Rating</span>
                <span>{user.rating.toFixed(1)}/5.0</span>
              </div>
              <Progress value={(user.rating / 5) * 100} className="h-2" />
              <p className="text-xs text-muted-foreground">
                Average user rating
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
