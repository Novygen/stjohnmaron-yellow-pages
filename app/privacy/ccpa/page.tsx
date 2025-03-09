"use client";

import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  UnorderedList,
  ListItem,
  Link,
  Button,
} from "@chakra-ui/react";
import NextLink from "next/link";

export default function CCPAPage() {
  return (
    <Container maxW="4xl" py={8}>
      <VStack spacing={6} align="stretch">
        <Heading as="h1" size="xl" mb={4}>
          California Consumer Privacy Act (CCPA) Rights
        </Heading>

        <Text color="gray.600">
          Last updated: {new Date().toLocaleDateString()}
        </Text>

        <Box>
          <Text mb={4}>
            Under the California Consumer Privacy Act (CCPA), California residents have specific rights regarding their personal information. This page explains those rights and how to exercise them.
          </Text>
        </Box>

        <Box>
          <Heading as="h2" size="lg" mb={4}>
            Your Rights Under CCPA
          </Heading>
          <UnorderedList spacing={4} pl={4} mb={4}>
            <ListItem>
              <Text fontWeight="bold">Right to Know</Text>
              <Text>You can request information about the personal information we collect, use, disclose, and sell.</Text>
            </ListItem>
            <ListItem>
              <Text fontWeight="bold">Right to Delete</Text>
              <Text>You can request deletion of your personal information, subject to certain exceptions.</Text>
            </ListItem>
            <ListItem>
              <Text fontWeight="bold">Right to Opt-Out</Text>
              <Text>You can opt-out of the sale of your personal information.</Text>
            </ListItem>
            <ListItem>
              <Text fontWeight="bold">Right to Non-Discrimination</Text>
              <Text>We will not discriminate against you for exercising your CCPA rights.</Text>
            </ListItem>
          </UnorderedList>
        </Box>

        <Box>
          <Heading as="h2" size="lg" mb={4}>
            Categories of Information We Collect
          </Heading>
          <UnorderedList spacing={2} pl={4} mb={4}>
            <ListItem>Identifiers (name, email address, phone number)</ListItem>
            <ListItem>Professional information</ListItem>
            <ListItem>Education information</ListItem>
            <ListItem>Internet activity information</ListItem>
            <ListItem>Geolocation data</ListItem>
          </UnorderedList>
        </Box>

        <Box>
          <Heading as="h2" size="lg" mb={4}>
            How to Exercise Your Rights
          </Heading>
          <Text mb={4}>
            To exercise your CCPA rights:
          </Text>
          <UnorderedList spacing={2} pl={4} mb={4}>
            <ListItem>Submit a request through our member portal</ListItem>
            <ListItem>Contact the church administration</ListItem>
            <ListItem>
              Visit our{" "}
              <Link as={NextLink} href="/privacy/do-not-sell" color="blue.500">
                Do Not Sell My Personal Information
              </Link>{" "}
              page
            </ListItem>
          </UnorderedList>
        </Box>

        <Box>
          <Heading as="h2" size="lg" mb={4}>
            Verification Process
          </Heading>
          <Text mb={4}>
            To protect your information, we will verify your identity before responding to your request. We may need additional information to verify your identity.
          </Text>
        </Box>

        <Box>
          <Heading as="h2" size="lg" mb={4}>
            Response Timing
          </Heading>
          <Text mb={4}>
            We will respond to your request within 45 days. If we need more time, we will notify you and may take up to 90 days to respond.
          </Text>
        </Box>

        <Box>
          <Heading as="h2" size="lg" mb={4}>
            Authorized Agent
          </Heading>
          <Text mb={4}>
            You may designate an authorized agent to make requests on your behalf. We will require verification of the agent&apos;s authorization to act on your behalf.
          </Text>
        </Box>

        <VStack spacing={4} align="stretch" mt={8}>
          <Button
            as={NextLink}
            href="/privacy/do-not-sell"
            colorScheme="blue"
            size="lg"
          >
            Do Not Sell My Personal Information
          </Button>
          <Button
            as={NextLink}
            href="/privacy"
            variant="outline"
          >
            Return to Privacy Policy
          </Button>
        </VStack>
      </VStack>
    </Container>
  );
} 