/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import {
  Box,
  Button,
  Card,
  CardBody,
  FormControl,
  FormLabel,
  Grid,
  GridItem,
  Heading,
  Input,
  Select,
  Stack,
  VStack,
  useToast,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/firebase';
import withAuth from '@/hoc/withAuth';

function MembershipRequestPage() {
  const [user] = useAuthState(auth);
  const [previousRequest, setPreviousRequest] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    personalDetails: {
      firstName: '',
      lastName: '',
      middleName: '',
      ageRange: '',
      state: '',
    },
    contactInformation: {
      primaryEmail: '',
      primaryPhoneNumber: '',
      address: {
        line1: '',
        line2: '',
        city: '',
        state: '',
        zip: '',
        country: '',
      },
    },
    professionalInfo: {
      employmentStatus: {
        status: '',
      },
      employmentDetails: {
        companyName: '',
        jobTitle: '',
        specialization: '',
      },
      business: {
        businessName: '',
        industry: '',
        description: '',
        website: '',
        phoneNumber: '',
      },
      student: {
        schoolName: '',
        fieldOfStudy: '',
        expectedGraduationYear: '',
      },
    },
    socialPresence: {
      linkedInProfile: '',
      personalWebsite: '',
    },
  });

  const router = useRouter();
  const toast = useToast();

  useEffect(() => {
    const checkPreviousRequest = async () => {
      try {
        const idToken = await user?.getIdToken();
        const response = await fetch('/api/membership-request/check', {
          headers: {
            'Authorization': `Bearer ${idToken}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          if (data.request) {
            setPreviousRequest(data.request);
            if (data.request.notes) {
              // Pre-fill form with previous data if request was rejected
              setFormData({
                ...data.request,
                memberLogin: undefined,
                isApproved: undefined,
                softDeleted: undefined,
                lastModifiedBy: undefined,
                notes: undefined,
              });
            }
          }
        }
      } catch (error) {
        console.error('Error checking previous request:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      checkPreviousRequest();
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const idToken = await user?.getIdToken();
      const response = await fetch('/api/membership-request', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${idToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          memberLogin: {
            uid: user?.uid,
            email: user?.email,
          },
        }),
      });

      if (response.ok) {
        toast({
          title: 'Membership request submitted successfully',
          status: 'success',
          duration: 3000,
        });
        router.push('/dashboard');
      } else {
        toast({
          title: 'Error submitting membership request',
          status: 'error',
          duration: 3000,
        });
      }
    } catch (error) {
      console.error('Failed to submit membership request:', error);
      toast({
        title: 'Error submitting membership request',
        status: 'error',
        duration: 3000,
      });
    }
  };

  if (isLoading) {
    return <Box p={4}>Loading...</Box>;
  }

  if (previousRequest && !previousRequest.softDeleted) {
    return (
      <Box p={4}>
        <Alert
          status={previousRequest.isApproved ? 'success' : 'info'}
          variant="subtle"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          textAlign="center"
          height="200px"
          borderRadius="md"
        >
          <AlertIcon boxSize="40px" mr={0} />
          <AlertTitle mt={4} mb={1} fontSize="lg">
            {previousRequest.isApproved
              ? 'Your membership has been approved!'
              : 'Your membership request is pending'}
          </AlertTitle>
          <AlertDescription maxWidth="sm">
            {previousRequest.isApproved
              ? 'You can now access all member features.'
              : 'Our team is reviewing your application. We will notify you once a decision has been made.'}
          </AlertDescription>
        </Alert>
      </Box>
    );
  }

  return (
    <Box p={4}>
      <VStack spacing={4} align="stretch">
        <Card>
          <CardBody>
            <VStack spacing={6} align="stretch">
              <Heading size="lg">Membership Application</Heading>

              {previousRequest?.notes && (
                <Alert status="info" mb={4}>
                  <AlertIcon />
                  <Box>
                    <AlertTitle>Previous Application Feedback</AlertTitle>
                    <AlertDescription>
                      {previousRequest.notes}
                    </AlertDescription>
                  </Box>
                </Alert>
              )}

              <form onSubmit={handleSubmit}>
                <Stack spacing={6}>
                  <Box>
                    <Heading size="md" mb={4}>Personal Information</Heading>
                    <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={4}>
                      <GridItem>
                        <FormControl isRequired>
                          <FormLabel>First Name</FormLabel>
                          <Input
                            value={formData.personalDetails.firstName}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                personalDetails: {
                                  ...formData.personalDetails,
                                  firstName: e.target.value,
                                },
                              })
                            }
                          />
                        </FormControl>
                      </GridItem>
                      <GridItem>
                        <FormControl isRequired>
                          <FormLabel>Last Name</FormLabel>
                          <Input
                            value={formData.personalDetails.lastName}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                personalDetails: {
                                  ...formData.personalDetails,
                                  lastName: e.target.value,
                                },
                              })
                            }
                          />
                        </FormControl>
                      </GridItem>
                      <GridItem>
                        <FormControl>
                          <FormLabel>Middle Name</FormLabel>
                          <Input
                            value={formData.personalDetails.middleName}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                personalDetails: {
                                  ...formData.personalDetails,
                                  middleName: e.target.value,
                                },
                              })
                            }
                          />
                        </FormControl>
                      </GridItem>
                      <GridItem>
                        <FormControl isRequired>
                          <FormLabel>Age Range</FormLabel>
                          <Select
                            value={formData.personalDetails.ageRange}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                personalDetails: {
                                  ...formData.personalDetails,
                                  ageRange: e.target.value,
                                },
                              })
                            }
                          >
                            <option value="">Select Age Range</option>
                            <option value="18-24">18-24</option>
                            <option value="25-34">25-34</option>
                            <option value="35-44">35-44</option>
                            <option value="45-54">45-54</option>
                            <option value="55-64">55-64</option>
                            <option value="65+">65+</option>
                          </Select>
                        </FormControl>
                      </GridItem>
                    </Grid>
                  </Box>

                  <Box>
                    <Heading size="md" mb={4}>Contact Information</Heading>
                    <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={4}>
                      <GridItem>
                        <FormControl isRequired>
                          <FormLabel>Email</FormLabel>
                          <Input
                            type="email"
                            value={formData.contactInformation.primaryEmail}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                contactInformation: {
                                  ...formData.contactInformation,
                                  primaryEmail: e.target.value,
                                },
                              })
                            }
                          />
                        </FormControl>
                      </GridItem>
                      <GridItem>
                        <FormControl isRequired>
                          <FormLabel>Phone Number</FormLabel>
                          <Input
                            value={formData.contactInformation.primaryPhoneNumber}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                contactInformation: {
                                  ...formData.contactInformation,
                                  primaryPhoneNumber: e.target.value,
                                },
                              })
                            }
                          />
                        </FormControl>
                      </GridItem>
                    </Grid>
                  </Box>

                  <Box>
                    <Heading size="md" mb={4}>Professional Information</Heading>
                    <Stack spacing={4}>
                      <FormControl isRequired>
                        <FormLabel>Employment Status</FormLabel>
                        <Select
                          value={formData.professionalInfo.employmentStatus.status}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              professionalInfo: {
                                ...formData.professionalInfo,
                                employmentStatus: {
                                  status: e.target.value,
                                },
                              },
                            })
                          }
                        >
                          <option value="">Select Status</option>
                          <option value="employed">Employed</option>
                          <option value="business_owner">Business Owner</option>
                          <option value="student">Student</option>
                        </Select>
                      </FormControl>

                      {formData.professionalInfo.employmentStatus.status === 'employed' && (
                        <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={4}>
                          <GridItem>
                            <FormControl isRequired>
                              <FormLabel>Company Name</FormLabel>
                              <Input
                                value={formData.professionalInfo.employmentDetails.companyName}
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    professionalInfo: {
                                      ...formData.professionalInfo,
                                      employmentDetails: {
                                        ...formData.professionalInfo.employmentDetails,
                                        companyName: e.target.value,
                                      },
                                    },
                                  })
                                }
                              />
                            </FormControl>
                          </GridItem>
                          <GridItem>
                            <FormControl isRequired>
                              <FormLabel>Job Title</FormLabel>
                              <Input
                                value={formData.professionalInfo.employmentDetails.jobTitle}
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    professionalInfo: {
                                      ...formData.professionalInfo,
                                      employmentDetails: {
                                        ...formData.professionalInfo.employmentDetails,
                                        jobTitle: e.target.value,
                                      },
                                    },
                                  })
                                }
                              />
                            </FormControl>
                          </GridItem>
                        </Grid>
                      )}

                      {formData.professionalInfo.employmentStatus.status === 'business_owner' && (
                        <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={4}>
                          <GridItem>
                            <FormControl isRequired>
                              <FormLabel>Business Name</FormLabel>
                              <Input
                                value={formData.professionalInfo.business.businessName}
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    professionalInfo: {
                                      ...formData.professionalInfo,
                                      business: {
                                        ...formData.professionalInfo.business,
                                        businessName: e.target.value,
                                      },
                                    },
                                  })
                                }
                              />
                            </FormControl>
                          </GridItem>
                          <GridItem>
                            <FormControl isRequired>
                              <FormLabel>Industry</FormLabel>
                              <Input
                                value={formData.professionalInfo.business.industry}
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    professionalInfo: {
                                      ...formData.professionalInfo,
                                      business: {
                                        ...formData.professionalInfo.business,
                                        industry: e.target.value,
                                      },
                                    },
                                  })
                                }
                              />
                            </FormControl>
                          </GridItem>
                        </Grid>
                      )}

                      {formData.professionalInfo.employmentStatus.status === 'student' && (
                        <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={4}>
                          <GridItem>
                            <FormControl isRequired>
                              <FormLabel>School Name</FormLabel>
                              <Input
                                value={formData.professionalInfo.student.schoolName}
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    professionalInfo: {
                                      ...formData.professionalInfo,
                                      student: {
                                        ...formData.professionalInfo.student,
                                        schoolName: e.target.value,
                                      },
                                    },
                                  })
                                }
                              />
                            </FormControl>
                          </GridItem>
                          <GridItem>
                            <FormControl isRequired>
                              <FormLabel>Field of Study</FormLabel>
                              <Input
                                value={formData.professionalInfo.student.fieldOfStudy}
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    professionalInfo: {
                                      ...formData.professionalInfo,
                                      student: {
                                        ...formData.professionalInfo.student,
                                        fieldOfStudy: e.target.value,
                                      },
                                    },
                                  })
                                }
                              />
                            </FormControl>
                          </GridItem>
                        </Grid>
                      )}
                    </Stack>
                  </Box>

                  <Box>
                    <Heading size="md" mb={4}>Social Presence</Heading>
                    <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={4}>
                      <GridItem>
                        <FormControl>
                          <FormLabel>LinkedIn Profile</FormLabel>
                          <Input
                            value={formData.socialPresence.linkedInProfile}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                socialPresence: {
                                  ...formData.socialPresence,
                                  linkedInProfile: e.target.value,
                                },
                              })
                            }
                          />
                        </FormControl>
                      </GridItem>
                      <GridItem>
                        <FormControl>
                          <FormLabel>Personal Website</FormLabel>
                          <Input
                            value={formData.socialPresence.personalWebsite}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                socialPresence: {
                                  ...formData.socialPresence,
                                  personalWebsite: e.target.value,
                                },
                              })
                            }
                          />
                        </FormControl>
                      </GridItem>
                    </Grid>
                  </Box>

                  <Button type="submit" colorScheme="blue" size="lg">
                    Submit Application
                  </Button>
                </Stack>
              </form>
            </VStack>
          </CardBody>
        </Card>
      </VStack>
    </Box>
  );
}

export default withAuth(MembershipRequestPage); 