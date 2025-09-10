import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/lib/models/User";
import { withAuth } from "@/lib/middleware";

// Connect to database
connectDB();

export const GET = withAuth(
  async (request: NextRequest, context: any, user: any) => {
    try {
      const userData = await User.findById(user.userId).select("-password");

      if (!userData) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      return NextResponse.json({
        user: {
          id: userData._id,
          firstName: userData.firstName,
          lastName: userData.lastName,
          email: userData.email,
          studentId: userData.studentId,
          verificationStatus: userData.verificationStatus,
          rating: userData.rating,
          totalDeliveries: userData.totalDeliveries,
          profileImage: userData.profileImage,
          gender: userData.gender,
          indexNumber: userData.indexNumber,
          programmeOfStudy: userData.programmeOfStudy,
          currentYear: userData.currentYear,
          phoneNumber: userData.phoneNumber,
          phoneVerified: userData.phoneVerified,
        },
      });
    } catch (error: any) {
      console.error("Get user error:", error);
      return NextResponse.json(
        { error: error.message || "Internal server error" },
        { status: 500 }
      );
    }
  }
);
