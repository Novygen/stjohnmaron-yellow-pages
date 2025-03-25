/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React, { useEffect, useState, useMemo } from "react";
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
  Divider,
  IconButton,
} from "@chakra-ui/react";
import { IEmploymentDetails, IBusiness, IStudent, ISkills } from "@/models/MembershipRequest";
import { AddIcon, DeleteIcon } from "@chakra-ui/icons";

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

  const { employmentStatus, employmentDetails, businesses, business, student, skills } = membershipData.professionalInfo;
  
  // Memoize the statuses array to prevent unnecessary rerenders
  const statuses = useMemo(() => 
    employmentStatus?.status?.split(',').filter(Boolean) || [],
    [employmentStatus?.status]
  );

  // Ensure there's always a value for employment status
  useEffect(() => {
    if (!employmentStatus || !employmentStatus.status || employmentStatus.status.trim() === '') {
      console.log('Initializing employment status to empty string');
      updateProfessionalInfo({ 
        employmentStatus: { status: '' } 
      });
    }
  }, []);

  // Validate status format whenever it changes
  useEffect(() => {
    if (employmentStatus?.status && typeof employmentStatus.status !== 'string') {
      console.error('Employment status has wrong type:', typeof employmentStatus.status);
      // Convert to string if not already
      updateProfessionalInfo({
        employmentStatus: { status: String(employmentStatus.status) }
      });
    }
  }, [employmentStatus?.status, updateProfessionalInfo]);

  const isStatusDisabled = (option: typeof employmentStatusOptions[0]) => {
    // Skip checks if no status is selected
    if (statuses.length === 0) {
      return false;
    }
    
    // If we have the inactive status "other" selected, disable all active statuses
    if (statuses.includes(INACTIVE_STATUS) && option.group === "active") {
      return true;
    }
    
    // If any active status is selected, disable the inactive status
    if (statuses.some(s => ACTIVE_STATUSES.includes(s)) && option.value === INACTIVE_STATUS) {
      return true;
    }
    
    return false;
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

  useEffect(() => {
    // Initialize businesses array if business_owner status is selected
    if (statuses.includes('business_owner')) {
      if (!businesses && business) {
        // Convert old single business format to array
        updateProfessionalInfo({
          businesses: [business]
        });
      } else if (!businesses && !business) {
        // Initialize with empty array if nothing exists
        updateProfessionalInfo({
          businesses: [{
            businessName: "",
            industry: "",
            description: ""
          }]
        });
      }
    }
  }, [statuses, businesses, business, updateProfessionalInfo]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!employmentStatus?.status || employmentStatus.status.trim() === '' || statuses.length === 0) {
      newErrors.status = "Please select at least one employment status";
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
      if (!businesses || businesses.length === 0) {
        newErrors.businesses = "At least one business is required";
      } else {
        businesses.forEach((business, index) => {
          if (!business.businessName?.trim()) {
            newErrors[`businessName_${index}`] = "Business/Service name is required";
          }
          if (!business.industry?.trim()) {
            newErrors[`businessIndustry_${index}`] = "Industry is required";
          }
          if (!business.description?.trim()) {
            newErrors[`description_${index}`] = "Business/Service description is required";
          }
        });
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

  const handleAddBusiness = () => {
    const newBusiness: IBusiness = {
      businessName: "",
      industry: "",
      description: "",
    };
    
    updateProfessionalInfo({
      businesses: [...(businesses || []), newBusiness]
    });
  };

  const handleRemoveBusiness = (index: number) => {
    if (!businesses) return;
    
    const updatedBusinesses = [...businesses];
    updatedBusinesses.splice(index, 1);
    
    updateProfessionalInfo({
      businesses: updatedBusinesses
    });
  };

  const handleBusinessChange = (index: number, field: keyof IBusiness, value: string) => {
    if (!businesses) return;
    
    const updatedBusinesses = [...businesses];
    updatedBusinesses[index] = {
      ...updatedBusinesses[index],
      [field]: value
    };
    
    updateProfessionalInfo({
      businesses: updatedBusinesses
    });
  };

  const handleSkillsChange = (field: keyof ISkills, value: string) => {
    updateProfessionalInfo({
      skills: {
        ...(skills || {}),
        [field]: value
      }
    });
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
        <FormControl isRequired isInvalid={!!errors.industry}>
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
    <VStack spacing={6} align="stretch">
      <HStack justifyContent="space-between">
        <Text fontSize="lg" fontWeight="semibold">Business Information</Text>
        <Button 
          leftIcon={<AddIcon />} 
          size="sm" 
          colorScheme="blue" 
          onClick={handleAddBusiness}
        >
          Add Business
        </Button>
      </HStack>
      
      {businesses?.length === 0 && (
        <Text color="gray.500">Add at least one business or service</Text>
      )}
      
      {businesses?.map((businessItem, index) => (
        <Box 
          key={index} 
          p={4} 
          borderWidth="1px" 
          borderRadius="md" 
          borderColor="gray.200"
          position="relative"
        >
          <HStack justifyContent="space-between" mb={4}>
            <Text fontWeight="medium">Business #{index + 1}</Text>
            {businesses.length > 1 && (
              <IconButton
                aria-label="Remove business"
                icon={<DeleteIcon />}
                size="sm"
                colorScheme="red"
                variant="ghost"
                onClick={() => handleRemoveBusiness(index)}
              />
            )}
          </HStack>
          
          <VStack spacing={4} align="stretch">
            <FormControl isRequired isInvalid={!!errors[`businessName_${index}`]}>
              <FormLabel>Business/Service Name</FormLabel>
              <Input
                bg={inputBg}
                value={businessItem.businessName || ""}
                onChange={(e) => handleBusinessChange(index, 'businessName', e.target.value)}
              />
              <FormErrorMessage>{errors[`businessName_${index}`]}</FormErrorMessage>
            </FormControl>

            <FormControl isRequired isInvalid={!!errors[`businessIndustry_${index}`]}>
              <FormLabel>Industry</FormLabel>
              <Select
                bg={inputBg}
                value={businessItem.industry || ""}
                onChange={(e) => handleBusinessChange(index, 'industry', e.target.value)}
                placeholder="Select Industry"
              >
                {industries.map((industry) => (
                  <option key={industry.id} value={industry.id}>
                    {industry.name}
                  </option>
                ))}
              </Select>
              <FormErrorMessage>{errors[`businessIndustry_${index}`]}</FormErrorMessage>
            </FormControl>

            <FormControl isRequired isInvalid={!!errors[`description_${index}`]}>
              <FormLabel>Business/Service Description</FormLabel>
              <Textarea
                bg={inputBg}
                value={businessItem.description || ""}
                onChange={(e) => handleBusinessChange(index, 'description', e.target.value)}
                placeholder="Describe what your business does or list your services..."
                rows={4}
              />
              <FormErrorMessage>{errors[`description_${index}`]}</FormErrorMessage>
            </FormControl>

            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
              <FormControl>
                <FormLabel>Business Phone Number (Optional)</FormLabel>
                <Input
                  bg={inputBg}
                  type="tel"
                  value={businessItem.phoneNumber || ""}
                  onChange={(e) => handleBusinessChange(index, 'phoneNumber', e.target.value)}
                />
              </FormControl>

              <FormControl>
                <FormLabel>Business Email (Optional)</FormLabel>
                <Input
                  bg={inputBg}
                  type="email"
                  value={businessItem.businessEmail || ""}
                  onChange={(e) => handleBusinessChange(index, 'businessEmail', e.target.value)}
                />
              </FormControl>
            </SimpleGrid>

            <FormControl>
              <FormLabel>Website (Optional)</FormLabel>
              <Input
                bg={inputBg}
                type="url"
                value={businessItem.website || ""}
                onChange={(e) => handleBusinessChange(index, 'website', e.target.value)}
              />
            </FormControl>
          </VStack>
          {index < businesses.length - 1 && <Divider my={4} />}
        </Box>
      ))}
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

  const renderSkillsFields = () => (
    <VStack spacing={4} align="stretch">
      <Text fontSize="lg" fontWeight="semibold" mb={2}>
        Skills Information (For Internal Use Only)
      </Text>
      <FormControl>
        <FormLabel>Skills (Optional)</FormLabel>
        <Input
          bg={inputBg}
          value={skills?.skills || ""}
          onChange={(e) => handleSkillsChange('skills', e.target.value)}
          placeholder="Enter your skills..."
        />
      </FormControl>
      <FormControl>
        <FormLabel>Additional Description (Optional)</FormLabel>
        <Textarea
          bg={inputBg}
          value={skills?.description || ""}
          onChange={(e) => handleSkillsChange('description', e.target.value)}
          placeholder="Additional information about your skills and expertise..."
          rows={4}
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
                  let newStatus = [...statuses];
                  
                  if (e.target.checked) {
                    // Adding a status
                    if (option.value === INACTIVE_STATUS) {
                      // If selecting "other", clear all active statuses
                      newStatus = [INACTIVE_STATUS];
                    } else {
                      // If selecting an active status, remove "other" if present
                      newStatus = newStatus.filter(s => s !== INACTIVE_STATUS);
                      // Add the new active status
                      newStatus.push(option.value);
                    }
                  } else {
                    // Removing a status
                    newStatus = newStatus.filter(s => s !== option.value);
                    
                    // Don't default to "other" automatically
                  }
                  
                  if (e.target.checked && option.value === 'business_owner' && (!businesses || businesses.length === 0)) {
                    // Initialize with one empty business when business_owner is selected
                    updateProfessionalInfo({
                      employmentStatus: { status: newStatus.join(',') },
                      businesses: [{
                        businessName: "",
                        industry: "",
                        description: ""
                      }]
                    });
                  } else {
                    updateProfessionalInfo({
                      employmentStatus: { status: newStatus.join(',') },
                    });
                  }
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
              {renderBusinessOwnerFields()}
            </Box>
          )}
          {statuses.includes('student') && (
            <Box mb={8}>
              <Text fontSize="lg" fontWeight="semibold" mb={4}>Student Information</Text>
              {renderStudentFields()}
            </Box>
          )}
          
          <Box mb={8}>
            {renderSkillsFields()}
          </Box>
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
