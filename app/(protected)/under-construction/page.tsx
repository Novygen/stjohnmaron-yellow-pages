"use client";

import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  Icon,
  useColorModeValue,
} from "@chakra-ui/react";
import { FiTool } from "react-icons/fi";
import withAuth from "@/hoc/withAuth";

export default withAuth(UnderConstruction);

function UnderConstruction() {
  const textColor = useColorModeValue("gray.600", "gray.300");

  return (
    <Container maxW="4xl" py={16}>
      <VStack spacing={8} align="center" textAlign="center">
        <Icon as={FiTool} boxSize={16} color="blue.500" />
        <Heading size="xl">Under Construction</Heading>
        <Text color={textColor} fontSize="lg">
          We&apos;re working hard to bring you this feature. Check back soon for updates!
        </Text>
        <Box
          bg="blue.50"
          p={6}
          borderRadius="lg"
          width="100%"
          color="blue.800"
        >
          <Text>
            This feature is currently in development and will be available to approved members soon.
            Thank you for your patience!
          </Text>
        </Box>
      </VStack>
    </Container>
  );
} 