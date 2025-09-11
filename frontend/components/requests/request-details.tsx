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
  Package,
  MessageCircle,
  Star,
  Shield,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Send,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { useDeliveryRequest } from "@/lib/hooks/useDeliveryRequests";
import { handleApiError } from "@/lib/api/client";
import { DELIVERY_STATUS, PRIORITY_LEVELS } from "@/lib/constants/api";

interface RequestDetailsProps {
  requestId: string;
}

export function RequestDetails({ requestId }: RequestDetailsProps) {
  const [isAccepting, setIsAccepting] = useState(false);
  const [showResponseForm, setShowResponseForm] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");

  // Fetch real data from API
  const { request, loading, error, refresh } = useDeliveryRequest({
    requestId,
    autoLoad: true,
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
          <p className="mt-4 text-muted-foreground">
            Loading request details...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/browse">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Requests
            </Button>
          </Link>
        </div>
        <Card>
          <CardContent className="text-center py-12">
            <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Error loading request</h3>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={refresh} variant="outline">
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/browse">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Requests
            </Button>
          </Link>
        </div>
        <Card>
          <CardContent className="text-center py-12">
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Request not found</h3>
            <p className="text-muted-foreground">
              The delivery request you're looking for doesn't exist.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Helper function to get ordinal suffix
  function getOrdinalSuffix(num: number): string {
    const suffixes = ["th", "st", "nd", "rd"];
    const value = num % 100;
    return suffixes[(value - 20) % 10] || suffixes[value] || suffixes[0];
  }

  // Define response type for TypeScript
  interface Response {
    id: string;
    responder: {
      name: string;
      avatar: string;
      rating: number;
      completedDeliveries: number;
    };
    message: string;
    timestamp: string;
  }

  // Convert API data to display format
  const displayRequest = {
    id: request.id,
    title: request.itemDescription,
    description: request.itemDescription,
    from: request.pickupLocation,
    to: request.dropoffLocation,
    budget: `GH₵${request.paymentAmount.toFixed(2)}`,
    urgency: request.priority,
    category: request.itemSize,
    createdAt: request.createdAt,
    deadline: `${request.pickupDate}T${request.pickupTime}:00Z`,
    specialInstructions:
      request.specialInstructions || "No special instructions provided.",
    requester: request.user
      ? {
          name: `${request.user.firstName} ${request.user.lastName}`,
          avatar: request.user.profileImage || "/placeholder.svg",
          rating: request.user.rating,
          completedDeliveries: request.user.totalDeliveries,
          isVerified: request.user.verificationStatus === "approved",
          joinDate: request.user.createdAt,
          bio: `${
            request.user.currentYear
              ? `${request.user.currentYear}${getOrdinalSuffix(
                  request.user.currentYear
                )} Year `
              : ""
          }${request.user.programmeOfStudy || "Student"}`,
          responseTime: "Usually responds within 30 minutes",
        }
      : {
          name: request.requesterName || "Anonymous User",
          avatar: "/placeholder.svg",
          rating: 0,
          completedDeliveries: 0,
          isVerified: false,
          joinDate: request.createdAt,
          bio: "Student",
          responseTime: "Response time unknown",
        },
    responses: [] as Response[], // TODO: Add responses when available
    status: request.status,
    contactInfo: request.contactInfo,
  };

  const handleAcceptRequest = async () => {
    setIsAccepting(true);
    try {
      // TODO: Implement offer delivery API call
      // This would require a trip ID, which we don't have in this context
      // For now, we'll show a message that this feature needs to be implemented
      console.log(
        "Accept request functionality needs to be implemented with trip selection"
      );
      setIsAccepting(false);
    } catch (error) {
      console.error("Failed to accept request:", error);
      setIsAccepting(false);
    }
  };

  const handleSendResponse = async () => {
    if (!responseMessage.trim()) return;

    console.log("Sending response:", responseMessage);
    setResponseMessage("");
    setShowResponseForm(false);
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "high":
        return "text-red-600";
      case "medium":
        return "text-yellow-600";
      case "low":
        return "text-green-600";
      default:
        return "text-gray-600";
    }
  };

  const getUrgencyBadgeVariant = (urgency: string) => {
    switch (urgency) {
      case "high":
        return "destructive";
      case "medium":
        return "secondary";
      case "low":
        return "outline";
      default:
        return "secondary";
    }
  };

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
          <h1 className="text-3xl font-bold text-foreground">
            Request Details
          </h1>
          <p className="text-muted-foreground">
            Review the request details and respond if interested
          </p>
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
                    <CardTitle className="text-xl">
                      {displayRequest.title}
                    </CardTitle>
                    <Badge
                      variant={getUrgencyBadgeVariant(displayRequest.urgency)}
                      className={getUrgencyColor(displayRequest.urgency)}
                    >
                      {displayRequest.urgency} priority
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>
                      Posted{" "}
                      {new Date(displayRequest.createdAt).toLocaleDateString()}
                    </span>
                    <span>•</span>
                    <span>{displayRequest.responses.length} responses</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-primary">
                    {displayRequest.budget}
                  </div>
                  <div className="text-sm text-muted-foreground">Budget</div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Description</h4>
                <p className="text-muted-foreground">
                  {displayRequest.description}
                </p>
              </div>

              <Separator />

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-medium text-sm">Pickup Location</div>
                      <div className="text-sm text-muted-foreground">
                        {displayRequest.from}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-medium text-sm">
                        Delivery Location
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {displayRequest.to}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="font-medium text-sm">Deadline</div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(displayRequest.deadline).toLocaleString()}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="font-medium text-sm">Item Size</div>
                      <div className="text-sm text-muted-foreground capitalize">
                        {displayRequest.category}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {displayRequest.specialInstructions && (
                <>
                  <Separator />
                  <div>
                    <h4 className="font-medium mb-2">Special Instructions</h4>
                    <p className="text-sm text-muted-foreground">
                      {displayRequest.specialInstructions}
                    </p>
                  </div>
                </>
              )}

              {displayRequest.contactInfo && (
                <>
                  <Separator />
                  <div>
                    <h4 className="font-medium mb-2">Contact Information</h4>
                    <p className="text-sm text-muted-foreground">
                      {displayRequest.contactInfo}
                    </p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Existing Responses */}
          {displayRequest.responses.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>
                  Other Responses ({displayRequest.responses.length})
                </CardTitle>
                <CardDescription>
                  See who else has responded to this request
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {displayRequest.responses.map((response) => (
                  <div
                    key={response.id}
                    className="flex gap-3 p-3 border rounded-lg"
                  >
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src={response.responder.avatar || "/placeholder.svg"}
                        alt={response.responder.name}
                      />
                      <AvatarFallback>
                        {response.responder.name
                          .split(" ")
                          .map((n: string) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">
                          {response.responder.name}
                        </span>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          {response.responder.rating}
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {response.responder.completedDeliveries} deliveries
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {response.message}
                      </p>
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
                  <AvatarImage
                    src={displayRequest.requester.avatar || "/placeholder.svg"}
                    alt={displayRequest.requester.name}
                  />
                  <AvatarFallback>
                    {displayRequest.requester.name
                      .split(" ")
                      .map((n: string) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">
                      {displayRequest.requester.name}
                    </span>
                    {displayRequest.requester.isVerified && (
                      <Shield className="h-4 w-4 text-primary" />
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    {displayRequest.requester.rating}/5.0 •{" "}
                    {displayRequest.requester.completedDeliveries} deliveries
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <p className="text-muted-foreground">
                  {displayRequest.requester.bio}
                </p>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  {displayRequest.requester.responseTime}
                </div>
                <div className="text-muted-foreground">
                  Member since{" "}
                  {new Date(
                    displayRequest.requester.joinDate
                  ).toLocaleDateString()}
                </div>
              </div>

              <Button
                variant="outline"
                className="w-full bg-transparent"
                asChild
              >
                <Link href={`/dashboard/messages/req-${displayRequest.id}`}>
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
              <CardDescription>
                Accept this request or send a message
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {!showResponseForm ? (
                <div className="space-y-3">
                  <Button
                    className="w-full"
                    onClick={handleAcceptRequest}
                    disabled={isAccepting}
                  >
                    {isAccepting ? "Accepting..." : "Accept Request"}
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full bg-transparent"
                    asChild
                  >
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
                    <Button
                      onClick={handleSendResponse}
                      disabled={!responseMessage.trim()}
                      className="flex-1"
                    >
                      <Send className="mr-2 h-4 w-4" />
                      Send
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowResponseForm(false);
                        setResponseMessage("");
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
                  Only respond if you can complete this delivery safely and on
                  time.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
