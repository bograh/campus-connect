"use client";

import type React from "react";

import { useState } from "react";
import { useDeliveryRequests } from "@/lib/hooks";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, ArrowLeft, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function NewRequestForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { createDeliveryRequest } = useDeliveryRequests({ autoLoad: false });
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    fromLocation: "",
    toLocation: "",
    budget: "",
    urgency: "",
    deadline: "",
    specialInstructions: "",
  });

  const categories = [
    "Food & Beverages",
    "Books & Supplies",
    "Packages & Mail",
    "Groceries",
    "Electronics",
    "Clothing",
    "Documents",
    "Other",
  ];

  const urgencyLevels = [
    { value: "low", label: "Low Priority", description: "Can wait a few days" },
    {
      value: "medium",
      label: "Medium Priority",
      description: "Needed within 24 hours",
    },
    {
      value: "high",
      label: "High Priority",
      description: "Urgent - needed ASAP",
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Basic validation
    if (
      !formData.title ||
      !formData.description ||
      !formData.fromLocation ||
      !formData.toLocation
    ) {
      setError("Please fill in all required fields");
      setIsLoading(false);
      return;
    }

    if (formData.budget && Number.parseFloat(formData.budget) < 0) {
      setError("Budget must be a positive number");
      setIsLoading(false);
      return;
    }

    try {
      const paymentAmount = formData.budget
        ? Number.parseFloat(formData.budget)
        : 0;
      const priority = (formData.urgency as any) || "normal";
      // Derive pickup date/time from deadline if provided; otherwise use current time
      const dateObj = formData.deadline
        ? new Date(formData.deadline)
        : new Date();
      const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);
      const pickupDate = `${dateObj.getFullYear()}-${pad(
        dateObj.getMonth() + 1
      )}-${pad(dateObj.getDate())}`;
      const pickupTime = `${pad(dateObj.getHours())}:${pad(
        dateObj.getMinutes()
      )}`;

      await createDeliveryRequest({
        pickupLocation: formData.fromLocation,
        dropoffLocation: formData.toLocation,
        itemDescription: formData.description || formData.title,
        itemSize: "medium",
        priority,
        paymentAmount,
        pickupDate,
        pickupTime,
        contactInfo: "Contact via app",
        specialInstructions: formData.specialInstructions || undefined,
      });

      router.push("/dashboard/requests");
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "high":
        return "text-red-600 border-red-200 bg-red-50";
      case "medium":
        return "text-yellow-600 border-yellow-200 bg-yellow-50";
      case "low":
        return "text-green-600 border-green-200 bg-green-50";
      default:
        return "";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/requests">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Requests
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Create New Request
          </h1>
          <p className="text-muted-foreground">
            Post a delivery request for verified students to accept
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

        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>
              Provide details about what you need delivered
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Request Title *</Label>
              <Input
                id="title"
                placeholder="e.g., Textbook pickup from library"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                placeholder="Provide detailed information about your delivery request..."
                value={formData.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                rows={4}
                required
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) =>
                    handleInputChange("category", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem
                        key={category}
                        value={category.toLowerCase().replace(/\s+/g, "-")}
                      >
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="budget">Budget GHS (Optional)</Label>
                <div className="relative">
                  <Input
                    prefix="GH₵"
                    id="budget"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    className="pl-10"
                    value={formData.budget}
                    onChange={(e) =>
                      handleInputChange("budget", e.target.value)
                    }
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Location Details */}
        <Card>
          <CardHeader>
            <CardTitle>Location Details</CardTitle>
            <CardDescription>
              Specify pickup and delivery locations
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fromLocation">Pickup Location *</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="fromLocation"
                  placeholder="e.g., Main Library - 2nd Floor"
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
              <Label htmlFor="toLocation">Delivery Location *</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="toLocation"
                  placeholder="e.g., North Hall, Room 204"
                  className="pl-10"
                  value={formData.toLocation}
                  onChange={(e) =>
                    handleInputChange("toLocation", e.target.value)
                  }
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Priority & Timing */}
        <Card>
          <CardHeader>
            <CardTitle>Priority & Timing</CardTitle>
            <CardDescription>
              Set urgency level and deadline for your request
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <Label>Urgency Level</Label>
              <div className="grid gap-3">
                {urgencyLevels.map((level) => (
                  <div
                    key={level.value}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      formData.urgency === level.value
                        ? getUrgencyColor(level.value)
                        : "border-border hover:bg-muted/50"
                    }`}
                    onClick={() => handleInputChange("urgency", level.value)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">{level.label}</div>
                        <div className="text-sm text-muted-foreground">
                          {level.description}
                        </div>
                      </div>
                      {formData.urgency === level.value && (
                        <Badge variant="secondary">Selected</Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="deadline">Deadline (Optional)</Label>
              <div className="relative">
                <Clock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="deadline"
                  type="datetime-local"
                  className="pl-10"
                  value={formData.deadline}
                  onChange={(e) =>
                    handleInputChange("deadline", e.target.value)
                  }
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Additional Information */}
        <Card>
          <CardHeader>
            <CardTitle>Additional Information</CardTitle>
            <CardDescription>
              Any special instructions or requirements
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="specialInstructions">Special Instructions</Label>
              <Textarea
                id="specialInstructions"
                placeholder="Any special handling instructions, contact preferences, or additional details..."
                value={formData.specialInstructions}
                onChange={(e) =>
                  handleInputChange("specialInstructions", e.target.value)
                }
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Submit Actions */}
        <div className="flex gap-4">
          <Button type="submit" disabled={isLoading} className="flex-1">
            {isLoading ? "Creating Request..." : "Post Request"}
          </Button>
          <Link href="/dashboard/requests">
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </Link>
        </div>
      </form>
    </div>
  );
}
