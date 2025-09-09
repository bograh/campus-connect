import { NextRequest, NextResponse } from "next/server";
import { authenticateRequest } from "@/lib/auth";

export const withAuth = (
  handler: (req: NextRequest, context: any, user: any) => Promise<NextResponse>
) => {
  return async (req: NextRequest, context: any) => {
    const user = authenticateRequest(req);

    if (!user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    return handler(req, context, user);
  };
};

export const withOptionalAuth = (
  handler: (req: NextRequest, context: any, user: any) => Promise<NextResponse>
) => {
  return async (req: NextRequest, context: any) => {
    const user = authenticateRequest(req);
    return handler(req, context, user);
  };
};
