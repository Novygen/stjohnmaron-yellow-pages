'use client';

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase";

// Improved type safety with generic props
const withAuth = <P extends object>(Component: React.ComponentType<P>) => {
  return function AuthWrapper(props: P) {
    const router = useRouter();
    const [user, loading, error] = useAuthState(auth);

    useEffect(() => {
      if (!loading && !user) {
        router.push("/sign-in");
      }
    }, [user, loading, router]);

    // Handle authentication errors
    if (error) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="bg-red-50 p-4 rounded-lg">
            <h3 className="text-red-800 font-medium">Authentication Error</h3>
            <p className="text-red-600">{error.message}</p>
          </div>
        </div>
      );
    }

    // Improved loading state
    if (loading || !user) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      );
    }

    return <Component {...props} />;
  };
};

export default withAuth;
