import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import MembershipRequest from '@/models/MembershipRequest';
import { verifyAdminAuth } from '@/utils/verifyAdminAuth';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const authResult = await verifyAdminAuth();
  if (authResult.error) return authResult.error;

  try {
    await dbConnect();
    const membershipRequest = await MembershipRequest.findById(params.id).lean();

    if (!membershipRequest) {
      return NextResponse.json(
        { error: 'Request not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(membershipRequest);
  } catch (error) {
    console.error('Failed to fetch request:', error);
    return NextResponse.json(
      { error: 'Failed to fetch request' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const authResult = await verifyAdminAuth();
  if (authResult.error) return authResult.error;

  try {
    await dbConnect();
    const body = await request.json();
    const { action } = body;

    const membershipRequest = await MembershipRequest.findById(params.id);

    if (!membershipRequest) {
      return NextResponse.json(
        { error: 'Request not found' },
        { status: 404 }
      );
    }

    if (action === 'approve') {
      membershipRequest.isApproved = true;
      membershipRequest.softDeleted = false;
    } else if (action === 'update') {
      membershipRequest.isApproved = false;
      membershipRequest.softDeleted = true;
      membershipRequest.lastModifiedBy = authResult.decodedToken.email;
      // Store notes in a way that makes sense for your application
      // You might want to add a notes field to your schema
    }

    await membershipRequest.save();
    return NextResponse.json(membershipRequest);
  } catch (error) {
    console.error('Failed to update request:', error);
    return NextResponse.json(
      { error: 'Failed to update request' },
      { status: 500 }
    );
  }
} 