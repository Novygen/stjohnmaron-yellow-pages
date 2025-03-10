import { NextResponse } from 'next/server';
import { adminAuth } from '@/admin.firebase.server';

export type RouteParams = {
  params: {
    [key: string]: string | string[];
  };
  searchParams: { [key: string]: string | string[] | undefined };
};

export type ApiHandler = (
  request: Request,
  context: RouteParams
) => Promise<NextResponse>;

export function withAdminApiAuth(handler: ApiHandler): ApiHandler {
  return async (request: Request, context: RouteParams) => {
    try {
      const authHeader = request.headers.get('Authorization');
      if (!authHeader?.startsWith('Bearer ')) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }

      const idToken = authHeader.split('Bearer ')[1];
      await adminAuth.verifyIdToken(idToken);

      return handler(request, context);
    } catch (error) {
      console.error('Admin API auth error:', error);
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  };
} 