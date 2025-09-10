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
      const {
        fromLocation,
        toLocation,
        departureDate,
        departureTime,
        availableSeats,
        pricePerDelivery,
        vehicleType,
        description,
        contactInfo,
      } = body;

      // Validate required fields
      if (
        !fromLocation ||
        !toLocation ||
        !departureDate ||
        !departureTime ||
        !availableSeats ||
        !pricePerDelivery ||
        !vehicleType
      ) {
        return NextResponse.json(
          { error: "Missing required fields" },
          { status: 400 }
        );
      }

      // Create departure time from date and time
      const departureDateTime = new Date(
        `${departureDate}T${departureTime}:00`
      );

      // Create trip
      const trip = new Trip({
        travelerId: user.userId,
        fromLocation,
        toLocation,
        departureTime: departureDateTime,
        transportMethod: vehicleType,
        maxDeliveries: availableSeats,
        currentDeliveries: 0,
        pricePerDelivery,
        isRecurring: false,
        status: "active",
        matchedRequests: [],
        joinedUsers: [],
      });

      await trip.save();

      // Populate the trip with user data
      await trip.populate("travelerId", "firstName lastName email studentId");

      return NextResponse.json(
        {
          message: "Trip created successfully",
          trip: {
            ...trip.toObject(),
            travelerName: `${trip.travelerId.firstName} ${trip.travelerId.lastName}`,
          },
        },
        { status: 201 }
      );
    } catch (error: any) {
      console.error("Create trip error:", error);
      return NextResponse.json(
        { error: error.message || "Internal server error" },
        { status: 500 }
      );
    }
  }
);
