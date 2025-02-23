import { initializeApp, cert, getApps} from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

let app = getApps().find((a) => a.name === 'admin');
if (!app) {
  app = initializeApp({
    credential: cert({
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      clientEmail: process.env.NEXT_PUBLIC_FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.NEXT_PUBLIC_FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
    databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  }, 'admin');
}

export const auth = getAuth(app);