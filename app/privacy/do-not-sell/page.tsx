"use client";

import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import NextLink from "next/link";

export default function DoNotSellPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    comments: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // TODO: Implement the API endpoint for handling opt-out requests
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulated API call
      
      toast({
        title: "Request Submitted",
        description: "We have received your request and will process it shortly.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      setFormData({
        fullName: "",
        email: "",
        phone: "",
        comments: "",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error submitting your request. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container maxW="4xl" py={8}>
      <VStack spacing={6} align="stretch">
        <Heading as="h1" size="xl" mb={4}>
          Do Not Sell My Personal Information
        </Heading>

        <Text color="gray.600">
          Last updated: {new Date().toLocaleDateString()}
        </Text>

        <Box>
          <Text mb={4}>
            Under the California Consumer Privacy Act (CCPA), you have the right to opt-out of the sale of your personal information. This form allows you to submit your request to opt-out.
          </Text>
        </Box>

        <Box as="form" onSubmit={handleSubmit}>
          <VStack spacing={4} align="stretch">
            <FormControl isRequired>
              <FormLabel>Full Name</FormLabel>
              <Input
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Enter your full name"
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Email Address</FormLabel>
              <Input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email address"
              />
            </FormControl>

            <FormControl>
              <FormLabel>Phone Number</FormLabel>
              <Input
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter your phone number (optional)"
              />
            </FormControl>

            <FormControl>
              <FormLabel>Additional Comments</FormLabel>
              <Textarea
                name="comments"
                value={formData.comments}
                onChange={handleChange}
                placeholder="Enter any additional comments or concerns"
                rows={4}
              />
            </FormControl>

            <Button
              type="submit"
              colorScheme="blue"
              size="lg"
              isLoading={isSubmitting}
              loadingText="Submitting"
              mt={4}
            >
              Submit Opt-Out Request
            </Button>
          </VStack>
        </Box>

        <Box mt={8}>
          <Text fontWeight="bold" mb={2}>
            What Happens Next?
          </Text>
          <Text mb={4}>
            After submitting your request:
          </Text>
          <Text>
            1. We will verify your identity to protect your privacy<br />
            2. You will receive a confirmation email within 24 hours<br />
            3. We will process your request within 45 days<br />
            4. We will notify you once your request has been completed
          </Text>
        </Box>

        <Button
          as={NextLink}
          href="/privacy/ccpa"
          variant="outline"
          mt={4}
        >
          Return to CCPA Rights Information
        </Button>
      </VStack>
    </Container>
  );
} 