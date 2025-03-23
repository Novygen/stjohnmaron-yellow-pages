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
  const submittedRef = useRef<boolean>(false);
  const isUnmountedRef = useRef<boolean>(false);

  // Set up clean-up function to mark component as unmounted
  useEffect(() => {
    return () => {
      isUnmountedRef.current = true;
    };
  }, []);

  // Submit once on mount
  useEffect(() => {
    // Only proceed if we haven't submitted yet
    if (submittedRef.current) {
      console.log("Already submitted, skipping");
      return;
    }

    console.log("Starting first-time submission");
    submittedRef.current = true;
    setSubmissionStatus("submitting");

    const submitRequest = async () => {
      try {
        console.log("Executing API call");
        const response = await submitMembershipRequest();
        
        setSubmissionStatus("success");
        console.log("API response:", response);
        
        // If component is unmounted, don't update state
        if (isUnmountedRef.current) return;
      } catch (error) {
        // If component is unmounted, don't update state
        if (isUnmountedRef.current) return;
        
        console.error("Error submitting:", error);
        setSubmissionStatus("error");
        
        if (error instanceof Error) {
          setSubmissionError(error.message);
        } else {
          setSubmissionError("An unexpected error occurred");
        }
      }
    };

    // Start the submission process immediately
    submitRequest();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array - run only on mount

  const handleRetry = () => {
    console.log("Retrying submission");
    submittedRef.current = false;
    setSubmissionStatus("submitting");
    
    const retrySubmission = async () => {
      try {
        console.log("Executing retry API call");
        await submitMembershipRequest();
        
        if (isUnmountedRef.current) return;
        
        console.log("Retry successful");
        setSubmissionStatus("success");
      } catch (error) {
        if (isUnmountedRef.current) return;
        
        console.error("Error during retry:", error);
        setSubmissionStatus("error");
        
        if (error instanceof Error) {
          setSubmissionError(error.message);
        } else {
          setSubmissionError("An unexpected error occurred");
        }
      }
    };
    
    retrySubmission();
  };

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
            Thank you for completing the onboarding process. Your membership request has been submitted successfully. Your information will be reviewed and approved before publishing to the directory.
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
          onClick={handleRetry}
        >
          Try Again
        </Button>
      </HStack>
    </Box>
  );
}
