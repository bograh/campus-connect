import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Trip from "@/lib/models/Trip";
import { withAuth } from "@/lib/middleware";

// Connect to database
connectDB();

export const POST = withAuth(
  async (request: NextRequest, context: any, user: any) => {
    try {
      const body = await request.json();
      const { tripId } = body;

      if (!tripId) {
        return NextResponse.json(
          { error: "Trip ID is required" },
          { status: 400 }
        );
      }

      const trip = await Trip.findById(tripId);
      if (!trip) {
        return NextResponse.json({ error: "Trip not found" }, { status: 404 });
      }

      // Check if user is already in the trip
      if (trip.joinedUsers.includes(user.userId)) {
        return NextResponse.json(
          { error: "You are already part of this trip" },
          { status: 409 }
        );
      }

      // Check if trip is full
      if (trip.currentDeliveries >= trip.maxDeliveries) {
        return NextResponse.json({ error: "Trip is full" }, { status: 409 });
      }

      // Add user to trip
      trip.joinedUsers.push(user.userId);
      trip.currentDeliveries += 1;
      await trip.save();

      return NextResponse.json({
        message: "Successfully joined trip",
      });
    } catch (error: any) {
      console.error("Join trip error:", error);
      return NextResponse.json(
        { error: error.message || "Internal server error" },
        { status: 500 }
      );
    }
  }
);
