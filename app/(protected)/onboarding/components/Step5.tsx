// app/(protected)/onboarding/components/Step5.tsx
"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  VStack,
  Text,
  Button,
  HStack,
  Box,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Spinner,
  Center,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import useMembershipRequest from "../hooks/useMembershipRequest";

interface Step5Props {
  back: () => void;
}

export default function Step5({ back }: Step5Props) {
  const router = useRouter();
  const { submitMembershipRequest } = useMembershipRequest();
  const [submissionStatus, setSubmissionStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [submissionError, setSubmissionError] = useState<string>("");
  const submittedRef = useRef(false);

  // This runs outside of useEffect to avoid double-triggering in React strict mode
  const handleInitialSubmit = async () => {
    // Return early if already submitted
    if (submittedRef.current) return;
    
    // Immediately mark as submitted to prevent concurrent calls
    submittedRef.current = true;
    setSubmissionStatus("submitting");

    try {
      // Add a small delay to ensure submittedRef is updated
      await new Promise(resolve => setTimeout(resolve, 10));
      console.log("Submitting membership request - has been submitted:", submittedRef.current);
      
      await submitMembershipRequest();
      setSubmissionStatus("success");
    } catch (error) {
      // If error occurs, allow resubmission
      setSubmissionStatus("error");
      if (error instanceof Error) {
        setSubmissionError(error.message);
      } else {
        setSubmissionError("An unexpected error occurred");
      }
    }
  };

  // Call immediately and only once
  useEffect(() => {
    handleInitialSubmit();
    // Empty dependency array - runs only on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (submissionStatus === "idle" || submissionStatus === "submitting") {
    return (
      <Center minH="400px">
        <VStack spacing={4}>
          <Spinner size="xl" />
          <Text>Submitting your membership request...</Text>
        </VStack>
      </Center>
    );
  }

  if (submissionStatus === "success") {
    return (
      <Box textAlign="center" py={10} px={6}>
        <Alert
          status="success"
          variant="subtle"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          textAlign="center"
          height="200px"
          borderRadius="md"
        >
          <AlertIcon boxSize="40px" mr={0} />
          <AlertTitle mt={4} mb={1} fontSize="lg">
            Membership Request Submitted!
          </AlertTitle>
          <AlertDescription maxWidth="sm">
            Thank you for completing the onboarding process. Your membership request has been submitted successfully.
          </AlertDescription>
        </Alert>
        <Button 
          mt={8} 
          colorScheme="blue" 
          size="lg" 
          onClick={() => router.push("/member")}
        >
          Go to Dashboard
        </Button>
      </Box>
    );
  }

  return (
    <Box textAlign="center" py={10} px={6}>
      <Alert
        status="error"
        variant="subtle"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        textAlign="center"
        height="200px"
        borderRadius="md"
      >
        <AlertIcon boxSize="40px" mr={0} />
        <AlertTitle mt={4} mb={1} fontSize="lg">
          Submission Failed
        </AlertTitle>
        <AlertDescription maxWidth="sm">
          {submissionError}
        </AlertDescription>
      </Alert>
      <HStack spacing={4} justify="center" mt={8}>
        <Button variant="outline" onClick={back}>
          Back
        </Button>
        <Button 
          colorScheme="blue" 
          onClick={() => {
            submittedRef.current = false;
            setSubmissionStatus("idle");
            handleInitialSubmit();
          }}
        >
          Try Again
        </Button>
      </HStack>
    </Box>
  );
}
