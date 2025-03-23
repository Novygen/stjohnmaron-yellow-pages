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
import { FcGoogle } from "react-icons/fc";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { toast } from "react-hot-toast";
import { FirebaseError } from "firebase/app";

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);

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
    
    if (!acceptTerms) {
      toast.error("Please accept the terms and conditions");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    setIsLoading(true);
    
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const token = await user.getIdToken();
      
      dispatch(setUser({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        token
      }));

      toast.promise(checkMembershipStatus(user.uid), {
        loading: 'Creating your account...',
        success: (submitted: boolean) => {
          router.push(submitted ? "/member" : "/onboarding");
          return 'Account created successfully!';
        },
        error: 'Failed to create account'
      });
    } catch (error: unknown) {
      let errorMessage = 'An error occurred during sign up';
      
      if (error instanceof FirebaseError) {
        switch (error.code) {
          case 'auth/email-already-in-use':
            errorMessage = 'User already exists. Please sign in instead.';
            break;
          case 'auth/invalid-email':
            errorMessage = 'Invalid email address';
            break;
          case 'auth/weak-password':
            errorMessage = 'Password is too weak';
            break;
        }
      }
      
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    if (!acceptTerms) {
      toast.error("Please accept the terms and conditions");
      return;
    }

    setIsLoading(true);
    
    try {
      // First check if a user with this email already exists
      const provider = new GoogleAuthProvider();
      
      try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        const token = await user.getIdToken();
        const isNewUser = result.user.metadata.creationTime === result.user.metadata.lastSignInTime;
        
        if (!isNewUser) {
          // User already exists, show a message but still log them in
          toast.success('User already exists. Signing you in...');
          dispatch(setUser({
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            token
          }));
          
          // Check membership status and redirect appropriately
          toast.promise(checkMembershipStatus(user.uid), {
            loading: 'Checking your account...',
            success: (submitted: boolean) => {
              router.push(submitted ? "/member" : "/onboarding");
              return 'Welcome back!';
            },
            error: 'Failed to check account status'
          });
        } else {
          // New user - continue with sign up flow
          dispatch(setUser({
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            token
          }));

          toast.promise(checkMembershipStatus(user.uid), {
            loading: 'Creating your account...',
            success: (submitted: boolean) => {
              router.push(submitted ? "/dashboard" : "/onboarding");
              return 'Account created successfully!';
            },
            error: 'Failed to create account'
          });
        }
      } catch (error) {
        throw error;
      }
    } catch (error: unknown) {
      let errorMessage = 'An error occurred during sign up';
      
      if (error instanceof FirebaseError) {
        switch (error.code) {
          case 'auth/account-exists-with-different-credential':
            errorMessage = 'User already exists with a different sign-in method. Please use your original sign-in method.';
            break;
          case 'auth/popup-closed-by-user':
            errorMessage = 'Sign up cancelled';
            break;
        }
      }
      
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen">
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">
              Create your account
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Already have an account?{' '}
              <Link href="/sign-in" className="font-medium text-blue-600 hover:text-blue-500">
                Sign in
              </Link>
            </p>
          </div>

          <button
            type="button"
            onClick={handleGoogleSignUp}
            disabled={isLoading}
            className="relative w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg text-base font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FcGoogle className="w-5 h-5" />
            Continue with Google
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>

          <form onSubmit={handleEmailSignUp} className="mt-8 space-y-6">
            <div className="space-y-4 rounded-md">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="you@example.com"
                  disabled={isLoading}
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="••••••••"
                  disabled={isLoading}
                />
              </div>

              <div>
                <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">
                  Confirm password
                </label>
                <input
                  id="confirm-password"
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="••••••••"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="flex items-center">
              <input
                id="accept-terms"
                type="checkbox"
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                disabled={isLoading}
              />
              <label htmlFor="accept-terms" className="ml-2 block text-sm text-gray-900">
                I agree to the{' '}
                <Link href="/terms" className="font-medium text-blue-600 hover:text-blue-500">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link href="/privacy" className="font-medium text-blue-600 hover:text-blue-500">
                  Privacy Policy
                </Link>
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <AiOutlineLoading3Quarters className="w-5 h-5 animate-spin" />
              ) : (
                'Create account'
              )}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
