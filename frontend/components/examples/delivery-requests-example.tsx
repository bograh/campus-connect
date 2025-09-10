"use client";

import { useState } from "react";
import { useDeliveryRequests } from "@/lib/hooks";
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
import type {
  CreateDeliveryRequestRequest,
  ItemSize,
  Priority,
} from "@/lib/types/api";

export function DeliveryRequestsExample() {
  const {
    requests,
    loading,
    error,
    currentPage,
    totalPages,
    hasNextPage,
    hasPreviousPage,
    createDeliveryRequest,
    loadNextPage,
    loadPreviousPage,
    clearError,
    refresh,
  } = useDeliveryRequests();

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState<CreateDeliveryRequestRequest>({
    pickupLocation: "",
    dropoffLocation: "",
    itemDescription: "",
    itemSize: "medium" as ItemSize,
    priority: "normal" as Priority,
    paymentAmount: 0,
    pickupDate: "",
    pickupTime: "",
    contactInfo: "",
    specialInstructions: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await createDeliveryRequest(formData);
      setShowCreateForm(false);
      // Reset form
      setFormData({
        pickupLocation: "",
        dropoffLocation: "",
        itemDescription: "",
        itemSize: "medium" as ItemSize,
        priority: "normal" as Priority,
        paymentAmount: 0,
        pickupDate: "",
        pickupTime: "",
        contactInfo: "",
        specialInstructions: "",
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
      [name]: name === "paymentAmount" ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const getPriorityColor = (priority: Priority) => {
    switch (priority) {
      case "urgent":
        return "bg-red-100 text-red-800";
      case "high":
        return "bg-orange-100 text-orange-800";
      case "normal":
        return "bg-blue-100 text-blue-800";
      case "low":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Delivery Requests</h2>
        <div className="flex gap-2">
          <Button onClick={refresh} variant="outline" disabled={loading}>
            Refresh
          </Button>
          <Button onClick={() => setShowCreateForm(!showCreateForm)}>
            {showCreateForm ? "Cancel" : "Create Request"}
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
            <CardTitle>Create Delivery Request</CardTitle>
            <CardDescription>
              Request a delivery from other KNUST students
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="pickupLocation">Pickup Location</Label>
                  <Input
                    id="pickupLocation"
                    name="pickupLocation"
                    value={formData.pickupLocation}
                    onChange={handleInputChange}
                    placeholder="e.g., Central Cafeteria"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="dropoffLocation">Dropoff Location</Label>
                  <Input
                    id="dropoffLocation"
                    name="dropoffLocation"
                    value={formData.dropoffLocation}
                    onChange={handleInputChange}
                    placeholder="e.g., Unity Hall"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="itemDescription">Item Description</Label>
                <Textarea
                  id="itemDescription"
                  name="itemDescription"
                  value={formData.itemDescription}
                  onChange={handleInputChange}
                  placeholder="Describe what you need delivered..."
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="itemSize">Item Size</Label>
                  <Select
                    value={formData.itemSize}
                    onValueChange={(value) =>
                      handleSelectChange("itemSize", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="small">Small</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="large">Large</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="priority">Priority</Label>
                  <Select
                    value={formData.priority}
                    onValueChange={(value) =>
                      handleSelectChange("priority", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="paymentAmount">Payment (GHS)</Label>
                  <Input
                    id="paymentAmount"
                    name="paymentAmount"
                    type="number"
                    min="0"
                    step="0.50"
                    value={formData.paymentAmount}
                    onChange={handleInputChange}
                    placeholder="15.50"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="pickupDate">Pickup Date</Label>
                  <Input
                    id="pickupDate"
                    name="pickupDate"
                    type="date"
                    value={formData.pickupDate}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="pickupTime">Pickup Time</Label>
                  <Input
                    id="pickupTime"
                    name="pickupTime"
                    type="time"
                    value={formData.pickupTime}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="contactInfo">Contact Info</Label>
                <Input
                  id="contactInfo"
                  name="contactInfo"
                  value={formData.contactInfo}
                  onChange={handleInputChange}
                  placeholder="How should the deliverer contact you?"
                  required
                />
              </div>

              <div>
                <Label htmlFor="specialInstructions">
                  Special Instructions (Optional)
                </Label>
                <Textarea
                  id="specialInstructions"
                  name="specialInstructions"
                  value={formData.specialInstructions}
                  onChange={handleInputChange}
                  placeholder="Any special handling instructions..."
                />
              </div>

              <Button type="submit" disabled={loading}>
                {loading ? "Creating..." : "Create Request"}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {loading && !showCreateForm && (
        <div className="text-center py-8">Loading delivery requests...</div>
      )}

      <div className="grid gap-4">
        {requests.map((request) => (
          <Card key={request.id}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-semibold text-lg">
                    {request.itemDescription}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    By {request.requesterName} • {formatDate(request.createdAt)}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Badge className={getPriorityColor(request.priority)}>
                    {request.priority}
                  </Badge>
                  <Badge variant="outline" className="capitalize">
                    {request.itemSize}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <Label className="text-sm font-medium">Pickup</Label>
                  <p>{request.pickupLocation}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Dropoff</Label>
                  <p>{request.dropoffLocation}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <Label className="text-sm font-medium">Pickup Time</Label>
                  <p>
                    {formatDate(request.pickupDate)} at {request.pickupTime}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Payment</Label>
                  <p className="font-semibold text-green-600">
                    GHS {request.paymentAmount}
                  </p>
                </div>
              </div>

              {request.specialInstructions && (
                <div className="mb-4">
                  <Label className="text-sm font-medium">
                    Special Instructions
                  </Label>
                  <p className="text-sm">{request.specialInstructions}</p>
                </div>
              )}

              <div className="flex justify-between items-center">
                <Badge variant="secondary" className="capitalize">
                  {request.status}
                </Badge>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    View Details
                  </Button>
                  <Button size="sm">Offer Delivery</Button>
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
