"use client";

import React from "react";
import useMembershipRequest from "../hooks/useMembershipRequest";
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Divider,
  Text,
  SimpleGrid,
  useColorMode,
  FormErrorMessage,
  VStack,
  Select,
  Box,
  Collapse,
  useDisclosure,
  IconButton,
  Flex,
} from "@chakra-ui/react";
import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";
import statesData from "@/data/states.json";
import { useSelector } from "react-redux";
import { RootState } from "@/store/index";
import { useState } from "react";

interface Step1Props {
  next: () => void;
}

export default function Step1({ next }: Step1Props) {
  const { membershipData, updatePersonalDetails, updateContactInformation } = useMembershipRequest();
  const userEmail = useSelector((state: RootState) => state.user.email);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { colorMode } = useColorMode();
  const { isOpen: isAddressOpen, onToggle: onAddressToggle } = useDisclosure();
  const inputBg = colorMode === "light" ? "white" : "gray.700";

  // Age range options
  const ageRangeOptions = [
    { value: "18-24", label: "18-24" },
    { value: "25-34", label: "25-34" },
    { value: "35-44", label: "35-44" },
    { value: "45-54", label: "45-54" },
    { value: "55-64", label: "55-64" },
    { value: "65+", label: "65+" },
  ];

  const { personalDetails, contactInformation } = membershipData;
  const address = contactInformation.address || {};

  // Add new state for otherParishName
  const [otherParishName, setOtherParishName] = useState<string>(personalDetails.parishStatus?.otherParishName || "");

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!personalDetails.firstName?.trim()) {
      newErrors.firstName = "First Name is required";
    }
    if (!personalDetails.lastName?.trim()) {
      newErrors.lastName = "Last Name is required";
    }
    if (!personalDetails.ageRange) {
      newErrors.ageRange = "Age Range is required";
    }
    if (!contactInformation.primaryPhoneNumber?.trim()) {
      newErrors.phone = "Phone Number is required";
    }
    if (!userEmail?.trim()) {
      newErrors.email = "Email is required";
    }

    // Only validate address fields if they have been filled out
    if (isAddressOpen) {
      if (address.line1?.trim() || address.city?.trim() || address.state?.trim() || address.zip?.trim()) {
        // If any address field is filled, validate all required address fields
        if (!address.line1?.trim()) {
          newErrors.addressLine1 = "Address Line 1 is required if providing an address";
        }
        if (!address.city?.trim()) {
          newErrors.city = "City is required if providing an address";
        }
        if (!address.state?.trim()) {
          newErrors.state = "State is required if providing an address";
        }
        if (!address.zip?.trim()) {
          newErrors.zip = "ZIP is required if providing an address";
        }
      }
    }

    // Add validation for other parish name if status is 'other_parish'
    if (personalDetails.parishStatus?.status === 'other_parish' && !otherParishName.trim()) {
      newErrors.otherParishName = "Please specify the parish name";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateForm()) {
      next();
    }
  };

  return (
    <VStack spacing={6} align="stretch">
      <Text fontSize="2xl" fontWeight="bold" mb={2}>
        Basic Information
      </Text>
      <Text color="gray.600" mb={6}>
        Please provide your personal details to get started
      </Text>

      {/* Personal Details Section */}
      <VStack spacing={4} align="stretch">
        <Text fontWeight="semibold" color="blue.600">
          Personal Details
        </Text>
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
          <FormControl isRequired isInvalid={!!errors.firstName}>
            <FormLabel>First Name</FormLabel>
            <Input
              bg={inputBg}
              value={personalDetails.firstName}
              onChange={(e) => {
                updatePersonalDetails({ firstName: e.target.value });
                updateContactInformation({ primaryEmail: userEmail ?? "" });
              }}
            />
            <FormErrorMessage>{errors.firstName}</FormErrorMessage>
          </FormControl>

          <FormControl isRequired isInvalid={!!errors.lastName}>
            <FormLabel>Last Name</FormLabel>
            <Input
              bg={inputBg}
              value={personalDetails.lastName}
              onChange={(e) => updatePersonalDetails({ lastName: e.target.value })}
            />
            <FormErrorMessage>{errors.lastName}</FormErrorMessage>
          </FormControl>
        </SimpleGrid>

        <FormControl>
          <FormLabel>Middle Name (optional)</FormLabel>
          <Input
            bg={inputBg}
            value={personalDetails.middleName}
            onChange={(e) => updatePersonalDetails({ middleName: e.target.value })}
          />
        </FormControl>

        <FormControl isRequired isInvalid={!!errors.ageRange}>
          <FormLabel>Age Range</FormLabel>
          <Select
            bg={inputBg}
            value={personalDetails.ageRange}
            onChange={(e) => updatePersonalDetails({ ageRange: e.target.value })}
            placeholder="Select Age Range"
          >
            {ageRangeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
          <FormErrorMessage>{errors.ageRange}</FormErrorMessage>
        </FormControl>
      </VStack>

      <Divider my={6} />

      {/* Contact Information Section */}
      <VStack spacing={4} align="stretch">
        <Text fontWeight="semibold" color="blue.600">
          Contact Information
        </Text>

        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
          <FormControl isRequired isInvalid={!!errors.phone}>
            <FormLabel>Personal Phone Number</FormLabel>
            <Input
              bg={inputBg}
              type="tel"
              value={contactInformation.primaryPhoneNumber}
              onChange={(e) => updateContactInformation({ primaryPhoneNumber: e.target.value })}
            />
            <FormErrorMessage>{errors.phone}</FormErrorMessage>
          </FormControl>

          <FormControl isRequired isInvalid={!!errors.email}>
            <FormLabel>Personal Email</FormLabel>
            <Input bg={inputBg} type="email" value={userEmail || ""} readOnly />
            <FormErrorMessage>{errors.email}</FormErrorMessage>
          </FormControl>
        </SimpleGrid>


      <Divider my={6} />

        {/* Optional Address Section */}
        <Box>
          <Flex justify="space-between" align="center" onClick={onAddressToggle} cursor="pointer" mb={2}>
            <Text fontWeight="semibold" color="blue.600">
              Home Address (Optional)
            </Text>
            <IconButton
              aria-label={isAddressOpen ? "Collapse address section" : "Expand address section"}
              icon={isAddressOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
              variant="ghost"
              size="sm"
            />
          </Flex>

          <Collapse in={isAddressOpen}>
            <VStack spacing={4} align="stretch">
              <FormControl isInvalid={!!errors.addressLine1}>
                <FormLabel>Address Line 1</FormLabel>
                <Input
                  bg={inputBg}
                  value={address.line1}
                  onChange={(e) =>
                    updateContactInformation({
                      address: { ...address, line1: e.target.value },
                    })
                  }
                />
                <FormErrorMessage>{errors.addressLine1}</FormErrorMessage>
              </FormControl>

              <FormControl>
                <FormLabel>Address Line 2 (optional)</FormLabel>
                <Input
                  bg={inputBg}
                  value={address.line2}
                  onChange={(e) =>
                    updateContactInformation({
                      address: { ...address, line2: e.target.value },
                    })
                  }
                />
              </FormControl>

              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                <FormControl isInvalid={!!errors.city}>
                  <FormLabel>City</FormLabel>
                  <Input
                    bg={inputBg}
                    value={address.city}
                    onChange={(e) =>
                      updateContactInformation({
                        address: { ...address, city: e.target.value },
                      })
                    }
                  />
                  <FormErrorMessage>{errors.city}</FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={!!errors.state}>
                  <FormLabel>State</FormLabel>
                  <Select
                    bg={inputBg}
                    value={address.state}
                    onChange={(e) =>
                      updateContactInformation({
                        address: { ...address, state: e.target.value },
                      })
                    }
                    placeholder="Select State"
                  >
                    {statesData.states.map((state) => (
                      <option key={state} value={state}>
                        {state}
                      </option>
                    ))}
                  </Select>
                  <FormErrorMessage>{errors.state}</FormErrorMessage>
                </FormControl>
              </SimpleGrid>

              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                <FormControl isInvalid={!!errors.zip}>
                  <FormLabel>ZIP</FormLabel>
                  <Input
                    bg={inputBg}
                    value={address.zip}
                    onChange={(e) =>
                      updateContactInformation({
                        address: { ...address, zip: e.target.value, country: "United States" },
                      })
                    }
                  />
                  <FormErrorMessage>{errors.zip}</FormErrorMessage>
                </FormControl>

                <FormControl>
                  <FormLabel>Country</FormLabel>
                  <Input bg={inputBg} value="United States" readOnly />
                </FormControl>
              </SimpleGrid>
            </VStack>
          </Collapse>
        </Box>
      </VStack>

      <Divider my={6} />

      {/* Parish Status Section */}
      <VStack spacing={4} align="stretch">
        <Text fontWeight="semibold" color="blue.600">
          Parish Affiliation
        </Text>
        <Text fontSize="sm" color="gray.600">
          Please select your status (will not be displayed on the directory)
        </Text>
        <FormControl isRequired>
          <FormLabel>Parish Status</FormLabel>
          <Select
            bg={inputBg}
            value={personalDetails.parishStatus?.status || ""}
            onChange={(e) => {
              const status = e.target.value as 'member' | 'visitor' | 'other_parish' | "";
              if (status) {
                updatePersonalDetails({ 
                  parishStatus: { 
                    status,
                    otherParishName: status === 'other_parish' ? otherParishName : undefined 
                  }
                });
              } else {
                updatePersonalDetails({ parishStatus: undefined });
              }
            }}
            placeholder="Select your status"
          >
            <option value="member">Member of St John Maron Parish</option>
            <option value="visitor">Visitor</option>
            <option value="other_parish">Member of Another Parish</option>
          </Select>
        </FormControl>

        {personalDetails.parishStatus?.status === 'other_parish' && (
          <FormControl isInvalid={!!errors.otherParishName}>
            <FormLabel>Name of Parish</FormLabel>
            <Input
              bg={inputBg}
              value={otherParishName}
              onChange={(e) => {
                setOtherParishName(e.target.value);
                updatePersonalDetails({ 
                  parishStatus: { 
                    status: 'other_parish',
                    otherParishName: e.target.value
                  }
                });
              }}
              placeholder="Please enter the name of your parish"
            />
            <FormErrorMessage>{errors.otherParishName}</FormErrorMessage>
          </FormControl>
        )}
      </VStack>

      <Button
        mt={8}
        size="lg"
        colorScheme="blue"
        onClick={handleNext}
        w={{ base: "100%", md: "auto" }}
        alignSelf="flex-end"
      >
        Continue to Professional Info
      </Button>
    </VStack>
  );
}
