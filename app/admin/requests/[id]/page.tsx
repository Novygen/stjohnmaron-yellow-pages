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
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { IMembershipRequest } from '@/models/MembershipRequest';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/admin.firebase';
import withAuth from '@/hoc/withAdminAuth';

function RequestDetail({ params }: { params: { id: string } }) {
  const [request, setRequest] = useState<IMembershipRequest | null>(null);
  const [updateNotes, setUpdateNotes] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [user] = useAuthState(auth);
  const router = useRouter();
  const toast = useToast();

  useEffect(() => {
    const fetchRequest = async () => {
      try {
        const idToken = await user?.getIdToken();
        const response = await fetch(`/api/admin/requests/${params.id}`, {
          headers: {
            'Authorization': `Bearer ${idToken}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setRequest(data);
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
  }, [params.id, user, toast]);

  const handleStatusUpdate = async (action: 'approve' | 'update') => {
    setIsSubmitting(true);
    try {
      const idToken = await user?.getIdToken();
      const response = await fetch(`/api/admin/requests/${params.id}`, {
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

  if (isLoading || !request) {
    return <Box p={8}>Loading...</Box>;
  }

  return (
    <Box p={8}>
      <VStack spacing={6} align="stretch">
        <HStack justify="space-between">
          <Heading size="lg">Request Details</Heading>
          <Button onClick={() => router.push('/admin/dashboard')}>
            Back to Dashboard
          </Button>
        </HStack>

        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
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
                      <Text fontWeight="bold">Specialization</Text>
                      <Text>{request.professionalInfo.employmentDetails.specialization}</Text>
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
                      <Text>{request.professionalInfo.business.industry}</Text>
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
                    <Box>
                      <Text fontWeight="bold">Expected Graduation</Text>
                      <Text>{request.professionalInfo.student.expectedGraduationYear}</Text>
                    </Box>
                  </>
                )}
              </VStack>
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <Heading size="md">Additional Information</Heading>
            </CardHeader>
            <CardBody>
              <VStack spacing={4} align="stretch">
                <Box>
                  <Text fontWeight="bold">Status</Text>
                  <Text>
                    {request.isApproved 
                      ? 'Approved'
                      : request.softDeleted
                        ? 'Update Required'
                        : 'Pending'
                    }
                  </Text>
                </Box>
                {request.lastModifiedBy && (
                  <Box>
                    <Text fontWeight="bold">Last Modified By</Text>
                    <Text>{request.lastModifiedBy}</Text>
                  </Box>
                )}
              </VStack>
            </CardBody>
          </Card>
        </SimpleGrid>

        {!request.isApproved && !request.softDeleted && (
          <Card>
            <CardHeader>
              <Heading size="md">Actions</Heading>
            </CardHeader>
            <CardBody>
              <VStack spacing={4} align="stretch">
                <Box>
                  <Text fontWeight="bold" mb={2}>Update Request Notes</Text>
                  <Textarea
                    value={updateNotes}
                    onChange={(e) => setUpdateNotes(e.target.value)}
                    placeholder="Enter notes for update request..."
                  />
                </Box>

                <HStack spacing={4}>
                  <Button
                    colorScheme="green"
                    onClick={() => handleStatusUpdate('approve')}
                    isLoading={isSubmitting}
                  >
                    Approve Request
                  </Button>
                  <Button
                    colorScheme="orange"
                    onClick={() => handleStatusUpdate('update')}
                    isLoading={isSubmitting}
                    isDisabled={!updateNotes.trim()}
                  >
                    Request Update
                  </Button>
                </HStack>
              </VStack>
            </CardBody>
          </Card>
        )}
      </VStack>
    </Box>
  );
}

export default withAuth(RequestDetail); 