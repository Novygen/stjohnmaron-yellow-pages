"use client";

import { useState, useEffect } from 'react';
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
  SkeletonText,
  Select,
  Divider,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Flex,
  IconButton,
  Card,
  CardBody,
  CardHeader,
  HStack,
  Radio,
  RadioGroup,
  Stack,
  FormHelperText,
} from "@chakra-ui/react";
import withAuth from "@/hoc/withAuth";
import { useMemberProfile, MemberProfile, IEmployment, IVisibility } from "@/app/hooks/useMemberProfile";
import { AddIcon, DeleteIcon } from '@chakra-ui/icons';

// Define a type for visibility option values
type VisibilityValue = 'private' | 'public' | 'members';

// Visibility option mapping for display
const visibilityOptions = [
  { value: 'private' as VisibilityValue, label: 'Private (Only you)' },
  { value: 'members' as VisibilityValue, label: 'Members (All approved members)' },
  { value: 'public' as VisibilityValue, label: 'Public (Anyone visiting the site)' },
];

export default withAuth(ProfilePage);

function ProfilePage() {
  const { profile, loading, error, updateProfile } = useMemberProfile();
  const [formData, setFormData] = useState<Partial<MemberProfile> | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();

  const alertBg = useColorModeValue("red.50", "red.900");
  const alertBorder = useColorModeValue("red.100", "red.800");

  useEffect(() => {
    if (profile) {
      setFormData(profile);
    }
  }, [profile]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Handle nested properties
    if (name.includes('.')) {
      const [parent, child, subChild] = name.split('.');
      
      setFormData(prev => {
        if (!prev) return prev;
        
        if (subChild) {
          // Handle three-level nesting (e.g., address.line1)
          const parentObj = (prev[parent as keyof MemberProfile] || {}) as Record<string, unknown>;
          const childObj = (parentObj[child] || {}) as Record<string, unknown>;
          
          return {
            ...prev,
            [parent]: {
              ...parentObj,
              [child]: {
                ...childObj,
                [subChild]: value
              }
            }
          };
        } else {
          // Handle two-level nesting (e.g., address.line1)
          const parentObj = (prev[parent as keyof MemberProfile] || {}) as object;
          
          return {
            ...prev,
            [parent]: {
              ...parentObj,
              [child]: value
            }
          };
        }
      });
    } else {
      // Handle top-level properties
      setFormData(prev => prev ? { ...prev, [name]: value } : null);
    }
  };

  const handleVisibilityChange = (section: string, value: VisibilityValue) => {
    setFormData(prev => {
      if (!prev) return prev;

      // Start with current visibility or empty object if undefined
      const currentVisibility = prev.visibility || {
        profile: 'private' as VisibilityValue,
        contact: { 
          email: 'private' as VisibilityValue, 
          phone: 'private' as VisibilityValue, 
          address: 'private' as VisibilityValue 
        },
        employment: { 
          current: 'private' as VisibilityValue, 
          history: 'private' as VisibilityValue 
        },
        social: 'private' as VisibilityValue
      };
      
      // Create a deep copy to avoid mutation
      const updatedVisibility = JSON.parse(JSON.stringify(currentVisibility)) as typeof currentVisibility;
      
      // Update the specific section
      switch (section) {
        case 'profile':
          updatedVisibility.profile = value;
          break;
        case 'contact.email':
          updatedVisibility.contact.email = value;
          break;
        case 'contact.phone':
          updatedVisibility.contact.phone = value;
          break;
        case 'contact.address':
          updatedVisibility.contact.address = value;
          break;
        case 'employment.current':
          updatedVisibility.employment.current = value;
          break;
        case 'employment.history':
          updatedVisibility.employment.history = value;
          break;
        case 'social':
          updatedVisibility.social = value;
          break;
        default:
          console.warn(`Unknown visibility section: ${section}`);
      }
      
      return {
        ...prev,
        visibility: updatedVisibility as IVisibility
      };
    });
  };

  const handleSocialChange = (field: string, value: string) => {
    setFormData(prev => {
      if (!prev) return prev;
      
      // Map the UI field names to the API field names
      const fieldMapping: Record<string, string> = {
        'linkedin': 'linkedInProfile',
        'website': 'personalWebsite',
        'instagram': 'instagramProfile',
        'facebook': 'facebookProfile',
        'twitter': 'xProfile'
      };
      
      // Use the mapped field name or the original if not in mapping
      const apiFieldName = fieldMapping[field] || field;
      
      return {
        ...prev,
        socialPresence: {
          ...prev.socialPresence,
          [apiFieldName]: value
        }
      };
    });
  };

  const handleEmploymentChange = (index: number, field: string, value: string) => {
    setFormData(prev => {
      if (!prev || !prev.employments) return prev;
      
      const updatedEmployments = [...prev.employments];
      
      if (field.includes('.')) {
        const [parent, child] = field.split('.');
        const parentObj = (updatedEmployments[index][parent as keyof IEmployment] || {}) as object;
        
        updatedEmployments[index] = {
          ...updatedEmployments[index],
          [parent]: {
            ...parentObj,
            [child]: value
          }
        };
      } else {
        updatedEmployments[index] = {
          ...updatedEmployments[index],
          [field]: value
        };
      }
      
      return {
        ...prev,
        employments: updatedEmployments
      };
    });
  };

  const addEmployment = (type: 'employed' | 'business_owner' | 'student') => {
    setFormData(prev => {
      if (!prev) return prev;
      
      let newEmployment: IEmployment;
      
      switch (type) {
        case 'employed':
          newEmployment = {
            type: 'employed',
            details: {
              companyName: '',
              jobTitle: '',
              specialization: ''
            },
            isActive: true
          };
          break;
        case 'business_owner':
          newEmployment = {
            type: 'business_owner',
            details: {
              businessName: '',
              industry: '',
              description: '',
              website: '',
              phoneNumber: '',
              businessEmail: ''
            },
            isActive: true
          };
          break;
        case 'student':
          newEmployment = {
            type: 'student',
            details: {
              schoolName: '',
              fieldOfStudy: '',
              expectedGraduationYear: ''
            },
            isActive: true
          };
          break;
      }
      
      return {
        ...prev,
        employments: [...(prev.employments || []), newEmployment]
      };
    });
  };

  const removeEmployment = (index: number) => {
    setFormData(prev => {
      if (!prev || !prev.employments) return prev;
      
      const updatedEmployments = [...prev.employments];
      updatedEmployments.splice(index, 1);
      
      return {
        ...prev,
        employments: updatedEmployments
      };
    });
  };

  const handleSkillsChange = (field: 'skills' | 'description', value: string) => {
    setFormData(prev => {
      if (!prev) return prev;
      
      const updatedSkills = { ...(prev.skills || { skills: '', description: '' }) };
      updatedSkills[field] = value;
      
      return {
        ...prev,
        skills: updatedSkills
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Exit early if no form data
    if (!formData) return;

    setIsSubmitting(true);
    try {
      // If profile isn't approved yet, only allow updating basic personal info
      const updatesToSubmit = profile?.isApproved 
        ? formData // Submit all updates for approved members
        : {
            // Only allow basic personal details updates for non-approved members
            firstName: formData.firstName,
            lastName: formData.lastName,
            middleName: formData.middleName,
            state: formData.state
          };
      
      const result = await updateProfile(updatesToSubmit);
      
      if (result) {
        toast({
          title: "Profile updated",
          description: profile?.isApproved 
            ? "Your profile has been updated successfully." 
            : "Your basic information has been updated. Full profile editing will be available after approval.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      } else {
        throw new Error("Failed to update profile");
      }
    } catch (error) {
      toast({
        title: "Update failed",
        description: error instanceof Error ? error.message : "Something went wrong. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
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

        <form onSubmit={handleSubmit}>
          <VStack spacing={6} align="stretch">
            {/* Personal Information Section */}
            <Accordion defaultIndex={[0]} allowMultiple>
              <AccordionItem>
                <AccordionButton>
                  <Heading as="h2" size="md" flex="1" textAlign="left">
                    Personal Information
                  </Heading>
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel pb={4}>
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                    <FormControl isRequired>
                      <FormLabel>First Name</FormLabel>
                      {loading ? (
                        <SkeletonText />
                      ) : (
                        <Input
                          name="firstName"
                          value={formData?.firstName || ''}
                          onChange={handleInputChange}
                          isDisabled={isSubmitting}
                        />
                      )}
                    </FormControl>
                    
                    <FormControl>
                      <FormLabel>Middle Name</FormLabel>
                      {loading ? (
                        <SkeletonText />
                      ) : (
                        <Input
                          name="middleName"
                          value={formData?.middleName || ''}
                          onChange={handleInputChange}
                          isDisabled={isSubmitting}
                        />
                      )}
                    </FormControl>
                    
                    <FormControl isRequired>
                      <FormLabel>Last Name</FormLabel>
                      {loading ? (
                        <SkeletonText />
                      ) : (
                        <Input
                          name="lastName"
                          value={formData?.lastName || ''}
                          onChange={handleInputChange}
                          isDisabled={isSubmitting}
                        />
                      )}
                    </FormControl>
                    
                    <FormControl>
                      <FormLabel>State</FormLabel>
                      {loading ? (
                        <SkeletonText />
                      ) : (
                        <Input
                          name="state"
                          value={formData?.state || ''}
                          onChange={handleInputChange}
                          isDisabled={isSubmitting}
                        />
                      )}
                    </FormControl>
                    
                    <FormControl>
                      <FormLabel>Parish Status</FormLabel>
                      {loading ? (
                        <SkeletonText />
                      ) : (
                        <Select
                          name="parishStatus"
                          value={formData?.parishStatus || ''}
                          onChange={handleInputChange}
                          isDisabled={isSubmitting}
                        >
                          <option value="">Select status</option>
                          <option value="member">Parish Member</option>
                          <option value="visitor">Visitor</option>
                          <option value="other_parish">Member of Another Parish</option>
                        </Select>
                      )}
                    </FormControl>
                    
                    <FormControl>
                      <FormLabel>Age Range</FormLabel>
                      {loading ? (
                        <SkeletonText />
                      ) : (
                        <Select
                          name="ageRange"
                          value={formData?.ageRange || ''}
                          onChange={handleInputChange}
                          isDisabled={isSubmitting}
                        >
                          <option value="">Select age range</option>
                          <option value="18-24">18-24</option>
                          <option value="25-34">25-34</option>
                          <option value="35-44">35-44</option>
                          <option value="45-54">45-54</option>
                          <option value="55-64">55-64</option>
                          <option value="65+">65+</option>
                        </Select>
                      )}
                    </FormControl>
                  </SimpleGrid>
                </AccordionPanel>
              </AccordionItem>
              
              {/* Contact Information Section */}
              <AccordionItem>
                <AccordionButton>
                  <Heading as="h2" size="md" flex="1" textAlign="left">
                    Contact Information
                  </Heading>
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel pb={4}>
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                    <FormControl>
                      <FormLabel>Email</FormLabel>
                      {loading ? (
                        <SkeletonText />
                      ) : (
                        <Input
                          name="email"
                          value={formData?.email || ''}
                          isReadOnly
                          isDisabled={true}
                        />
                      )}
                      <FormHelperText>Email cannot be changed as it&apos;s linked to your account</FormHelperText>
                    </FormControl>
                    
                    <FormControl>
                      <FormLabel>Phone</FormLabel>
                      {loading ? (
                        <SkeletonText />
                      ) : (
                        <Input
                          name="phone"
                          value={formData?.phone || ''}
                          onChange={handleInputChange}
                          isDisabled={isSubmitting || !profile?.isApproved}
                        />
                      )}
                    </FormControl>
                  </SimpleGrid>
                  
                  <Box mt={4}>
                    <FormLabel>Address</FormLabel>
                    <VStack spacing={3}>
                      <FormControl>
                        <FormLabel fontSize="sm">Line 1</FormLabel>
                        {loading ? (
                          <SkeletonText />
                        ) : (
                          <Input
                            name="address.line1"
                            value={formData?.address?.line1 || ''}
                            onChange={handleInputChange}
                            isDisabled={isSubmitting || !profile?.isApproved}
                          />
                        )}
                      </FormControl>
                      
                      <FormControl>
                        <FormLabel fontSize="sm">Line 2</FormLabel>
                        {loading ? (
                          <SkeletonText />
                        ) : (
                          <Input
                            name="address.line2"
                            value={formData?.address?.line2 || ''}
                            onChange={handleInputChange}
                            isDisabled={isSubmitting || !profile?.isApproved}
                          />
                        )}
                      </FormControl>
                      
                      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={3} width="100%">
                        <FormControl>
                          <FormLabel fontSize="sm">City</FormLabel>
                          {loading ? (
                            <SkeletonText />
                          ) : (
                            <Input
                              name="address.city"
                              value={formData?.address?.city || ''}
                              onChange={handleInputChange}
                              isDisabled={isSubmitting || !profile?.isApproved}
                            />
                          )}
                        </FormControl>
                        
                        <FormControl>
                          <FormLabel fontSize="sm">State</FormLabel>
                          {loading ? (
                            <SkeletonText />
                          ) : (
                            <Input
                              name="address.state"
                              value={formData?.address?.state || ''}
                              onChange={handleInputChange}
                              isDisabled={isSubmitting || !profile?.isApproved}
                            />
                          )}
                        </FormControl>
                        
                        <FormControl>
                          <FormLabel fontSize="sm">ZIP Code</FormLabel>
                          {loading ? (
                            <SkeletonText />
                          ) : (
                            <Input
                              name="address.zip"
                              value={formData?.address?.zip || ''}
                              onChange={handleInputChange}
                              isDisabled={isSubmitting || !profile?.isApproved}
                            />
                          )}
                        </FormControl>
                      </SimpleGrid>
                    </VStack>
                  </Box>
                  
                  <Box mt={4}>
                    <FormControl>
                      <FormLabel>Contact Visibility Settings</FormLabel>
                      <Text fontSize="sm" color="gray.600" mb={2}>
                        Control who can see your contact information
                      </Text>
                      
                      {loading ? (
                        <SkeletonText />
                      ) : (
                        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
                          <Box>
                            <Text fontWeight="medium" mb={1}>Email</Text>
                            <RadioGroup
                              value={formData?.visibility?.contact?.email || 'private'}
                              onChange={(value) => handleVisibilityChange('contact.email', value as VisibilityValue)}
                            >
                              <Stack direction="column" spacing={1}>
                                {visibilityOptions.map(option => (
                                  <Radio key={option.value} value={option.value} size="sm" isDisabled={isSubmitting || !profile?.isApproved}>
                                    {option.label}
                                  </Radio>
                                ))}
                              </Stack>
                            </RadioGroup>
                          </Box>
                          
                          <Box>
                            <Text fontWeight="medium" mb={1}>Phone</Text>
                            <RadioGroup
                              value={formData?.visibility?.contact?.phone || 'private'}
                              onChange={(value) => handleVisibilityChange('contact.phone', value as VisibilityValue)}
                            >
                              <Stack direction="column" spacing={1}>
                                {visibilityOptions.map(option => (
                                  <Radio key={option.value} value={option.value} size="sm" isDisabled={isSubmitting || !profile?.isApproved}>
                                    {option.label}
                                  </Radio>
                                ))}
                              </Stack>
                            </RadioGroup>
                          </Box>
                          
                          <Box>
                            <Text fontWeight="medium" mb={1}>Address</Text>
                            <RadioGroup
                              value={formData?.visibility?.contact?.address || 'private'}
                              onChange={(value) => handleVisibilityChange('contact.address', value as VisibilityValue)}
                            >
                              <Stack direction="column" spacing={1}>
                                {visibilityOptions.map(option => (
                                  <Radio key={option.value} value={option.value} size="sm" isDisabled={isSubmitting || !profile?.isApproved}>
                                    {option.label}
                                  </Radio>
                                ))}
                              </Stack>
                            </RadioGroup>
                          </Box>
                        </SimpleGrid>
                      )}
                    </FormControl>
                  </Box>
                </AccordionPanel>
              </AccordionItem>
              
              {/* Professional Information Section */}
              <AccordionItem>
                <AccordionButton>
                  <Heading as="h2" size="md" flex="1" textAlign="left">
                    Professional Information
                  </Heading>
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel pb={4}>
                  {/* Employment Information */}
                  <Box mb={6}>
                    <Flex justify="space-between" align="center" mb={4}>
                      <Heading as="h3" size="sm">Employment</Heading>
                      <HStack>
                        <Button 
                          leftIcon={<AddIcon />} 
                          size="sm" 
                          colorScheme="teal" 
                          onClick={() => addEmployment('employed')}
                          isDisabled={isSubmitting || !profile?.isApproved}
                        >
                          Add Job
                        </Button>
                        <Button 
                          leftIcon={<AddIcon />} 
                          size="sm" 
                          colorScheme="blue" 
                          onClick={() => addEmployment('business_owner')}
                          isDisabled={isSubmitting || !profile?.isApproved}
                        >
                          Add Business
                        </Button>
                        <Button 
                          leftIcon={<AddIcon />} 
                          size="sm" 
                          colorScheme="purple" 
                          onClick={() => addEmployment('student')}
                          isDisabled={isSubmitting || !profile?.isApproved}
                        >
                          Add Education
                        </Button>
                      </HStack>
                    </Flex>
                    
                    {loading ? (
                      <SkeletonText noOfLines={5} />
                    ) : (
                      <VStack spacing={4} align="stretch">
                        {formData?.employments?.map((employment, index) => (
                          <Card key={index}>
                            <CardHeader pb={2}>
                              <Flex justify="space-between" align="center">
                                <Heading size="xs" textTransform="uppercase">
                                  {employment.type === 'employed' ? 'Employment' : 
                                   employment.type === 'business_owner' ? 'Business' : 'Education'}
                                </Heading>
                                <IconButton
                                  aria-label="Remove employment"
                                  icon={<DeleteIcon />}
                                  size="sm"
                                  colorScheme="red"
                                  variant="ghost"
                                  onClick={() => removeEmployment(index)}
                                  isDisabled={isSubmitting || !profile?.isApproved}
                                />
                              </Flex>
                            </CardHeader>
                            <CardBody pt={0}>
                              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                                {employment.type === 'employed' && (
                                  <>
                                    <FormControl>
                                      <FormLabel fontSize="sm">Company</FormLabel>
                                      <Input
                                        value={employment.details.companyName || ''}
                                        onChange={(e) => handleEmploymentChange(index, 'details.companyName', e.target.value)}
                                        isDisabled={isSubmitting || !profile?.isApproved}
                                      />
                                    </FormControl>
                                    <FormControl>
                                      <FormLabel fontSize="sm">Job Title</FormLabel>
                                      <Input
                                        value={employment.details.jobTitle || ''}
                                        onChange={(e) => handleEmploymentChange(index, 'details.jobTitle', e.target.value)}
                                        isDisabled={isSubmitting || !profile?.isApproved}
                                      />
                                    </FormControl>
                                    <FormControl>
                                      <FormLabel fontSize="sm">Specialization</FormLabel>
                                      <Input
                                        value={employment.details.specialization || ''}
                                        onChange={(e) => handleEmploymentChange(index, 'details.specialization', e.target.value)}
                                        isDisabled={isSubmitting || !profile?.isApproved}
                                      />
                                    </FormControl>
                                  </>
                                )}
                                
                                {employment.type === 'business_owner' && (
                                  <>
                                    <FormControl>
                                      <FormLabel fontSize="sm">Business Name</FormLabel>
                                      <Input
                                        value={employment.details.businessName || ''}
                                        onChange={(e) => handleEmploymentChange(index, 'details.businessName', e.target.value)}
                                        isDisabled={isSubmitting || !profile?.isApproved}
                                      />
                                    </FormControl>
                                    <FormControl>
                                      <FormLabel fontSize="sm">Industry</FormLabel>
                                      <Input
                                        value={employment.details.industry || ''}
                                        onChange={(e) => handleEmploymentChange(index, 'details.industry', e.target.value)}
                                        isDisabled={isSubmitting || !profile?.isApproved}
                                      />
                                    </FormControl>
                                    <FormControl gridColumn={{ md: "span 2" }}>
                                      <FormLabel fontSize="sm">Description</FormLabel>
                                      <Textarea
                                        value={employment.details.description || ''}
                                        onChange={(e) => handleEmploymentChange(index, 'details.description', e.target.value)}
                                        isDisabled={isSubmitting || !profile?.isApproved}
                                      />
                                    </FormControl>
                                    <FormControl>
                                      <FormLabel fontSize="sm">Website</FormLabel>
                                      <Input
                                        value={employment.details.website || ''}
                                        onChange={(e) => handleEmploymentChange(index, 'details.website', e.target.value)}
                                        isDisabled={isSubmitting || !profile?.isApproved}
                                      />
                                    </FormControl>
                                    <FormControl>
                                      <FormLabel fontSize="sm">Business Email</FormLabel>
                                      <Input
                                        value={employment.details.businessEmail || ''}
                                        onChange={(e) => handleEmploymentChange(index, 'details.businessEmail', e.target.value)}
                                        isDisabled={isSubmitting || !profile?.isApproved}
                                      />
                                    </FormControl>
                                    <FormControl>
                                      <FormLabel fontSize="sm">Business Phone</FormLabel>
                                      <Input
                                        value={employment.details.phoneNumber || ''}
                                        onChange={(e) => handleEmploymentChange(index, 'details.phoneNumber', e.target.value)}
                                        isDisabled={isSubmitting || !profile?.isApproved}
                                      />
                                    </FormControl>
                                  </>
                                )}
                                
                                {employment.type === 'student' && (
                                  <>
                                    <FormControl>
                                      <FormLabel fontSize="sm">School</FormLabel>
                                      <Input
                                        value={employment.details.schoolName || ''}
                                        onChange={(e) => handleEmploymentChange(index, 'details.schoolName', e.target.value)}
                                        isDisabled={isSubmitting || !profile?.isApproved}
                                      />
                                    </FormControl>
                                    <FormControl>
                                      <FormLabel fontSize="sm">Field of Study</FormLabel>
                                      <Input
                                        value={employment.details.fieldOfStudy || ''}
                                        onChange={(e) => handleEmploymentChange(index, 'details.fieldOfStudy', e.target.value)}
                                        isDisabled={isSubmitting || !profile?.isApproved}
                                      />
                                    </FormControl>
                                    <FormControl>
                                      <FormLabel fontSize="sm">Expected Graduation Year</FormLabel>
                                      <Input
                                        value={employment.details.expectedGraduationYear || ''}
                                        onChange={(e) => handleEmploymentChange(index, 'details.expectedGraduationYear', e.target.value)}
                                        isDisabled={isSubmitting || !profile?.isApproved}
                                      />
                                    </FormControl>
                                  </>
                                )}
                              </SimpleGrid>
                            </CardBody>
                          </Card>
                        ))}
                        
                        {(!formData?.employments || formData.employments.length === 0) && (
                          <Text color="gray.500" textAlign="center">
                            No employment information added. Use the buttons above to add.
                          </Text>
                        )}
                      </VStack>
                    )}
                  </Box>
                  
                  {/* Skills */}
                  <Box mb={6}>
                    <Heading as="h3" size="sm" mb={4}>Skills</Heading>
                    <FormControl mb={4}>
                      <FormLabel>Skills</FormLabel>
                      {loading ? (
                        <SkeletonText />
                      ) : (
                        <Input
                          value={formData?.skills?.skills || ''}
                          onChange={(e) => handleSkillsChange('skills', e.target.value)}
                          placeholder="E.g., Project Management, Web Development, Marketing"
                          isDisabled={isSubmitting || !profile?.isApproved}
                        />
                      )}
                    </FormControl>
                    
                    <FormControl>
                      <FormLabel>Skills Description / Bio</FormLabel>
                      {loading ? (
                        <SkeletonText />
                      ) : (
                        <Textarea
                          value={formData?.skills?.description || ''}
                          onChange={(e) => handleSkillsChange('description', e.target.value)}
                          placeholder="Write a brief description of your skills and professional background..."
                          rows={4}
                          isDisabled={isSubmitting || !profile?.isApproved}
                        />
                      )}
                    </FormControl>
                  </Box>
                  
                  {/* Employment Visibility */}
                  <Box mb={4}>
                    <FormControl>
                      <FormLabel>Employment Visibility Settings</FormLabel>
                      <Text fontSize="sm" color="gray.600" mb={2}>
                        Control who can see your professional information
                      </Text>
                      
                      {loading ? (
                        <SkeletonText />
                      ) : (
                        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                          <Box>
                            <Text fontWeight="medium" mb={1}>Current Employment</Text>
                            <RadioGroup
                              value={formData?.visibility?.employment?.current || 'private'}
                              onChange={(value) => handleVisibilityChange('employment.current', value as VisibilityValue)}
                            >
                              <Stack direction="column" spacing={1}>
                                {visibilityOptions.map(option => (
                                  <Radio key={option.value} value={option.value} size="sm" isDisabled={isSubmitting || !profile?.isApproved}>
                                    {option.label}
                                  </Radio>
                                ))}
                              </Stack>
                            </RadioGroup>
                          </Box>
                          
                          <Box>
                            <Text fontWeight="medium" mb={1}>Employment History</Text>
                            <RadioGroup
                              value={formData?.visibility?.employment?.history || 'private'}
                              onChange={(value) => handleVisibilityChange('employment.history', value as VisibilityValue)}
                            >
                              <Stack direction="column" spacing={1}>
                                {visibilityOptions.map(option => (
                                  <Radio key={option.value} value={option.value} size="sm" isDisabled={isSubmitting || !profile?.isApproved}>
                                    {option.label}
                                  </Radio>
                                ))}
                              </Stack>
                            </RadioGroup>
                          </Box>
                        </SimpleGrid>
                      )}
                    </FormControl>
                  </Box>
                </AccordionPanel>
              </AccordionItem>
              
              {/* Social Media Section */}
              <AccordionItem>
                <AccordionButton>
                  <Heading as="h2" size="md" flex="1" textAlign="left">
                    Social Media
                  </Heading>
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel pb={4}>
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                    <FormControl>
                      <FormLabel>LinkedIn</FormLabel>
                      {loading ? (
                        <SkeletonText />
                      ) : (
                        <Input
                          value={formData?.socialPresence?.linkedInProfile || ''}
                          onChange={(e) => handleSocialChange('linkedin', e.target.value)}
                          placeholder="https://linkedin.com/in/your-profile"
                          isDisabled={isSubmitting || !profile?.isApproved}
                        />
                      )}
                    </FormControl>
                    
                    <FormControl>
                      <FormLabel>Facebook</FormLabel>
                      {loading ? (
                        <SkeletonText />
                      ) : (
                        <Input
                          value={formData?.socialPresence?.facebookProfile || ''}
                          onChange={(e) => handleSocialChange('facebook', e.target.value)}
                          placeholder="https://facebook.com/your-profile"
                          isDisabled={isSubmitting || !profile?.isApproved}
                        />
                      )}
                    </FormControl>
                    
                    <FormControl>
                      <FormLabel>Instagram</FormLabel>
                      {loading ? (
                        <SkeletonText />
                      ) : (
                        <Input
                          value={formData?.socialPresence?.instagramProfile || ''}
                          onChange={(e) => handleSocialChange('instagram', e.target.value)}
                          placeholder="https://instagram.com/your-profile"
                          isDisabled={isSubmitting || !profile?.isApproved}
                        />
                      )}
                    </FormControl>
                    
                    <FormControl>
                      <FormLabel>Twitter</FormLabel>
                      {loading ? (
                        <SkeletonText />
                      ) : (
                        <Input
                          value={formData?.socialPresence?.xProfile || ''}
                          onChange={(e) => handleSocialChange('twitter', e.target.value)}
                          placeholder="https://twitter.com/your-profile"
                          isDisabled={isSubmitting || !profile?.isApproved}
                        />
                      )}
                    </FormControl>
                    
                    <FormControl>
                      <FormLabel>Personal Website</FormLabel>
                      {loading ? (
                        <SkeletonText />
                      ) : (
                        <Input
                          value={formData?.socialPresence?.personalWebsite || ''}
                          onChange={(e) => handleSocialChange('website', e.target.value)}
                          placeholder="https://your-website.com"
                          isDisabled={isSubmitting || !profile?.isApproved}
                        />
                      )}
                    </FormControl>
                  </SimpleGrid>
                  
                  {/* Social Media Visibility */}
                  <Box mt={4}>
                    <FormControl>
                      <FormLabel>Social Media Visibility</FormLabel>
                      <Text fontSize="sm" color="gray.600" mb={2}>
                        Who can see your social media links?
                      </Text>
                      {loading ? (
                        <SkeletonText />
                      ) : (
                        <RadioGroup
                          value={formData?.visibility?.social || 'private'}
                          onChange={(value) => handleVisibilityChange('social', value as VisibilityValue)}
                        >
                          <Stack direction="column">
                            {visibilityOptions.map(option => (
                              <Radio key={option.value} value={option.value} isDisabled={isSubmitting || !profile?.isApproved}>
                                {option.label}
                              </Radio>
                            ))}
                          </Stack>
                        </RadioGroup>
                      )}
                    </FormControl>
                  </Box>
                </AccordionPanel>
              </AccordionItem>
            </Accordion>
            
            <Divider my={6} />
            
            <Button
              type="submit"
              colorScheme="blue"
              size="lg"
              isLoading={isSubmitting}
              loadingText="Updating..."
              isDisabled={loading}
            >
              Update Profile
            </Button>
          </VStack>
        </form>
      </VStack>
    </Container>
  );
} 