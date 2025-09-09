import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Trip from "@/lib/models/Trip";
import User from "@/lib/models/User";
import { withOptionalAuth } from "@/lib/middleware";

// Connect to database
connectDB();

export const GET = withOptionalAuth(
  async (request: NextRequest, context: any, user: any) => {
    try {
      const { searchParams } = new URL(request.url);
      const page = parseInt(searchParams.get("page") || "1");
      const limit = parseInt(searchParams.get("limit") || "10");
      const skip = (page - 1) * limit;

      const trips = await Trip.find({ status: "active" })
        .populate("travelerId", "firstName lastName email studentId")
        .populate("joinedUsers", "firstName lastName email studentId")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

      // Add traveler name for easier access
      const tripsWithNames = trips.map((trip) => ({
        ...trip.toObject(),
        travelerName: `${trip.travelerId.firstName} ${trip.travelerId.lastName}`,
      }));

      const totalTrips = await Trip.countDocuments({ status: "active" });
      const totalPages = Math.ceil(totalTrips / limit);

      return NextResponse.json({
        trips: tripsWithNames,
        totalTrips,
        currentPage: page,
        totalPages,
      });
    } catch (error: any) {
      console.error("Get trips error:", error);
      return NextResponse.json(
        { error: error.message || "Internal server error" },
        { status: 500 }
      );
    }
  }
);
