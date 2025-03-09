import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminAuth } from './verifyAdminAuth';

type RouteParams = Record<string, string | string[]>;

type ApiHandler = (
  req: NextRequest,
  context: { params: RouteParams },
  token: string
) => Promise<NextResponse>;

export function withAdminApiAuth(handler: ApiHandler) {
  return async (req: NextRequest, context: { params: RouteParams }) => {
    const authResult = await verifyAdminAuth();

    if (authResult.error) {
      return authResult.error;
    }

    try {
      return await handler(req, context, authResult.decodedToken.uid);
    } catch (error) {
      console.error('API error:', error);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  };
} 