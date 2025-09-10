import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import DeliveryRequest from "@/lib/models/DeliveryRequest";
import Trip from "@/lib/models/Trip";
import { withAuth } from "@/lib/middleware";

// Connect to database
connectDB();

export const POST = withAuth(
  async (request: NextRequest, context: any, user: any) => {
    try {
      const body = await request.json();
      const { deliveryRequestId, tripId } = body;

      if (!deliveryRequestId || !tripId) {
        return NextResponse.json(
          { error: "Delivery request ID and trip ID are required" },
          { status: 400 }
        );
      }

      // Find the delivery request
      const deliveryRequest = await DeliveryRequest.findById(deliveryRequestId);
      if (!deliveryRequest) {
        return NextResponse.json(
          { error: "Delivery request not found" },
          { status: 404 }
        );
      }

      // Find the trip
      const trip = await Trip.findById(tripId);
      if (!trip) {
        return NextResponse.json({ error: "Trip not found" }, { status: 404 });
      }

      // Check if user is the traveler
      if (trip.travelerId.toString() !== user.userId) {
        return NextResponse.json(
          { error: "Only the trip traveler can offer delivery service" },
          { status: 403 }
        );
      }

      // Check if trip has available space
      if (trip.currentDeliveries >= trip.maxDeliveries) {
        return NextResponse.json({ error: "Trip is full" }, { status: 409 });
      }

      // Check if request is already matched
      if (deliveryRequest.status !== "pending") {
        return NextResponse.json(
          { error: "Delivery request is already matched" },
          { status: 409 }
        );
      }

      // Update delivery request status and match with trip
      deliveryRequest.status = "matched";
      deliveryRequest.matchedTripId = tripId;
      await deliveryRequest.save();

      // Add request to trip's matched requests
      trip.matchedRequests.push(deliveryRequestId);
      trip.currentDeliveries += 1;
      await trip.save();

      return NextResponse.json({
        message: "Delivery offer made successfully",
      });
    } catch (error: any) {
      console.error("Offer delivery error:", error);
      return NextResponse.json(
        { error: error.message || "Internal server error" },
        { status: 500 }
      );
    }
  }
);
