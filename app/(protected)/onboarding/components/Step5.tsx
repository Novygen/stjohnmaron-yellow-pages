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
  const [errorType, setErrorType] = useState<"employment" | "validation" | "network" | "unknown">("unknown");
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

    // Add a safety timeout to exit loading state after 10 seconds
    const safetyTimer = setTimeout(() => {
      if (isUnmountedRef.current) return;
      
      if (submissionStatus === "submitting") {
        console.warn("Submission has been in loading state for too long - forcing completion");
        setSubmissionStatus("success");
      }
    }, 10000);

    const submitRequest = async () => {
      try {
        console.log("Executing API call");
        const response = await submitMembershipRequest();
        
        // If component is unmounted, don't update state
        if (isUnmountedRef.current) {
          console.log("Component unmounted, skipping state update");
          return;
        }
        
        // Check if the response exists and is successful
        if (response) {
          console.log("API response successful:", response);
          setSubmissionStatus("success");
        } else {
          // Handle empty success response (should not normally happen)
          console.warn("Empty success response, but no error thrown");
          setSubmissionStatus("success");
        }
      } catch (error) {
        // If component is unmounted, don't update state
        if (isUnmountedRef.current) {
          console.log("Component unmounted, skipping error state update");
          return;
        }
        
        console.error("Error submitting:", error);
        setSubmissionStatus("error");
        
        let message = "An unexpected error occurred";
        let type: "employment" | "validation" | "network" | "unknown" = "unknown";
        
        if (error instanceof Error) {
          message = error.message;
          
          // Determine error type based on error message content
          if (message.includes("employmentStatus") || 
              message.includes("employment status") || 
              message.includes("Employment status") ||
              message.includes("Employment details") ||
              message.includes("employment details") ||
              message.includes("Employed")) {
            type = "employment";
          } 
          else if (message.includes("business") || 
                  message.includes("Business") || 
                  message.includes("business owner")) {
            type = "employment";
            message = "Business information is required when selecting 'Business Owner'. Please go back and provide business details.";
          }
          else if (message.includes("validation") || message.includes("required") || message.includes("missing")) {
            type = "validation";
          }
          else if (message.includes("network") || message.includes("fetch") || message.includes("connection")) {
            type = "network";
          }
        }
        
        setSubmissionError(message);
        setErrorType(type);
      }
    };

    // Ensure we always exit loading state, even if there's an unhandled error
    submitRequest().catch(err => {
      console.error("Uncaught error in submitRequest:", err);
      // Always make sure we exit loading state
      if (!isUnmountedRef.current) {
        setSubmissionStatus("error");
        setSubmissionError(err instanceof Error ? err.message : "An unexpected error occurred during submission. Please try again.");
        setErrorType("unknown");
      }
    }).finally(() => {
      // Clear the safety timer since we're done with the submission
      clearTimeout(safetyTimer);
    });
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
        
        let message = "An unexpected error occurred";
        let type: "employment" | "validation" | "network" | "unknown" = "unknown";
        
        if (error instanceof Error) {
          message = error.message;
          
          // Determine error type based on error message content
          if (message.includes("employmentStatus") || 
              message.includes("employment status") || 
              message.includes("Employment status") ||
              message.includes("Employment details") ||
              message.includes("employment details") ||
              message.includes("Employed")) {
            type = "employment";
          } 
          else if (message.includes("business") || 
                  message.includes("Business") || 
                  message.includes("business owner")) {
            type = "employment";
            message = "Business information is required when selecting 'Business Owner'. Please go back and provide business details.";
          }
          else if (message.includes("validation") || message.includes("required")) {
            type = "validation";
          }
          else if (message.includes("network") || message.includes("fetch") || message.includes("connection")) {
            type = "network";
          }
          
          setSubmissionError(message);
        } else {
          setSubmissionError("An unexpected error occurred");
        }
        
        setErrorType(type);
      }
    };
    
    // Ensure we always exit loading state, even if there's an unhandled error
    retrySubmission().catch(err => {
      console.error("Uncaught error in retrySubmission:", err);
      if (!isUnmountedRef.current) {
        setSubmissionStatus("error");
        setSubmissionError("An unexpected error occurred. Please try again.");
      }
    });
  };

  const handleGoToStep = (step: number) => {
    // Reset submission state
    submittedRef.current = false;
    
    // Go back multiple steps
    for (let i = 0; i < step; i++) {
      back();
    }
  };

  const handleGoToEmploymentSection = () => {
    // Reset submission state
    submittedRef.current = false;
    
    // Navigate to professional info step (step 2)
    handleGoToStep(3);
  };

  const handleNavigateToRelevantSection = () => {
    // Navigate based on error type and message
    if (errorType === "employment") {
      if (submissionError.includes("business") || submissionError.includes("Business")) {
        console.log("Navigating to business owner section");
        handleGoToEmploymentSection();
      } else {
        console.log("Navigating to employment section");
        handleGoToEmploymentSection();
      }
    } else {
      // Generic fallback
      handleGoToStep(1);
    }
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
        minHeight="200px"
        borderRadius="md"
      >
        <AlertIcon boxSize="40px" mr={0} />
        <AlertTitle mt={4} mb={1} fontSize="lg">
          Submission Failed
        </AlertTitle>
        <AlertDescription maxWidth="sm">
          {submissionError}
          
          {errorType === "employment" && (
            <Text mt={2} fontWeight="medium">
              Please go back to the Professional Information page to ensure you&apos;ve selected a valid employment status.
            </Text>
          )}
          
          {errorType === "validation" && (
            <Text mt={2} fontWeight="medium">
              Some required information is missing. Please review your details on previous pages.
            </Text>
          )}
          
          {errorType === "network" && (
            <Text mt={2} fontWeight="medium">
              There was a problem connecting to our servers. Please check your internet connection and try again.
            </Text>
          )}
        </AlertDescription>
      </Alert>
      <VStack spacing={4} mt={8}>
        <HStack spacing={4} justify="center">
          <Button variant="outline" onClick={back}>
            Back to Previous Step
          </Button>
          <Button 
            colorScheme="blue" 
            onClick={handleRetry}
          >
            Try Again
          </Button>
        </HStack>
        
        {errorType === "employment" && (
          <Button 
            colorScheme="blue" 
            variant="ghost"
            onClick={handleNavigateToRelevantSection}
          >
            {submissionError.includes("business") || submissionError.includes("Business") 
              ? "Go to Business Information" 
              : "Go to Professional Information"}
          </Button>
        )}
        
        {errorType === "validation" && (
          <VStack spacing={2}>
            <Text fontSize="sm">Go to specific section:</Text>
            <HStack>
              <Button size="sm" variant="ghost" onClick={() => handleGoToStep(4)}>
                Personal Details
              </Button>
              <Button size="sm" variant="ghost" onClick={() => handleGoToStep(3)}>
                Professional Info
              </Button>
              <Button size="sm" variant="ghost" onClick={() => handleGoToStep(2)}>
                Social Presence
              </Button>
              <Button size="sm" variant="ghost" onClick={() => handleGoToStep(1)}>
                Privacy Settings
              </Button>
            </HStack>
          </VStack>
        )}
      </VStack>
    </Box>
  );
}

