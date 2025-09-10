import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import DeliveryRequest from "@/lib/models/DeliveryRequest";
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

      const deliveryRequests = await DeliveryRequest.find({ status: "pending" })
        .populate("userId", "firstName lastName email studentId")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

      // Add requester name for easier access
      const requestsWithNames = deliveryRequests.map((request) => ({
        ...request.toObject(),
        requesterName: `${request.userId.firstName} ${request.userId.lastName}`,
      }));

      const totalRequests = await DeliveryRequest.countDocuments({
        status: "pending",
      });
      const totalPages = Math.ceil(totalRequests / limit);

      return NextResponse.json({
        deliveryRequests: requestsWithNames,
        totalRequests,
        currentPage: page,
        totalPages,
      });
    } catch (error: any) {
      console.error("Get delivery requests error:", error);
      return NextResponse.json(
        { error: error.message || "Internal server error" },
        { status: 500 }
      );
    }
  }
);
