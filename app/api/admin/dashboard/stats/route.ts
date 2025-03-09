/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import dbConnect from "@/lib/mongoose";
import MembershipRequest from "@/models/MembershipRequest";

export async function GET(request: Request) {
  try {
    // Verify admin token
    const decodedToken = await verifyToken(request);
    if (!decodedToken || typeof decodedToken === 'object' && 'error' in decodedToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify admin status
    const customClaims = (decodedToken as any).customClaims || {};
    if (!customClaims.admin) {
      return NextResponse.json({ error: "Not authorized as admin" }, { status: 403 });
    }

    // Connect to database
    await dbConnect();

    // Get total members (approved membership requests)
    const totalMembers = await MembershipRequest.countDocuments({ status: "approved" });

    // Get pending requests
    const pendingRequests = await MembershipRequest.countDocuments({ status: "pending" });

    // For now, return mock data for events and messages
    // TODO: Implement actual event and message counting when those features are added
    const activeEvents = 0;
    const totalMessages = 0;

    return NextResponse.json({
      totalMembers,
      pendingRequests,
      activeEvents,
      totalMessages,
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard stats" },
      { status: 500 }
    );
  }
} 