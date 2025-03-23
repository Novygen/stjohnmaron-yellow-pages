"use client";
import { useEffect, useState } from "react";
import useMembershipRequest from "../hooks/useMembershipRequest";
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  VStack,
  FormErrorMessage,
  HStack,
  useColorMode,
} from "@chakra-ui/react";

interface Step3Props {
  next: () => void;
  back: () => void;
}

export default function Step3({ next, back }: Step3Props) {
  const { membershipData, updateSocialPresence } = useMembershipRequest();
  const [localSocial, setLocalSocial] = useState(membershipData.socialPresence);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { colorMode } = useColorMode();
  const inputBg = colorMode === "light" ? "white" : "gray.700";

  useEffect(() => {
    setLocalSocial(membershipData.socialPresence);
  }, [membershipData.socialPresence]);

  const validateUrl = (url: string) => {
    if (!url) return true; // Allow empty values
    return url.startsWith("http://") || url.startsWith("https://");
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    // Validate all social URLs
    const urlFields = [
      'linkedInProfile', 
      'personalWebsite', 
      'instagramProfile', 
      'facebookProfile', 
      'xProfile'
    ];
    
    urlFields.forEach(field => {
      if (localSocial[field as keyof typeof localSocial] && 
          !validateUrl(localSocial[field as keyof typeof localSocial] as string)) {
        newErrors[field] = "Please enter a valid URL (must start with http:// or https://)";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  function handleNext() {
    if (validateForm()) {
      updateSocialPresence(localSocial);
      next();
    }
  }

  return (
    <VStack spacing={6} align="stretch">
      <Text fontSize="2xl" fontWeight="bold" mb={2}>
        Social & Online Presence
      </Text>
      <Text color="gray.600" mb={6}>
        Share your professional online presence
      </Text>

      <FormControl isInvalid={!!errors.linkedInProfile}>
        <FormLabel>LinkedIn Profile</FormLabel>
        <Input
          bg={inputBg}
          type="url"
          placeholder="https://www.linkedin.com/in/your-profile"
          value={localSocial.linkedInProfile || ""}
          onChange={(e) => setLocalSocial({ ...localSocial, linkedInProfile: e.target.value })}
        />
        <FormErrorMessage>{errors.linkedInProfile}</FormErrorMessage>
      </FormControl>

      <FormControl isInvalid={!!errors.personalWebsite}>
        <FormLabel>Personal Website</FormLabel>
        <Input
          bg={inputBg}
          type="url"
          placeholder="https://your-website.com"
          value={localSocial.personalWebsite || ""}
          onChange={(e) => setLocalSocial({ ...localSocial, personalWebsite: e.target.value })}
        />
        <FormErrorMessage>{errors.personalWebsite}</FormErrorMessage>
      </FormControl>
      
      <FormControl isInvalid={!!errors.instagramProfile}>
        <FormLabel>Instagram Profile</FormLabel>
        <Input
          bg={inputBg}
          type="url"
          placeholder="https://www.instagram.com/your-username"
          value={localSocial.instagramProfile || ""}
          onChange={(e) => setLocalSocial({ ...localSocial, instagramProfile: e.target.value })}
        />
        <FormErrorMessage>{errors.instagramProfile}</FormErrorMessage>
      </FormControl>
      
      <FormControl isInvalid={!!errors.facebookProfile}>
        <FormLabel>Facebook Profile</FormLabel>
        <Input
          bg={inputBg}
          type="url"
          placeholder="https://www.facebook.com/your-profile"
          value={localSocial.facebookProfile || ""}
          onChange={(e) => setLocalSocial({ ...localSocial, facebookProfile: e.target.value })}
        />
        <FormErrorMessage>{errors.facebookProfile}</FormErrorMessage>
      </FormControl>
      
      <FormControl isInvalid={!!errors.xProfile}>
        <FormLabel>X Profile (Twitter)</FormLabel>
        <Input
          bg={inputBg}
          type="url"
          placeholder="https://x.com/your-username"
          value={localSocial.xProfile || ""}
          onChange={(e) => setLocalSocial({ ...localSocial, xProfile: e.target.value })}
        />
        <FormErrorMessage>{errors.xProfile}</FormErrorMessage>
      </FormControl>

      <HStack spacing={4} mt={8} justify="flex-end">
        <Button size="lg" onClick={back} variant="outline">
          Back
        </Button>
        <Button size="lg" colorScheme="blue" onClick={handleNext}>
          Continue to Privacy Settings
        </Button>
      </HStack>
    </VStack>
  );
}
