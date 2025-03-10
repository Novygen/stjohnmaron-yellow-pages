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
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  VStack,
  useToast,
  Badge,
  IconButton,
  Flex,
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { IMember, IEmployment } from '@/models/Member';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/admin.firebase';
import withAuth from '@/hoc/withAdminAuth';
import { AddIcon, DeleteIcon } from '@chakra-ui/icons';
import mongoose from 'mongoose';

type PlainMember = Omit<IMember, keyof mongoose.Document>;
type VisibilityOption = 'public' | 'private';

function MemberDetailsPage() {
  const [member, setMember] = useState<PlainMember | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [user] = useAuthState(auth);
  const params = useParams();
  const toast = useToast();

  useEffect(() => {
    const fetchMember = async () => {
      try {
        const idToken = await user?.getIdToken();
        const response = await fetch(`/api/admin/members/${params.id}`, {
          headers: {
            'Authorization': `Bearer ${idToken}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setMember(data);
        } else {
          toast({
            title: 'Error fetching member details',
            status: 'error',
            duration: 3000,
          });
        }
      } catch (error) {
        console.error('Failed to fetch member details:', error);
        toast({
          title: 'Error fetching member details',
          status: 'error',
          duration: 3000,
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (user && params.id) {
      fetchMember();
    }
  }, [user, params.id, toast]);

  const handleSave = async () => {
    if (!member) return;

    setIsSaving(true);
    try {
      const idToken = await user?.getIdToken();
      const response = await fetch(`/api/admin/members/${params.id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${idToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(member),
      });

      if (response.ok) {
        toast({
          title: 'Member details updated successfully',
          status: 'success',
          duration: 3000,
        });
      } else {
        toast({
          title: 'Error updating member details',
          status: 'error',
          duration: 3000,
        });
      }
    } catch (error) {
      console.error('Failed to update member:', error);
      toast({
        title: 'Error updating member details',
        status: 'error',
        duration: 3000,
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleStatusChange = async (newStatus: 'active' | 'inactive' | 'suspended') => {
    if (!member) return;

    try {
      const idToken = await user?.getIdToken();
      const response = await fetch(`/api/admin/members/${params.id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${idToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        setMember({ ...member, status: newStatus });
        toast({
          title: 'Member status updated successfully',
          status: 'success',
          duration: 3000,
        });
      } else {
        toast({
          title: 'Error updating member status',
          status: 'error',
          duration: 3000,
        });
      }
    } catch (error) {
      console.error('Failed to update member status:', error);
      toast({
        title: 'Error updating member status',
        status: 'error',
        duration: 3000,
      });
    }
  };

  const handleAddEmployment = (type: 'employed' | 'business_owner' | 'student') => {
    if (!member) return;

    const newEmployment: IEmployment = {
      type,
      details: {},
      isActive: true,
      startDate: new Date(),
    };

    setMember({
      ...member,
      employments: [...member.employments, newEmployment],
    });
  };

  const handleRemoveEmployment = (index: number) => {
    if (!member) return;

    const updatedEmployments = [...member.employments];
    updatedEmployments.splice(index, 1);

    setMember({
      ...member,
      employments: updatedEmployments,
    });
  };

  const handleEmploymentChange = (index: number, field: string, value: string | boolean) => {
    if (!member) return;

    const updatedEmployments = [...member.employments];
    const employment = { ...updatedEmployments[index] };

    if (field.includes('.')) {
      const [, child] = field.split('.');
      employment.details = {
        ...employment.details,
        [child]: value,
      };
    } else {
      if (field === 'type') {
        employment.type = value as 'employed' | 'business_owner' | 'student';
      } else if (field === 'isActive') {
        employment.isActive = value as boolean;
      } else if (field === 'startDate') {
        employment.startDate = new Date(value as string);
      }
    }

    updatedEmployments[index] = employment;

    setMember({
      ...member,
      employments: updatedEmployments,
    });
  };

  const handleVisibilityChange = (
    section: 'profile' | 'contact' | 'employment' | 'social',
    value: VisibilityOption,
    subSection?: 'email' | 'phone' | 'address' | 'current' | 'history'
  ) => {
    if (!member) return;

    setMember({
      ...member,
      visibility: {
        ...member.visibility,
        ...(subSection
          ? {
              [section]: {
                ...member.visibility[section] as Record<string, VisibilityOption>,
                [subSection]: value,
              },
            }
          : { [section]: value }),
      },
    });
  };

  if (isLoading) {
    return <Box p={4}>Loading...</Box>;
  }

  if (!member) {
    return <Box p={4}>Member not found</Box>;
  }

  return (
    <Box p={{ base: 2, md: 4 }}>
      <VStack spacing={4} align="stretch">
        <Card>
          <CardBody>
            <Stack
              direction={{ base: 'column', md: 'row' }}
              justify="space-between"
              align={{ base: 'start', md: 'center' }}
              spacing={4}
              mb={4}
            >
              <Heading size={{ base: 'md', lg: 'lg' }}>
                Member Details
              </Heading>
              <Stack direction="row" spacing={2}>
                <Select
                  value={member.status}
                  onChange={(e) => handleStatusChange(e.target.value as 'active' | 'inactive' | 'suspended')}
                  size="sm"
                  w="150px"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="suspended">Suspended</option>
                </Select>
                <Button
                  colorScheme="blue"
                  onClick={handleSave}
                  isLoading={isSaving}
                  size="sm"
                >
                  Save Changes
                </Button>
              </Stack>
            </Stack>

            <Tabs>
              <TabList>
                <Tab>Personal Info</Tab>
                <Tab>Contact</Tab>
                <Tab>Employment</Tab>
                <Tab>Privacy</Tab>
              </TabList>

              <TabPanels>
                <TabPanel>
                  <Grid
                    templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }}
                    gap={4}
                  >
                    <GridItem>
                      <FormControl>
                        <FormLabel>First Name</FormLabel>
                        <Input
                          value={member.personalDetails.firstName}
                          onChange={(e) =>
                            setMember({
                              ...member,
                              personalDetails: {
                                ...member.personalDetails,
                                firstName: e.target.value,
                              },
                            })
                          }
                        />
                      </FormControl>
                    </GridItem>
                    <GridItem>
                      <FormControl>
                        <FormLabel>Last Name</FormLabel>
                        <Input
                          value={member.personalDetails.lastName}
                          onChange={(e) =>
                            setMember({
                              ...member,
                              personalDetails: {
                                ...member.personalDetails,
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
                          value={member.personalDetails.middleName || ''}
                          onChange={(e) =>
                            setMember({
                              ...member,
                              personalDetails: {
                                ...member.personalDetails,
                                middleName: e.target.value,
                              },
                            })
                          }
                        />
                      </FormControl>
                    </GridItem>
                    <GridItem>
                      <FormControl>
                        <FormLabel>Age Range</FormLabel>
                        <Input
                          value={member.personalDetails.ageRange}
                          onChange={(e) =>
                            setMember({
                              ...member,
                              personalDetails: {
                                ...member.personalDetails,
                                ageRange: e.target.value,
                              },
                            })
                          }
                        />
                      </FormControl>
                    </GridItem>
                  </Grid>
                </TabPanel>

                <TabPanel>
                  <Grid
                    templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }}
                    gap={4}
                  >
                    <GridItem>
                      <FormControl>
                        <FormLabel>Email</FormLabel>
                        <Input
                          value={member.contactInformation.primaryEmail}
                          onChange={(e) =>
                            setMember({
                              ...member,
                              contactInformation: {
                                ...member.contactInformation,
                                primaryEmail: e.target.value,
                              },
                            })
                          }
                        />
                      </FormControl>
                    </GridItem>
                    <GridItem>
                      <FormControl>
                        <FormLabel>Phone</FormLabel>
                        <Input
                          value={member.contactInformation.primaryPhoneNumber}
                          onChange={(e) =>
                            setMember({
                              ...member,
                              contactInformation: {
                                ...member.contactInformation,
                                primaryPhoneNumber: e.target.value,
                              },
                            })
                          }
                        />
                      </FormControl>
                    </GridItem>
                  </Grid>
                </TabPanel>

                <TabPanel>
                  <Stack spacing={4}>
                    <Stack direction="row" spacing={2}>
                      <Button
                        size="sm"
                        leftIcon={<AddIcon />}
                        onClick={() => handleAddEmployment('employed')}
                      >
                        Add Employment
                      </Button>
                      <Button
                        size="sm"
                        leftIcon={<AddIcon />}
                        onClick={() => handleAddEmployment('business_owner')}
                      >
                        Add Business
                      </Button>
                      <Button
                        size="sm"
                        leftIcon={<AddIcon />}
                        onClick={() => handleAddEmployment('student')}
                      >
                        Add Education
                      </Button>
                    </Stack>

                    {member.employments.map((employment, index) => (
                      <Card key={index}>
                        <CardBody>
                          <Stack spacing={4}>
                            <Flex justify="space-between" align="center">
                              <Badge colorScheme={employment.isActive ? 'green' : 'gray'}>
                                {employment.type}
                              </Badge>
                              <IconButton
                                aria-label="Remove employment"
                                icon={<DeleteIcon />}
                                size="sm"
                                colorScheme="red"
                                variant="ghost"
                                onClick={() => handleRemoveEmployment(index)}
                              />
                            </Flex>

                            <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={4}>
                              {employment.type === 'employed' && (
                                <>
                                  <GridItem>
                                    <FormControl>
                                      <FormLabel>Company Name</FormLabel>
                                      <Input
                                        value={employment.details.companyName || ''}
                                        onChange={(e) =>
                                          handleEmploymentChange(
                                            index,
                                            'details.companyName',
                                            e.target.value
                                          )
                                        }
                                      />
                                    </FormControl>
                                  </GridItem>
                                  <GridItem>
                                    <FormControl>
                                      <FormLabel>Job Title</FormLabel>
                                      <Input
                                        value={employment.details.jobTitle || ''}
                                        onChange={(e) =>
                                          handleEmploymentChange(
                                            index,
                                            'details.jobTitle',
                                            e.target.value
                                          )
                                        }
                                      />
                                    </FormControl>
                                  </GridItem>
                                </>
                              )}

                              {employment.type === 'business_owner' && (
                                <>
                                  <GridItem>
                                    <FormControl>
                                      <FormLabel>Business Name</FormLabel>
                                      <Input
                                        value={employment.details.businessName || ''}
                                        onChange={(e) =>
                                          handleEmploymentChange(
                                            index,
                                            'details.businessName',
                                            e.target.value
                                          )
                                        }
                                      />
                                    </FormControl>
                                  </GridItem>
                                  <GridItem>
                                    <FormControl>
                                      <FormLabel>Industry</FormLabel>
                                      <Input
                                        value={employment.details.industry || ''}
                                        onChange={(e) =>
                                          handleEmploymentChange(
                                            index,
                                            'details.industry',
                                            e.target.value
                                          )
                                        }
                                      />
                                    </FormControl>
                                  </GridItem>
                                </>
                              )}

                              {employment.type === 'student' && (
                                <>
                                  <GridItem>
                                    <FormControl>
                                      <FormLabel>School Name</FormLabel>
                                      <Input
                                        value={employment.details.schoolName || ''}
                                        onChange={(e) =>
                                          handleEmploymentChange(
                                            index,
                                            'details.schoolName',
                                            e.target.value
                                          )
                                        }
                                      />
                                    </FormControl>
                                  </GridItem>
                                  <GridItem>
                                    <FormControl>
                                      <FormLabel>Field of Study</FormLabel>
                                      <Input
                                        value={employment.details.fieldOfStudy || ''}
                                        onChange={(e) =>
                                          handleEmploymentChange(
                                            index,
                                            'details.fieldOfStudy',
                                            e.target.value
                                          )
                                        }
                                      />
                                    </FormControl>
                                  </GridItem>
                                </>
                              )}
                            </Grid>

                            <FormControl>
                              <Stack direction="row" align="center">
                                <FormLabel mb={0}>Status:</FormLabel>
                                <Select
                                  value={employment.isActive ? 'active' : 'inactive'}
                                  onChange={(e) =>
                                    handleEmploymentChange(
                                      index,
                                      'isActive',
                                      e.target.value === 'active'
                                    )
                                  }
                                  size="sm"
                                  w="150px"
                                >
                                  <option value="active">Active</option>
                                  <option value="inactive">Inactive</option>
                                </Select>
                              </Stack>
                            </FormControl>
                          </Stack>
                        </CardBody>
                      </Card>
                    ))}
                  </Stack>
                </TabPanel>

                <TabPanel>
                  <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={4}>
                    <GridItem>
                      <FormControl>
                        <FormLabel>Profile Visibility</FormLabel>
                        <Select
                          value={member.visibility.profile}
                          onChange={(e) => handleVisibilityChange('profile', e.target.value as VisibilityOption)}
                        >
                          <option value="public">Public</option>
                          <option value="private">Private</option>
                        </Select>
                      </FormControl>
                    </GridItem>

                    <GridItem>
                      <FormControl>
                        <FormLabel>Email Visibility</FormLabel>
                        <Select
                          value={member.visibility.contact.email}
                          onChange={(e) =>
                            handleVisibilityChange('contact', e.target.value as VisibilityOption, 'email')
                          }
                        >
                          <option value="public">Public</option>
                          <option value="private">Private</option>
                        </Select>
                      </FormControl>
                    </GridItem>

                    <GridItem>
                      <FormControl>
                        <FormLabel>Phone Number Visibility</FormLabel>
                        <Select
                          value={member.visibility.contact.phone}
                          onChange={(e) =>
                            handleVisibilityChange('contact', e.target.value as VisibilityOption, 'phone')
                          }
                        >
                          <option value="public">Public</option>
                          <option value="private">Private</option>
                        </Select>
                      </FormControl>
                    </GridItem>

                    <GridItem>
                      <FormControl>
                        <FormLabel>Current Employment Visibility</FormLabel>
                        <Select
                          value={member.visibility.employment.current}
                          onChange={(e) =>
                            handleVisibilityChange('employment', e.target.value as VisibilityOption, 'current')
                          }
                        >
                          <option value="public">Public</option>
                          <option value="private">Private</option>
                        </Select>
                      </FormControl>
                    </GridItem>

                    <GridItem>
                      <FormControl>
                        <FormLabel>Employment History Visibility</FormLabel>
                        <Select
                          value={member.visibility.employment.history}
                          onChange={(e) =>
                            handleVisibilityChange('employment', e.target.value as VisibilityOption, 'history')
                          }
                        >
                          <option value="public">Public</option>
                          <option value="private">Private</option>
                        </Select>
                      </FormControl>
                    </GridItem>

                    <GridItem>
                      <FormControl>
                        <FormLabel>Social Presence Visibility</FormLabel>
                        <Select
                          value={member.visibility.social}
                          onChange={(e) => handleVisibilityChange('social', e.target.value as VisibilityOption)}
                        >
                          <option value="public">Public</option>
                          <option value="private">Private</option>
                        </Select>
                      </FormControl>
                    </GridItem>
                  </Grid>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </CardBody>
        </Card>
      </VStack>
    </Box>
  );
}

export default withAuth(MemberDetailsPage); 