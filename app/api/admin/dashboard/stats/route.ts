import { NextResponse } from "next/server";
import { withAdminApiAuth, tParams } from "@/app/utils/withAdminApiAuth";
import Member from "@/models/Member";
import MembershipRequest from "@/models/MembershipRequest";
import dbConnect from "@/lib/dbConnect";

// Parameters are required by the type but not used in this function
// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function getHandler(request: Request, { params }: { params: tParams }) {
  await dbConnect();
  
  try {
    // Get total members count
    const totalMembers = await Member.countDocuments({ status: 'active' });
    
    // Get new members in last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const newMembers = await Member.countDocuments({
      status: 'active',
      createdAt: { $gte: thirtyDaysAgo }
    });

    // Get pending requests count
    const pendingRequests = await MembershipRequest.countDocuments({
      isApproved: false,
      softDeleted: false
    });

    // Get requests requiring updates
    const requestsNeedingUpdates = await MembershipRequest.countDocuments({
      isApproved: false,
      softDeleted: true
    });

    // Get employment type distribution
    const employmentStats = await Member.aggregate([
      { $match: { status: 'active' } },
      { $unwind: '$employments' },
      { $match: { 'employments.isActive': true } },
      {
        $group: {
          _id: '$employments.type',
          count: { $sum: 1 }
        }
      }
    ]);

    // Format employment stats
    const employmentDistribution = employmentStats.reduce((acc, stat) => {
      acc[stat._id] = stat.count;
      return acc;
    }, {} as Record<string, number>);

    // Get recent activity
    const recentActivity = await Promise.all([
      // Recent approved members
      Member.find({ status: 'active' })
        .sort({ createdAt: -1 })
        .limit(5)
        .select('personalDetails.firstName personalDetails.lastName createdAt'),
      
      // Recent pending requests
      MembershipRequest.find({ isApproved: false, softDeleted: false })
        .sort({ createdAt: -1 })
        .limit(5)
        .select('personalDetails.firstName personalDetails.lastName createdAt')
    ]);

    return NextResponse.json({
      overview: {
        totalMembers,
        newMembers,
        pendingRequests,
        requestsNeedingUpdates
      },
      employmentDistribution,
      recentActivity: {
        recentMembers: recentActivity[0],
        recentRequests: recentActivity[1]
      }
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard statistics" },
      { status: 500 }
    );
  }
}

export const GET = withAdminApiAuth(getHandler); 