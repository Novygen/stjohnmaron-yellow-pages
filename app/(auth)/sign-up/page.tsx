"use client";

import { FormEvent, useState } from "react";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "@/firebase"; // Adjust to your path
import { useAppDispatch } from "@/hooks/useAppDispatch"; // Adjust to your path
import { setUser } from "@/store/slices/userSlice"; // Adjust to your path
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export default function SignUpPage() {
  // Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  // TODO: If you want a "remember me" or additional states, add them here

  const dispatch = useAppDispatch();
  const router = useRouter();

  // Handle Email/Password sign up
  const handleEmailSignUp = async (e: FormEvent) => {
    e.preventDefault();

    // Optional check for confirm password
    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      dispatch(
        setUser({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
        })
      );
      // Navigate to your onboarding flow
      router.push("/onboarding");
    } catch (error) {
      alert(error);
    }
  };

  // Handle Google sign up
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
        })
      );
      router.push("/onboarding");
    } catch (error) {
      alert(error);
    }
  };

  return (
    <main className="flex flex-col md:flex-row min-h-screen">
      {/* LEFT SECTION (Blue area with heading/illustration) */}
      <div className="flex-1 bg-[#bbbfbe] text-white flex flex-col justify-center p-8">
        <div className="max-w-md mx-auto">
          <h1 className="text-2xl font-bold mb-4">
            St John Maron | Member Platform
          </h1>
          <h2 className="text-xl mb-6">
            Your place to network.
            <br />
            Explore. Connect
          </h2>
          {/* You can insert an image or illustration below */}
          <Image
               src="/sign_up.svg"
               alt="Board Illustration"
               width={400}
               height={300}
             />
          <p className="mt-6 text-sm opacity-90">
            Build and manager your profile. Connect with fellow members.
          </p>
        </div>
      </div>

      {/* RIGHT SECTION (Sign Up Form) */}
      <div className="flex-1 bg-gray-50 flex items-center justify-center p-8">
        <form
          onSubmit={handleEmailSignUp}
          className="w-full max-w-sm bg-white p-6 rounded shadow"
        >
          <h2 className="text-xl font-bold mb-4">Join our Member Platform</h2>

          {/* Google SSO */}
          <button
            type="button"
            onClick={handleGoogleSignUp}
            className="w-full bg-blue-500 text-white py-2 rounded mb-6 hover:bg-blue-600 transition-colors"
          >
            Continue with Google
          </button>

          {/* Divider */}
          <div className="text-center text-gray-400 text-sm mb-4">OR</div>

          {/* Email */}
          <label className="block mb-1 text-gray-700 text-sm">Email Address</label>
          <input
            type="email"
            className="mb-4 w-full p-2 border border-gray-300 rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
          />

          {/* Password */}
          <label className="block mb-1 text-gray-700 text-sm">Password</label>
          <input
            type="password"
            className="mb-4 w-full p-2 border border-gray-300 rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="********"
            required
          />

          {/* Confirm Password (optional but matches the wireframe) */}
          <label className="block mb-1 text-gray-700 text-sm">
            Confirm Password
          </label>
          <input
            type="password"
            className="mb-4 w-full p-2 border border-gray-300 rounded"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="********"
            required
          />

          {/* Remember Me */}
          <div className="flex items-center justify-between mb-4">
            <label className="flex items-center text-sm">
              <input type="checkbox" className="mr-2" />
              Remember me
            </label>
            <Link href="/sign-in" className="text-blue-600 text-sm">
              Have an account?
            </Link>
          </div>
         

          {/* Submit */}
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
