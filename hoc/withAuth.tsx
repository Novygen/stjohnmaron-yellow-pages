/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase";

const withAuth = (Component: React.FC) => {
  return function AuthWrapper(props: any) {
    const router = useRouter();
    const [user, loading] = useAuthState(auth);

    useEffect(() => {
      if (!loading && !user) {
        router.push("/sign-in");
      }
    }, [user, loading, router]);

    if (loading || !user) return <div>Loading...</div>;

    return <Component {...props} />;
  };
};

export default withAuth;
