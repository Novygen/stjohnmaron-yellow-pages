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
} from "@chakra-ui/react";

export default function TermsPage() {
  return (
    <Container maxW="4xl" py={8}>
      <VStack spacing={6} align="stretch">
        <Heading as="h1" size="xl" mb={4}>
          Terms & Conditions
        </Heading>

        <Text color="gray.600">
          Last updated: {new Date().toLocaleDateString()}
        </Text>

        <Box>
          <Heading as="h2" size="lg" mb={4}>
            1. Acceptance of Terms
          </Heading>
          <Text mb={4}>
            By accessing and using the St. John Maron Members Portal, you accept and agree to be bound by the terms and provisions of this agreement.
          </Text>
        </Box>

        <Box>
          <Heading as="h2" size="lg" mb={4}>
            2. Membership Eligibility
          </Heading>
          <Text mb={4}>
            Membership is available to individuals who meet the following criteria:
          </Text>
          <UnorderedList spacing={2} pl={4} mb={4}>
            <ListItem>Are members of the St. John Maron community</ListItem>
            <ListItem>Provide accurate and complete registration information</ListItem>
            <ListItem>Agree to maintain the accuracy of their information</ListItem>
          </UnorderedList>
        </Box>

        <Divider my={6} />

        <Box>
          <Heading as="h2" size="lg" mb={4}>
            3. Member Directory
          </Heading>
          <Text mb={4}>
            The Member Directory is a service provided to facilitate community connections. By choosing to be listed in the directory, you agree that:
          </Text>
          <UnorderedList spacing={2} pl={4} mb={4}>
            <ListItem>Your provided information may be displayed to other members</ListItem>
            <ListItem>You will not misuse other members&apos; information</ListItem>
            <ListItem>You can control your visibility settings through your privacy preferences</ListItem>
          </UnorderedList>
        </Box>

        <Box>
          <Heading as="h2" size="lg" mb={4}>
            4. Privacy
          </Heading>
          <Text mb={4}>
            Your privacy is important to us. Our use of your information is governed by our Privacy Policy. By using our services, you consent to the collection and use of information as detailed in our Privacy Policy.
          </Text>
        </Box>

        <Box>
          <Heading as="h2" size="lg" mb={4}>
            5. Code of Conduct
          </Heading>
          <Text mb={2}>Members agree to:</Text>
          <UnorderedList spacing={2} pl={4} mb={4}>
            <ListItem>Treat all members with respect and dignity</ListItem>
            <ListItem>Not engage in harassment or discriminatory behavior</ListItem>
            <ListItem>Not use the platform for unauthorized commercial purposes</ListItem>
            <ListItem>Protect their account credentials</ListItem>
          </UnorderedList>
        </Box>

        <Box>
          <Heading as="h2" size="lg" mb={4}>
            6. Termination
          </Heading>
          <Text mb={4}>
            We reserve the right to terminate or suspend access to our services for violations of these terms or any other inappropriate behavior.
          </Text>
        </Box>

        <Box>
          <Heading as="h2" size="lg" mb={4}>
            7. Changes to Terms
          </Heading>
          <Text mb={4}>
            We may modify these terms at any time. Continued use of the platform after changes constitutes acceptance of the modified terms.
          </Text>
        </Box>

        <Box>
          <Heading as="h2" size="lg" mb={4}>
            8. Contact Information
          </Heading>
          <Text mb={4}>
            For questions about these terms, please contact the church administration.
          </Text>
        </Box>
      </VStack>
    </Container>
  );
} 