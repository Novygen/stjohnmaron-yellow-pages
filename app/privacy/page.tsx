"use client";

import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  UnorderedList,
  ListItem,
  Divider,
  Link,
} from "@chakra-ui/react";
import NextLink from "next/link";

export default function PrivacyPage() {
  return (
    <Container maxW="4xl" py={8}>
      <VStack spacing={6} align="stretch">
        <Heading as="h1" size="xl" mb={4}>
          Privacy Policy
        </Heading>

        <Text color="gray.600">
          Last updated: {new Date().toLocaleDateString()}
        </Text>

        <Box>
          <Heading as="h2" size="lg" mb={4}>
            1. Information We Collect
          </Heading>
          <Text mb={2}>We collect the following types of information:</Text>
          <UnorderedList spacing={2} pl={4} mb={4}>
            <ListItem>Personal information (name, email, phone number)</ListItem>
            <ListItem>Professional information (employment details, business information)</ListItem>
            <ListItem>Directory preferences</ListItem>
            <ListItem>Social media and website links</ListItem>
          </UnorderedList>
        </Box>

        <Box>
          <Heading as="h2" size="lg" mb={4}>
            2. How We Use Your Information
          </Heading>
          <Text mb={2}>Your information is used for:</Text>
          <UnorderedList spacing={2} pl={4} mb={4}>
            <ListItem>Managing your membership</ListItem>
            <ListItem>Providing member directory services</ListItem>
            <ListItem>Communication about church events and updates</ListItem>
            <ListItem>Improving our services</ListItem>
          </UnorderedList>
        </Box>

        <Box>
          <Heading as="h2" size="lg" mb={4}>
            3. Information Sharing
          </Heading>
          <Text mb={4}>
            We only share your information as described in this policy and with your consent. Your information may be visible to other members based on your directory preferences.
          </Text>
        </Box>

        <Box>
          <Heading as="h2" size="lg" mb={4}>
            4. Your Privacy Rights
          </Heading>
          <Text mb={4}>
            You have certain rights regarding your personal information. For California residents, please see our{" "}
            <Link as={NextLink} href="/privacy/ccpa" color="blue.500">
              CCPA Privacy Notice
            </Link>
            .
          </Text>
          <Text mb={4}>
            To exercise your right to opt out of the sale of personal information, visit our{" "}
            <Link as={NextLink} href="/privacy/do-not-sell" color="blue.500">
              Do Not Sell My Personal Information
            </Link>{" "}
            page.
          </Text>
        </Box>

        <Divider my={6} />

        <Box>
          <Heading as="h2" size="lg" mb={4}>
            5. Data Security
          </Heading>
          <Text mb={4}>
            We implement appropriate security measures to protect your personal information. However, no method of transmission over the Internet is 100% secure.
          </Text>
        </Box>

        <Box>
          <Heading as="h2" size="lg" mb={4}>
            6. Children&apos;s Privacy
          </Heading>
          <Text mb={4}>
            Our services are not intended for individuals under 13 years of age. We do not knowingly collect personal information from children.
          </Text>
        </Box>

        <Box>
          <Heading as="h2" size="lg" mb={4}>
            7. Changes to Privacy Policy
          </Heading>
          <Text mb={4}>
            We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy on this page.
          </Text>
        </Box>

        <Box>
          <Heading as="h2" size="lg" mb={4}>
            8. Contact Us
          </Heading>
          <Text mb={4}>
            If you have questions about this Privacy Policy, please contact the church administration.
          </Text>
        </Box>
      </VStack>
    </Container>
  );
} 