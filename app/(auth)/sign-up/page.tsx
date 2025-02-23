// app/(auth)/sign-up/page.tsx
"use client";

import { FormEvent, useState } from "react";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "@/firebase";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { setUser } from "@/store/slices/userSlice";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

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

  const handleEmailSignUp = async (e: FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      dispatch(
        setUser({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          token: await user.getIdToken(),
        })
      );
      const submitted = await checkMembershipStatus(user.uid);
      router.push(submitted ? "/dashboard" : "/onboarding");
    } catch (error) {
      alert(error);
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      dispatch(
        setUser({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          token: await user.getIdToken(),
        })
      );
      const submitted = await checkMembershipStatus(user.uid);
      router.push(submitted ? "/dashboard" : "/onboarding");
    } catch (error) {
      alert(error);
    }
  };

  return (
    <main className="flex flex-col md:flex-row min-h-screen">
      <div className="flex-1 bg-[#bbbfbe] text-white flex flex-col justify-center p-8">
        <div className="max-w-md mx-auto">
          <h1 className="text-2xl font-bold mb-4">St John Maron | Member Platform</h1>
          <h2 className="text-xl mb-6">
            Your place to network.
            <br />
            Explore. Connect
          </h2>
          <Image src="/sign_up.svg" alt="Board Illustration" width={400} height={300} />
          <p className="mt-6 text-sm opacity-90">
            Build and manage your profile. Connect with fellow members.
          </p>
        </div>
      </div>
      <div className="flex-1 bg-gray-50 flex items-center justify-center p-8">
        <form onSubmit={handleEmailSignUp} className="w-full max-w-sm bg-white p-6 rounded shadow">
          <h2 className="text-xl font-bold mb-4">Join our Member Platform</h2>
          <button
            type="button"
            onClick={handleGoogleSignUp}
            className="w-full bg-blue-500 text-white py-2 rounded mb-6 hover:bg-blue-600 transition-colors"
          >
            Continue with Google
          </button>
          <div className="text-center text-gray-400 text-sm mb-4">OR</div>
          <label className="block mb-1 text-gray-700 text-sm">Email Address</label>
          <input
            type="email"
            className="mb-4 w-full p-2 border border-gray-300 rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
          />
          <label className="block mb-1 text-gray-700 text-sm">Password</label>
          <input
            type="password"
            className="mb-4 w-full p-2 border border-gray-300 rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="********"
            required
          />
          <label className="block mb-1 text-gray-700 text-sm">Confirm Password</label>
          <input
            type="password"
            className="mb-4 w-full p-2 border border-gray-300 rounded"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="********"
            required
          />
          <div className="flex items-center justify-between mb-4">
            <label className="flex items-center text-sm">
              <input type="checkbox" className="mr-2" />
              Remember me
            </label>
            <Link href="/sign-in" className="text-blue-600 text-sm">
              Have an account?
            </Link>
          </div>
          <button
            type="submit"
            className="bg-green-600 text-white w-full py-2 rounded hover:bg-green-700 transition-colors"
          >
            Sign Up
          </button>
        </form>
      </div>
    </main>
  );
}
