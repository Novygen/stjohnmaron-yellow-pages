"use client";

import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  SimpleGrid,
  Card,
  CardHeader,
  CardBody,
  Icon,
  HStack,
  Button,
  useColorModeValue,
} from "@chakra-ui/react";
import { FiUser, FiUsers, FiCalendar, FiMessageSquare } from "react-icons/fi";
import Link from "next/link";

export default function MemberDashboard() {
  const cardBg = useColorModeValue("white", "gray.700");
  const cardHoverBg = useColorModeValue("gray.50", "gray.600");

  const dashboardItems = [
    {
      title: "My Profile",
      description: "View and update your profile information",
      icon: FiUser,
      href: "/member/profile",
    },
    {
      title: "Member Directory",
      description: "Connect with other members of our community",
      icon: FiUsers,
      href: "/member/directory",
    },
    {
      title: "Events",
      description: "View upcoming events and register",
      icon: FiCalendar,
      href: "/member/events",
    },
    {
      title: "Messages",
      description: "View your messages and notifications",
      icon: FiMessageSquare,
      href: "/member/messages",
    },
  ];

  return (
    <Container maxW="6xl" py={8}>
      <VStack spacing={8} align="stretch">
        <Box>
          <Heading size="xl" mb={2}>
            Welcome to Your Dashboard
          </Heading>
          <Text color="gray.600">
            Manage your membership, connect with others, and stay updated with our community.
          </Text>
        </Box>

        <SimpleGrid columns={{ base: 1, md: 2, lg: 2 }} spacing={6}>
          {dashboardItems.map((item) => (
            <Card
              key={item.title}
              as={Link}
              href={item.href}
              bg={cardBg}
              _hover={{
                bg: cardHoverBg,
                transform: "translateY(-2px)",
                boxShadow: "lg",
              }}
              transition="all 0.2s"
              cursor="pointer"
            >
              <CardHeader>
                <HStack spacing={4}>
                  <Icon as={item.icon} boxSize={6} color="blue.500" />
                  <Heading size="md">{item.title}</Heading>
                </HStack>
              </CardHeader>
              <CardBody>
                <Text color="gray.600">{item.description}</Text>
              </CardBody>
            </Card>
          ))}
        </SimpleGrid>

        <Box bg="blue.50" p={6} borderRadius="lg">
          <VStack spacing={4} align="stretch">
            <Heading size="md" color="blue.800">
              Membership Status
            </Heading>
            <Text>
              Your membership request is currently under review. We will notify you once it has been approved.
            </Text>
            <Button colorScheme="blue" size="sm" alignSelf="flex-start">
              Check Status
            </Button>
          </VStack>
        </Box>
      </VStack>
    </Container>
  );
} 