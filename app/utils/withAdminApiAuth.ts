import { NextResponse, NextRequest } from 'next/server';
import { adminAuth } from '@/admin.firebase.server';

export type tParams = Promise<{ id: string }>;

export type ApiHandler = (
  request: NextRequest,
  context: { params: tParams }
) => Promise<NextResponse>;

export function withAdminApiAuth(handler: ApiHandler): ApiHandler {
  return async (request: Request, context: { params: tParams }) => {
    try {
      const authHeader = request.headers.get('Authorization');
      if (!authHeader?.startsWith('Bearer ')) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }

      const idToken = authHeader.split('Bearer ')[1];
      await adminAuth.verifyIdToken(idToken);

      return handler(request as NextRequest, context);
    } catch (error) {
      console.error('Admin API auth error:', error);
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  };
} 