'use client';

import {
  Box,
  VStack,
  Heading,
  Text,
  Button,
  HStack,
  useToast,
  Textarea,
  SimpleGrid,
  Card,
  CardHeader,
  CardBody,
  Divider,
  Spinner,
} from '@chakra-ui/react';
import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { IMembershipRequest } from '@/models/MembershipRequest';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/admin.firebase';
import withAuth from '@/hoc/withAdminAuth';

interface Industry {
  id: string;
  name: string;
}

interface Specialization {
  id: string;
  name: string;
  industryId: string;
  industryName: string;
}

function RequestDetail({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [request, setRequest] = useState<IMembershipRequest | null>(null);
  const [updateNotes, setUpdateNotes] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [industries, setIndustries] = useState<Industry[]>([]);
  const [specializationDetails, setSpecializationDetails] = useState<Specialization | null>(null);
  const [isLoadingSpecialization, setIsLoadingSpecialization] = useState(false);
  const [user] = useAuthState(auth);
  const router = useRouter();
  const toast = useToast();

  // Fetch industries
  useEffect(() => {
    const fetchIndustries = async () => {
      try {
        const response = await fetch('/api/industries');
        if (!response.ok) throw new Error('Failed to fetch industries');
        const data = await response.json();
        setIndustries(data);
      } catch (error) {
        console.error('Failed to fetch industries:', error);
      }
    };

    fetchIndustries();
  }, []);

  // Fetch request details
  useEffect(() => {
    const fetchRequest = async () => {
      try {
        const idToken = await user?.getIdToken();
        const response = await fetch(`/api/admin/requests/${resolvedParams.id}`, {
          headers: {
            'Authorization': `Bearer ${idToken}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setRequest(data);
          
          // If there's employment details with specialization, fetch its details
          if (data.professionalInfo.employmentDetails?.specialization) {
            setIsLoadingSpecialization(true);
            try {
              const specResponse = await fetch(`/api/specializations/${data.professionalInfo.employmentDetails.specialization}`);
              if (specResponse.ok) {
                const specData = await specResponse.json();
                setSpecializationDetails(specData);
              }
            } catch (error) {
              console.error('Failed to fetch specialization details:', error);
            } finally {
              setIsLoadingSpecialization(false);
            }
          }
        } else {
          toast({
            title: 'Error fetching request details',
            status: 'error',
            duration: 3000,
          });
        }
      } catch (error) {
        console.error('Failed to fetch request:', error);
        toast({
          title: 'Error fetching request details',
          status: 'error',
          duration: 3000,
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchRequest();
    }
  }, [resolvedParams.id, user, toast]);

  const handleStatusUpdate = async (action: 'approve' | 'update') => {
    setIsSubmitting(true);
    try {
      const idToken = await user?.getIdToken();
      const response = await fetch(`/api/admin/requests/${resolvedParams.id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${idToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action,
          notes: updateNotes,
        }),
      });

      if (response.ok) {
        const updatedRequest = await response.json();
        setRequest(updatedRequest);
        toast({
          title: 'Status updated successfully',
          status: 'success',
          duration: 3000,
        });
        if (action === 'approve') {
          router.push('/admin/dashboard');
        }
      } else {
        toast({
          title: 'Error updating status',
          status: 'error',
          duration: 3000,
        });
      }
    } catch (error) {
      console.error('Failed to update status:', error);
      toast({
        title: 'Error updating status',
        status: 'error',
        duration: 3000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getIndustryName = (industryId: string) => {
    const industry = industries.find(ind => ind.id === industryId);
    return industry?.name || industryId;
  };

  if (isLoading || !request) {
    return <Box p={4}>Loading...</Box>;
  }

  return (
    <Box p={8}>
      <VStack spacing={6} align="stretch">
        <HStack justify="space-between">
          <Heading size="lg">Request Details</Heading>
        </HStack>

        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
          {/* Personal Information Card */}
          <Card>
            <CardHeader>
              <Heading size="md">Personal Information</Heading>
            </CardHeader>
            <CardBody>
              <VStack spacing={4} align="stretch">
                <Box>
                  <Text fontWeight="bold">Name</Text>
                  <Text>
                    {request.personalDetails.firstName} {request.personalDetails.middleName} {request.personalDetails.lastName}
                  </Text>
                </Box>
                <Box>
                  <Text fontWeight="bold">Age Range</Text>
                  <Text>{request.personalDetails.ageRange}</Text>
                </Box>
                <Box>
                  <Text fontWeight="bold">State</Text>
                  <Text>{request.personalDetails.state || 'N/A'}</Text>
                </Box>
              </VStack>
            </CardBody>
          </Card>

          {/* Contact Information Card */}
          <Card>
            <CardHeader>
              <Heading size="md">Contact Information</Heading>
            </CardHeader>
            <CardBody>
              <VStack spacing={4} align="stretch">
                <Box>
                  <Text fontWeight="bold">Email</Text>
                  <Text>{request.contactInformation.primaryEmail}</Text>
                </Box>
                <Box>
                  <Text fontWeight="bold">Phone</Text>
                  <Text>{request.contactInformation.primaryPhoneNumber}</Text>
                </Box>
                {request.contactInformation.address && (
                  <Box>
                    <Text fontWeight="bold">Address</Text>
                    <Text>
                      {request.contactInformation.address.line1}
                      {request.contactInformation.address.line2 && <>, {request.contactInformation.address.line2}</>}
                      {request.contactInformation.address.city && <>, {request.contactInformation.address.city}</>}
                      {request.contactInformation.address.state && <>, {request.contactInformation.address.state}</>}
                      {request.contactInformation.address.zip && <> {request.contactInformation.address.zip}</>}
                      {request.contactInformation.address.country && <>, {request.contactInformation.address.country}</>}
                    </Text>
                  </Box>
                )}
              </VStack>
            </CardBody>
          </Card>

          {/* Professional Information Card */}
          <Card>
            <CardHeader>
              <Heading size="md">Professional Information</Heading>
            </CardHeader>
            <CardBody>
              <VStack spacing={4} align="stretch">
                <Box>
                  <Text fontWeight="bold">Employment Status</Text>
                  <Text>{request.professionalInfo.employmentStatus.status}</Text>
                </Box>

                {request.professionalInfo.employmentDetails && (
                  <>
                    <Divider />
                    <Box>
                      <Text fontWeight="bold">Company</Text>
                      <Text>{request.professionalInfo.employmentDetails.companyName}</Text>
                    </Box>
                    <Box>
                      <Text fontWeight="bold">Job Title</Text>
                      <Text>{request.professionalInfo.employmentDetails.jobTitle}</Text>
                    </Box>
                    <Box>
                      <Text fontWeight="bold">Industry & Specialization</Text>
                      {isLoadingSpecialization ? (
                        <HStack>
                          <Spinner size="sm" />
                          <Text>Loading specialization details...</Text>
                        </HStack>
                      ) : specializationDetails ? (
                        <VStack align="start" spacing={1}>
                          <Text>{specializationDetails.industryName}</Text>
                          <Text color="gray.500">{specializationDetails.name}</Text>
                        </VStack>
                      ) : (
                        <Text>Specialization details not found</Text>
                      )}
                    </Box>
                  </>
                )}

                {request.professionalInfo.business && (
                  <>
                    <Divider />
                    <Box>
                      <Text fontWeight="bold">Business Name</Text>
                      <Text>{request.professionalInfo.business.businessName}</Text>
                    </Box>
                    <Box>
                      <Text fontWeight="bold">Industry</Text>
                      <Text>{getIndustryName(request.professionalInfo.business.industry)}</Text>
                    </Box>
                    <Box>
                      <Text fontWeight="bold">Description</Text>
                      <Text>{request.professionalInfo.business.description}</Text>
                    </Box>
                    {request.professionalInfo.business.website && (
                      <Box>
                        <Text fontWeight="bold">Website</Text>
                        <Text>{request.professionalInfo.business.website}</Text>
                      </Box>
                    )}
                  </>
                )}

                {request.professionalInfo.student && (
                  <>
                    <Divider />
                    <Box>
                      <Text fontWeight="bold">School</Text>
                      <Text>{request.professionalInfo.student.schoolName}</Text>
                    </Box>
                    <Box>
                      <Text fontWeight="bold">Field of Study</Text>
                      <Text>{request.professionalInfo.student.fieldOfStudy}</Text>
                    </Box>
                  </>
                )}
              </VStack>
            </CardBody>
          </Card>

          {/* Update Status Card */}
          <Card>
            <CardHeader>
              <Heading size="md">Update Status</Heading>
            </CardHeader>
            <CardBody>
              <VStack spacing={4} align="stretch">
                <Textarea
                  placeholder="Add notes about the update (optional)"
                  value={updateNotes}
                  onChange={(e) => setUpdateNotes(e.target.value)}
                />
                <HStack spacing={4}>
                  <Button
                    colorScheme="green"
                    onClick={() => handleStatusUpdate('approve')}
                    isLoading={isSubmitting}
                    isDisabled={request.isApproved}
                  >
                    Approve
                  </Button>
                  <Button
                    colorScheme="orange"
                    onClick={() => handleStatusUpdate('update')}
                    isLoading={isSubmitting}
                    isDisabled={request.softDeleted}
                  >
                    Request Update
                  </Button>
                </HStack>
              </VStack>
            </CardBody>
          </Card>
        </SimpleGrid>
      </VStack>
    </Box>
  );
}

export default withAuth(RequestDetail); 