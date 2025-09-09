import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import DeliveryRequest from "@/lib/models/DeliveryRequest";
import Trip from "@/lib/models/Trip";
import { withAuth } from "@/lib/middleware";

// Connect to database
connectDB();

export const DELETE = withAuth(
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
          { error: "Only the trip traveler can cancel delivery offer" },
          { status: 403 }
        );
      }

      // Check if request is matched with this trip
      if (deliveryRequest.matchedTripId?.toString() !== tripId) {
        return NextResponse.json(
          { error: "Delivery request is not matched with this trip" },
          { status: 409 }
        );
      }

      // Update delivery request status back to pending
      deliveryRequest.status = "pending";
      deliveryRequest.matchedTripId = undefined;
      await deliveryRequest.save();

      // Remove request from trip's matched requests
      trip.matchedRequests = trip.matchedRequests.filter(
        (id) => id.toString() !== deliveryRequestId
      );
      trip.currentDeliveries = Math.max(0, trip.currentDeliveries - 1);
      await trip.save();

      return NextResponse.json({
        message: "Delivery offer cancelled successfully",
      });
    } catch (error: any) {
      console.error("Cancel delivery offer error:", error);
      return NextResponse.json(
        { error: error.message || "Internal server error" },
        { status: 500 }
      );
    }
  }
);
