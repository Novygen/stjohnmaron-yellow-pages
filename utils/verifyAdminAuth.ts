import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { adminAuth } from '@/admin.firebase.server';

export async function verifyAdminAuth() {
  try {
    const headersList = await headers();
    const authorization = headersList.get('authorization') || headersList.get('Authorization') || '';

    if (!authorization.startsWith('Bearer ')) {
      return {
        error: new NextResponse('Unauthorized', { status: 401 }),
      };
    }

    const idToken = authorization.split(' ')[1];
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    
    return { decodedToken };
  } catch (error) {
    console.error('Auth error:', error);
    return {
      error: new NextResponse('Unauthorized', { status: 401 }),
    };
  }
} 