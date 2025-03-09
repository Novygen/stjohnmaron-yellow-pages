// app/(protected)/onboarding/components/Step5.tsx
"use client";

import React, { useEffect, useCallback } from "react";
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
  const [submissionStatus, setSubmissionStatus] = React.useState<"idle" | "submitting" | "success" | "error">("idle");
  const [submissionError, setSubmissionError] = React.useState<string>("");

  const submitRequest = useCallback(async () => {
    if (submissionStatus !== "idle") return;
    
    setSubmissionStatus("submitting");
    try {
      await submitMembershipRequest();
      setSubmissionStatus("success");
    } catch (error) {
      setSubmissionStatus("error");
      if (error instanceof Error) {
        setSubmissionError(error.message);
      } else {
        setSubmissionError("An unexpected error occurred");
      }
    }
  }, [submitMembershipRequest, submissionStatus]);

  useEffect(() => {
    submitRequest();
  }, [submitRequest]);

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
            setSubmissionStatus("idle");
            submitRequest();
          }}
        >
          Try Again
        </Button>
      </HStack>
    </Box>
  );
}
