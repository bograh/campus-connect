import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/lib/models/User";
import { withAuth } from "@/lib/middleware";

// Connect to database
connectDB();

export const PUT = withAuth(
  async (request: NextRequest, context: any, user: any) => {
    try {
      const body = await request.json();
      const {
        firstName,
        lastName,
        gender,
        indexNumber,
        programmeOfStudy,
        currentYear,
      } = body;

      const updateData: any = {};

      if (firstName !== undefined) updateData.firstName = firstName;
      if (lastName !== undefined) updateData.lastName = lastName;
      if (gender !== undefined) updateData.gender = gender;
      if (indexNumber !== undefined) updateData.indexNumber = indexNumber;
      if (programmeOfStudy !== undefined)
        updateData.programmeOfStudy = programmeOfStudy;
      if (currentYear !== undefined) updateData.currentYear = currentYear;

      const updatedUser = await User.findByIdAndUpdate(
        user.userId,
        updateData,
        { new: true, runValidators: true }
      ).select("-password");

      if (!updatedUser) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      return NextResponse.json({
        message: "Profile updated successfully",
        user: {
          id: updatedUser._id,
          firstName: updatedUser.firstName,
          lastName: updatedUser.lastName,
          email: updatedUser.email,
          studentId: updatedUser.studentId,
          verificationStatus: updatedUser.verificationStatus,
          gender: updatedUser.gender,
          indexNumber: updatedUser.indexNumber,
          programmeOfStudy: updatedUser.programmeOfStudy,
          currentYear: updatedUser.currentYear,
        },
      });
    } catch (error: any) {
      console.error("Update profile error:", error);
      return NextResponse.json(
        { error: error.message || "Internal server error" },
        { status: 500 }
      );
    }
  }
);
