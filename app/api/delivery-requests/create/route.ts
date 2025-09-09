import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import DeliveryRequest from "@/lib/models/DeliveryRequest";
import { withAuth } from "@/lib/middleware";

// Connect to database
connectDB();

export const POST = withAuth(
  async (request: NextRequest, context: any, user: any) => {
    try {
      const body = await request.json();
      const {
        pickupLocation,
        dropoffLocation,
        itemDescription,
        itemSize,
        priority,
        paymentAmount,
        pickupDate,
        pickupTime,
        contactInfo,
        specialInstructions,
      } = body;

      // Validate required fields
      if (
        !pickupLocation ||
        !dropoffLocation ||
        !itemDescription ||
        !itemSize ||
        !paymentAmount ||
        !pickupDate ||
        !pickupTime ||
        !contactInfo
      ) {
        return NextResponse.json(
          { error: "Missing required fields" },
          { status: 400 }
        );
      }

      // Create pickup date from date and time
      const pickupDateTime = new Date(`${pickupDate}T${pickupTime}:00`);

      // Create delivery request
      const deliveryRequest = new DeliveryRequest({
        userId: user.userId,
        pickupLocation,
        dropoffLocation,
        itemDescription,
        itemSize,
        priority: priority || "normal",
        paymentAmount,
        pickupDate: pickupDateTime,
        pickupTime,
        contactInfo,
        specialInstructions: specialInstructions || "",
        status: "pending",
      });

      await deliveryRequest.save();

      return NextResponse.json(
        {
          message: "Delivery request created successfully",
          deliveryRequest,
        },
        { status: 201 }
      );
    } catch (error: any) {
      console.error("Create delivery request error:", error);
      return NextResponse.json(
        { error: error.message || "Internal server error" },
        { status: 500 }
      );
    }
  }
);
