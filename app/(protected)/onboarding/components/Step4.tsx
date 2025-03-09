"use client";
import React, { useEffect, useState } from "react";
import useMembershipRequest from "../hooks/useMembershipRequest";
import {
  FormControl,
  Button,
  Text,
  VStack,
  HStack,
  Checkbox,
  Link,
  Box,
  Alert,
  AlertIcon,
  Stack,
  Divider,
} from "@chakra-ui/react";
import NextLink from "next/link";

interface Step4Props {
  next: () => void;
  back: () => void;
}

export default function Step4({ next, back }: Step4Props) {
  const { membershipData, updatePrivacyConsent } = useMembershipRequest();
  const [localPrivacy, setLocalPrivacy] = useState(membershipData.privacyConsent);
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    setLocalPrivacy(membershipData.privacyConsent);
  }, [membershipData.privacyConsent]);

  const handleConsent = () => {
    if (!localPrivacy.internalConsent) {
      setShowError(true);
      return;
    }
    setShowError(false);
    updatePrivacyConsent(localPrivacy);
    next();
  };

  return (
    <VStack spacing={6} align="stretch">
      <Text fontSize="2xl" fontWeight="bold" mb={2}>
        Privacy Settings & Consent
      </Text>
      <Text color="gray.600" mb={6}>
        Please review our privacy policy and provide your consent preferences
      </Text>

      {showError && (
        <Alert status="error" mb={4}>
          <AlertIcon />
          You must consent to the Terms & Conditions and Privacy Policy to proceed.
        </Alert>
      )}

      <Stack spacing={6}>
        <Box p={4} borderWidth="1px" borderRadius="md">
          <VStack align="stretch" spacing={4}>
            <FormControl isRequired>
              <Checkbox
                size="lg"
                isChecked={localPrivacy.internalConsent}
                onChange={(e) =>
                  setLocalPrivacy({ ...localPrivacy, internalConsent: e.target.checked })
                }
              >
                <Text>
                  I agree to the{" "}
                  <Link as={NextLink} href="/terms" color="blue.500" isExternal>
                    Terms & Conditions
                  </Link>{" "}
                  and{" "}
                  <Link as={NextLink} href="/privacy" color="blue.500" isExternal>
                    Privacy Policy
                  </Link>
                </Text>
              </Checkbox>
            </FormControl>

            <Text fontSize="sm" color="gray.600">
              By checking this box, you acknowledge that you have read and understood our Terms & Conditions and Privacy Policy, 
              including how we collect, use, and protect your personal information.
            </Text>
          </VStack>
        </Box>

        <Divider />

        <Box p={4} borderWidth="1px" borderRadius="md">
          <VStack align="stretch" spacing={4}>
            <Text fontWeight="semibold">Directory Listing Preferences</Text>
            
            <FormControl>
              <Checkbox
                size="lg"
                isChecked={localPrivacy.displayInYellowPages}
                onChange={(e) =>
                  setLocalPrivacy({ ...localPrivacy, displayInYellowPages: e.target.checked })
                }
              >
                List me in the Member Directory
              </Checkbox>
              <Text fontSize="sm" color="gray.600" mt={2}>
                Your name and professional information will be visible to other members in our directory.
              </Text>
            </FormControl>

            <FormControl>
              <Checkbox
                size="lg"
                isChecked={localPrivacy.displayPhonePublicly}
                onChange={(e) =>
                  setLocalPrivacy({ ...localPrivacy, displayPhonePublicly: e.target.checked })
                }
              >
                Display my phone number in the directory
              </Checkbox>
              <Text fontSize="sm" color="gray.600" mt={2}>
                Your phone number will be visible to other members if you enable this option.
              </Text>
            </FormControl>
          </VStack>
        </Box>

        <Box p={4} borderWidth="1px" borderRadius="md">
          <VStack align="stretch" spacing={4}>
            <Text fontWeight="semibold">Your Privacy Rights (CCPA Compliance)</Text>
            <Text fontSize="sm" color="gray.600">
              Under the California Consumer Privacy Act (CCPA), you have the right to:
            </Text>
            <Stack spacing={2} pl={4}>
              <Text fontSize="sm">• Know what personal information is collected</Text>
              <Text fontSize="sm">• Access your personal information</Text>
              <Text fontSize="sm">• Delete your personal information</Text>
              <Text fontSize="sm">• Opt-out of the sale of personal information</Text>
              <Text fontSize="sm">• Non-discrimination for exercising these rights</Text>
            </Stack>
            <Link as={NextLink} href="/privacy/ccpa" color="blue.500" fontSize="sm" isExternal>
              Learn more about your CCPA rights
            </Link>
            <Link as={NextLink} href="/privacy/do-not-sell" color="blue.500" fontSize="sm" isExternal>
              Do Not Sell My Personal Information
            </Link>
          </VStack>
        </Box>
      </Stack>

      <HStack spacing={4} mt={8} justify="flex-end">
        <Button size="lg" onClick={back} variant="outline">
          Back
        </Button>
        <Button size="lg" colorScheme="blue" onClick={handleConsent}>
          I Consent & Continue
        </Button>
      </HStack>
    </VStack>
  );
}
