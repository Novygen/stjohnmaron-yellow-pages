import { NextResponse } from 'next/server';
import { withAdminApiAuth } from '@/utils/withAdminApiAuth';
import MembershipRequest from '@/models/MembershipRequest';
import dbConnect from '@/lib/dbConnect';

async function handler() {
  await dbConnect();

  try {
    const requests = await MembershipRequest.find()
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(requests);
  } catch (error) {
    console.error('Error fetching requests:', error);
    return NextResponse.json(
      { error: 'Failed to fetch requests' },
      { status: 500 }
    );
  }
}

export const GET = withAdminApiAuth(handler); 