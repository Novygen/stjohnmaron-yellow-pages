import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY_ADMIN,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN_ADMIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID_ADMIN,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET_ADMIN,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID_ADMIN,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID_ADMIN,
};

const app = initializeApp(firebaseConfig, "admin-client");
export default app;
export const auth = getAuth(app);
