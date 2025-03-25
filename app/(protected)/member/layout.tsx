"use client";

import { Box } from "@chakra-ui/react";
import MemberNavigation from "@/app/components/MemberNavigation";

export default function MemberLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Box minH="100vh">
      <MemberNavigation />
      <Box as="main" py={8}>
        {children}
      </Box>
    </Box>
  );
} 