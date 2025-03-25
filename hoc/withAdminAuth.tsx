"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { selectIsAdminAuthenticated } from "@/store/slices/adminSlice";
import { Spinner, Center } from '@chakra-ui/react';

export default function withAdminAuth<P extends object>(
  WrappedComponent: React.ComponentType<P>
) {
  return function WithAdminAuthWrapper(props: P) {
    const router = useRouter();
    const isAuthenticated = useSelector(selectIsAdminAuthenticated);

    useEffect(() => {
      if (!isAuthenticated) {
        router.push("/admin");
      }
    }, [isAuthenticated, router]);

    if (!isAuthenticated) {
      return (
        <Center minH="100vh">
          <Spinner
            thickness="4px"
            speed="0.65s"
            emptyColor="gray.200"
            color="brand.500"
            size="xl"
          />
        </Center>
      );
    }

    return <WrappedComponent {...props} />;
  };
} 