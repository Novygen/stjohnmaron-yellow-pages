// app/(auth)/sign-in/page.tsx
"use client";

import { FormEvent, useState } from "react";
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "@/firebase";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { setUser } from "@/store/slices/userSlice";
import { useRouter } from "next/navigation";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useAppDispatch();
  const router = useRouter();

  const checkMembershipStatus = async (uid: string) => {
    const res = await fetch(`/api/membership-request/status/${uid}`);
    if (!res.ok) {
      throw new Error('Failed to fetch membership status');
    }
    const data = await res.json();
    return data.submitted;
  };

  const handleEmailSignIn = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      dispatch(setUser({ uid: user.uid, email: user.email, displayName: user.displayName }));
      const submitted = await checkMembershipStatus(user.uid);
      router.push(submitted ? "/member" : "/onboarding");
    } catch (error) {
      alert(error);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      dispatch(setUser({ uid: user.uid, email: user.email, displayName: user.displayName }));
      const submitted = await checkMembershipStatus(user.uid);
      router.push(submitted ? "/member" : "/onboarding");
    } catch (error) {
      alert(error);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <form onSubmit={handleEmailSignIn} className="w-full max-w-md bg-white p-6 rounded shadow">
        <h2 className="text-2xl font-semibold mb-4">Sign In to Woorkroom</h2>
        <div className="mb-4">
          <label className="block mb-1">Email Address</label>
          <input
            type="email"
            className="w-full border p-2 rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Password</label>
          <input
            type="password"
            className="w-full border p-2 rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="********"
            required
          />
        </div>
        <button type="submit" className="bg-blue-600 text-white w-full py-2 rounded hover:bg-blue-700">
          Sign In
        </button>
        <hr className="my-4" />
        <button
          type="button"
          onClick={handleGoogleSignIn}
          className="bg-red-500 text-white w-full py-2 rounded hover:bg-red-600"
        >
          Sign In with Google
        </button>
      </form>
    </div>
  );
}
