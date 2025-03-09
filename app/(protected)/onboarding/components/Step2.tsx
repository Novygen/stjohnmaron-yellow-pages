"use client";

import React, { useEffect, useState } from "react";
import useMembershipRequest from "../hooks/useMembershipRequest";
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  SimpleGrid,
  useColorMode,
  FormErrorMessage,
  VStack,
  Select,
  Box,
  HStack,
  Textarea,
  useToast,
  Spinner,
  Center,
  Checkbox,
} from "@chakra-ui/react";
import { IEmploymentDetails, IBusiness, IStudent } from "@/models/MembershipRequest";

interface Step2Props {
  next: () => void;
  back: () => void;
}

interface Industry {
  id: string;
  name: string;
}

interface Specialization {
  id: string;
  name: string;
  industryId: string;
}

const ACTIVE_STATUSES = ["employed", "business_owner", "student"];
const INACTIVE_STATUS = "other";

const employmentStatusOptions = [
  { value: "employed", label: "Employed", group: "active" },
  { value: "business_owner", label: "Business Owner/Service Provider", group: "active" },
  { value: "student", label: "Student", group: "active" },
  { value: "other", label: "Retired/Unemployed/Homemaker", group: "inactive" },
];

export default function Step2({ next, back }: Step2Props) {
  const { membershipData, updateProfessionalInfo } = useMembershipRequest();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { colorMode } = useColorMode();
  const inputBg = colorMode === "light" ? "white" : "gray.700";
  const toast = useToast();

  const [industries, setIndustries] = useState<Industry[]>([]);
  const [specializations, setSpecializations] = useState<Specialization[]>([]);
  const [selectedIndustryId, setSelectedIndustryId] = useState<string>("");
  const [loading, setLoading] = useState(true);

  const { employmentStatus, employmentDetails, business, student } = membershipData.professionalInfo;
  const statuses = employmentStatus?.status?.split(',').filter(Boolean) || [];

  const isStatusDisabled = (option: typeof employmentStatusOptions[0]) => {
    if (option.group === "inactive") {
      return statuses.some(s => ACTIVE_STATUSES.includes(s));
    }
    return statuses.includes(INACTIVE_STATUS);
  };

  useEffect(() => {
    const fetchIndustries = async () => {
      try {
        const response = await fetch("/api/industries");
        if (!response.ok) throw new Error("Failed to fetch industries");
        const data = await response.json();
        setIndustries(data);
        setLoading(false);
      } catch (error: unknown) {
        console.error("Failed to fetch industries:", error);
        toast({
          title: "Error",
          description: "Failed to load industries. Please try again.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        setLoading(false);
      }
    };

    fetchIndustries();
  }, [toast]);

  useEffect(() => {
    const fetchSpecializations = async () => {
      if (!selectedIndustryId) {
        setSpecializations([]);
        return;
      }

      try {
        const response = await fetch(`/api/specializations?industryId=${selectedIndustryId}`);
        if (!response.ok) throw new Error("Failed to fetch specializations");
        const data = await response.json();
        setSpecializations(data);
      } catch (error: unknown) {
        console.error("Failed to fetch specializations:", error);
        toast({
          title: "Error",
          description: "Failed to load specializations. Please try again.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    };

    fetchSpecializations();
  }, [selectedIndustryId, toast]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (statuses.length === 0) {
      newErrors.status = "Employment status is required";
      return false;
    }

    // Check each selected status for required fields
    if (statuses.includes("employed")) {
      if (!employmentDetails?.companyName?.trim()) {
        newErrors.companyName = "Company name is required";
      }
      if (!employmentDetails?.jobTitle?.trim()) {
        newErrors.jobTitle = "Job title is required";
      }
      if (!employmentDetails?.specialization?.trim()) {
        newErrors.specialization = "Specialization is required";
      }
    }

    if (statuses.includes("business_owner")) {
      if (!business?.businessName?.trim()) {
        newErrors.businessName = "Business/Service name is required";
      }
      if (!business?.industry?.trim()) {
        newErrors.businessIndustry = "Industry is required";
      }
      if (!business?.description?.trim()) {
        newErrors.description = "Business/Service description is required";
      }
    }

    // Student fields are optional, so no validation needed

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateForm()) {
      next();
    }
  };

  const renderEmployedFields = () => (
    <VStack spacing={4} align="stretch">
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
        <FormControl isRequired isInvalid={!!errors.companyName}>
          <FormLabel>Company Name</FormLabel>
          <Input
            bg={inputBg}
            value={employmentDetails?.companyName || ""}
            onChange={(e) =>
              updateProfessionalInfo({
                employmentDetails: {
                  companyName: e.target.value,
                  jobTitle: employmentDetails?.jobTitle || "",
                  specialization: employmentDetails?.specialization || "",
                } as IEmploymentDetails,
              })
            }
          />
          <FormErrorMessage>{errors.companyName}</FormErrorMessage>
        </FormControl>

        <FormControl isRequired isInvalid={!!errors.jobTitle}>
          <FormLabel>Job Title</FormLabel>
          <Input
            bg={inputBg}
            value={employmentDetails?.jobTitle || ""}
            onChange={(e) =>
              updateProfessionalInfo({
                employmentDetails: {
                  companyName: employmentDetails?.companyName || "",
                  jobTitle: e.target.value,
                  specialization: employmentDetails?.specialization || "",
                } as IEmploymentDetails,
              })
            }
          />
          <FormErrorMessage>{errors.jobTitle}</FormErrorMessage>
        </FormControl>
      </SimpleGrid>

      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
        <FormControl>
          <FormLabel>Industry</FormLabel>
          <Select
            bg={inputBg}
            value={selectedIndustryId}
            onChange={(e) => setSelectedIndustryId(e.target.value)}
            placeholder="Select Industry"
          >
            {industries.map((industry) => (
              <option key={industry.id} value={industry.id}>
                {industry.name}
              </option>
            ))}
          </Select>
        </FormControl>

        <FormControl isRequired isInvalid={!!errors.specialization}>
          <FormLabel>Specialization</FormLabel>
          <Select
            bg={inputBg}
            value={employmentDetails?.specialization || ""}
            onChange={(e) =>
              updateProfessionalInfo({
                employmentDetails: {
                  companyName: employmentDetails?.companyName || "",
                  jobTitle: employmentDetails?.jobTitle || "",
                  specialization: e.target.value,
                } as IEmploymentDetails,
              })
            }
            placeholder="Select Specialization"
            isDisabled={!selectedIndustryId}
          >
            {specializations.map((spec) => (
              <option key={spec.id} value={spec.id}>
                {spec.name}
              </option>
            ))}
          </Select>
          <FormErrorMessage>{errors.specialization}</FormErrorMessage>
        </FormControl>
      </SimpleGrid>
    </VStack>
  );

  const renderBusinessOwnerFields = () => (
    <VStack spacing={4} align="stretch">
      <FormControl isRequired isInvalid={!!errors.businessName}>
        <FormLabel>Business/Service Name</FormLabel>
        <Input
          bg={inputBg}
          value={business?.businessName || ""}
          onChange={(e) =>
            updateProfessionalInfo({
              business: {
                businessName: e.target.value,
                industry: business?.industry || "",
                description: business?.description || "",
                website: business?.website,
                phoneNumber: business?.phoneNumber,
              } as IBusiness,
            })
          }
        />
        <FormErrorMessage>{errors.businessName}</FormErrorMessage>
      </FormControl>

      <FormControl isRequired isInvalid={!!errors.businessIndustry}>
        <FormLabel>Industry</FormLabel>
        <Select
          bg={inputBg}
          value={business?.industry || ""}
          onChange={(e) =>
            updateProfessionalInfo({
              business: {
                businessName: business?.businessName || "",
                industry: e.target.value,
                description: business?.description || "",
                website: business?.website,
                phoneNumber: business?.phoneNumber,
              } as IBusiness,
            })
          }
          placeholder="Select Industry"
        >
          {industries.map((industry) => (
            <option key={industry.id} value={industry.id}>
              {industry.name}
            </option>
          ))}
        </Select>
        <FormErrorMessage>{errors.businessIndustry}</FormErrorMessage>
      </FormControl>

      <FormControl isRequired isInvalid={!!errors.description}>
        <FormLabel>Business/Service Description</FormLabel>
        <Textarea
          bg={inputBg}
          value={business?.description || ""}
          onChange={(e) =>
            updateProfessionalInfo({
              business: {
                businessName: business?.businessName || "",
                industry: business?.industry || "",
                description: e.target.value,
                website: business?.website,
                phoneNumber: business?.phoneNumber,
              } as IBusiness,
            })
          }
          placeholder="Describe what your business does or list your services..."
          rows={4}
        />
        <FormErrorMessage>{errors.description}</FormErrorMessage>
      </FormControl>

      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
        <FormControl>
          <FormLabel>Phone Number (Optional)</FormLabel>
          <Input
            bg={inputBg}
            type="tel"
            value={business?.phoneNumber || ""}
            onChange={(e) =>
              updateProfessionalInfo({
                business: {
                  businessName: business?.businessName || "",
                  industry: business?.industry || "",
                  description: business?.description || "",
                  website: business?.website,
                  phoneNumber: e.target.value,
                } as IBusiness,
              })
            }
          />
        </FormControl>

        <FormControl>
          <FormLabel>Website (Optional)</FormLabel>
          <Input
            bg={inputBg}
            type="url"
            value={business?.website || ""}
            onChange={(e) =>
              updateProfessionalInfo({
                business: {
                  businessName: business?.businessName || "",
                  industry: business?.industry || "",
                  description: business?.description || "",
                  website: e.target.value,
                  phoneNumber: business?.phoneNumber,
                } as IBusiness,
              })
            }
          />
        </FormControl>
      </SimpleGrid>
    </VStack>
  );

  const renderStudentFields = () => (
    <VStack spacing={4} align="stretch">
      <FormControl>
        <FormLabel>School Name (Optional)</FormLabel>
        <Input
          bg={inputBg}
          value={student?.schoolName || ""}
          onChange={(e) =>
            updateProfessionalInfo({
              student: {
                schoolName: e.target.value,
                fieldOfStudy: student?.fieldOfStudy,
                expectedGraduationYear: student?.expectedGraduationYear,
              } as IStudent,
            })
          }
        />
      </FormControl>

      <FormControl>
        <FormLabel>Field of Study (Optional)</FormLabel>
        <Input
          bg={inputBg}
          value={student?.fieldOfStudy || ""}
          onChange={(e) =>
            updateProfessionalInfo({
              student: {
                schoolName: student?.schoolName,
                fieldOfStudy: e.target.value,
                expectedGraduationYear: student?.expectedGraduationYear,
              } as IStudent,
            })
          }
        />
      </FormControl>

      <FormControl>
        <FormLabel>Expected Graduation Year (Optional)</FormLabel>
        <Input
          bg={inputBg}
          type="number"
          value={student?.expectedGraduationYear || ""}
          onChange={(e) =>
            updateProfessionalInfo({
              student: {
                schoolName: student?.schoolName,
                fieldOfStudy: student?.fieldOfStudy,
                expectedGraduationYear: parseInt(e.target.value) || undefined,
              } as IStudent,
            })
          }
        />
      </FormControl>
    </VStack>
  );

  if (loading) {
    return (
      <Center h="400px">
        <Spinner size="xl" />
      </Center>
    );
  }

  return (
    <VStack spacing={6} align="stretch">
      <Text fontSize="2xl" fontWeight="bold" mb={2}>
        Professional Information
      </Text>
      <Text color="gray.600" mb={6}>
        Tell us about your professional background
      </Text>

      <FormControl isRequired isInvalid={!!errors.status}>
        <FormLabel>Employment Status</FormLabel>
        <Text fontSize="sm" color="gray.500" mb={4}>
          Note: You can combine employment, business ownership, and student status. However, retired/unemployed/homemaker cannot be combined with other options.
        </Text>
        <SimpleGrid columns={{ base: 1, md: 1 }} spacing={3}>
          {employmentStatusOptions.map((option) => (
            <FormControl key={option.value}>
              <Checkbox
                isChecked={statuses.includes(option.value)}
                onChange={(e) => {
                  const newStatus = e.target.checked
                    ? [...statuses, option.value]
                    : statuses.filter(s => s !== option.value);
                  updateProfessionalInfo({
                    employmentStatus: { status: newStatus.join(',') },
                  });
                }}
                isDisabled={isStatusDisabled(option)}
                size="lg"
                colorScheme="blue"
              >
                {option.label}
              </Checkbox>
            </FormControl>
          ))}
        </SimpleGrid>
        <FormErrorMessage>{errors.status}</FormErrorMessage>
      </FormControl>

      {statuses.length > 0 && (
        <Box mt={8}>
          {statuses.includes('employed') && (
            <Box mb={8}>
              <Text fontSize="lg" fontWeight="semibold" mb={4}>Employment Information</Text>
              {renderEmployedFields()}
            </Box>
          )}
          {statuses.includes('business_owner') && (
            <Box mb={8}>
              <Text fontSize="lg" fontWeight="semibold" mb={4}>Business Information</Text>
              {renderBusinessOwnerFields()}
            </Box>
          )}
          {statuses.includes('student') && (
            <Box mb={8}>
              <Text fontSize="lg" fontWeight="semibold" mb={4}>Student Information</Text>
              {renderStudentFields()}
            </Box>
          )}
        </Box>
      )}

      <HStack spacing={4} mt={8} justify="flex-end">
        <Button size="lg" onClick={back} variant="outline">
          Back
        </Button>
        <Button size="lg" colorScheme="blue" onClick={handleNext}>
          Continue to Social Presence
        </Button>
      </HStack>
    </VStack>
  );
}
