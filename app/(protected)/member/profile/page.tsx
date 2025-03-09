"use client";

import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  FormControl,
  FormLabel,
  Input,
  Button,
  useToast,
  Textarea,
  SimpleGrid,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  useColorModeValue,
  Skeleton,
  SkeletonText,
} from "@chakra-ui/react";
import withAuth from "@/hoc/withAuth";
import { useMemberProfile } from "@/app/hooks/useMemberProfile";

export default withAuth(MemberProfile);

function MemberProfile() {
  const {
    profile,
    isLoading,
    error,
    updateProfile,
  } = useMemberProfile();

  const toast = useToast();
  const alertBg = useColorModeValue("red.50", "red.900");
  const alertBorder = useColorModeValue("red.100", "red.800");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile?.isApproved) return;

    const result = await updateProfile({
      firstName: profile.firstName,
      lastName: profile.lastName,
      email: profile.email,
      phone: profile.phone,
      address: profile.address,
      bio: profile.bio,
    });

    if (result.success) {
      toast({
        title: "Profile Updated",
        description: "Your profile information has been successfully updated.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } else {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    updateProfile({ [name]: value });
  };

  if (error) {
    return (
      <Container maxW="4xl" py={8}>
        <Alert status="error">
          <AlertIcon />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxW="4xl" py={8}>
      <VStack spacing={8} align="stretch">
        <Box>
          <Heading size="xl" mb={2}>
            My Profile
          </Heading>
          <Text color="gray.600">
            Manage your personal information and preferences
          </Text>
        </Box>

        {profile && !profile.isApproved && (
          <Alert
            status="warning"
            variant="subtle"
            flexDirection="column"
            alignItems="start"
            p={6}
            borderRadius="lg"
            bg={alertBg}
            borderWidth={1}
            borderColor={alertBorder}
          >
            <AlertIcon />
            <AlertTitle mt={2}>Membership Pending Approval</AlertTitle>
            <AlertDescription>
              Your profile editing capabilities are limited until your membership is approved.
              We&apos;ll notify you once your membership has been reviewed.
            </AlertDescription>
          </Alert>
        )}

        <Box as="form" onSubmit={handleSubmit}>
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
            <FormControl isDisabled={!profile?.isApproved}>
              <FormLabel>First Name</FormLabel>
              {isLoading ? (
                <Skeleton height="40px" />
              ) : (
                <Input
                  name="firstName"
                  value={profile?.firstName || ""}
                  onChange={handleInputChange}
                  placeholder="Enter your first name"
                />
              )}
            </FormControl>

            <FormControl isDisabled={!profile?.isApproved}>
              <FormLabel>Last Name</FormLabel>
              {isLoading ? (
                <Skeleton height="40px" />
              ) : (
                <Input
                  name="lastName"
                  value={profile?.lastName || ""}
                  onChange={handleInputChange}
                  placeholder="Enter your last name"
                />
              )}
            </FormControl>

            <FormControl isDisabled={!profile?.isApproved}>
              <FormLabel>Email</FormLabel>
              {isLoading ? (
                <Skeleton height="40px" />
              ) : (
                <Input
                  name="email"
                  type="email"
                  value={profile?.email || ""}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                />
              )}
            </FormControl>

            <FormControl isDisabled={!profile?.isApproved}>
              <FormLabel>Phone</FormLabel>
              {isLoading ? (
                <Skeleton height="40px" />
              ) : (
                <Input
                  name="phone"
                  type="tel"
                  value={profile?.phone || ""}
                  onChange={handleInputChange}
                  placeholder="Enter your phone number"
                />
              )}
            </FormControl>

            <FormControl gridColumn={{ md: "span 2" }} isDisabled={!profile?.isApproved}>
              <FormLabel>Address</FormLabel>
              {isLoading ? (
                <Skeleton height="40px" />
              ) : (
                <Input
                  name="address"
                  value={profile?.address || ""}
                  onChange={handleInputChange}
                  placeholder="Enter your address"
                />
              )}
            </FormControl>

            <FormControl gridColumn={{ md: "span 2" }} isDisabled={!profile?.isApproved}>
              <FormLabel>Bio</FormLabel>
              {isLoading ? (
                <SkeletonText noOfLines={4} spacing="4" />
              ) : (
                <Textarea
                  name="bio"
                  value={profile?.bio || ""}
                  onChange={handleInputChange}
                  placeholder="Tell us about yourself"
                  rows={4}
                />
              )}
            </FormControl>
          </SimpleGrid>

          <Button
            mt={8}
            colorScheme="blue"
            type="submit"
            isLoading={isLoading}
            isDisabled={!profile?.isApproved}
            loadingText="Updating..."
          >
            Update Profile
          </Button>
        </Box>
      </VStack>
    </Container>
  );
} 