'use client';

import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  Heading,
  HStack,
  Select,
  Input,
  VStack,
  Card,
  CardBody,
  useToast,
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { IMembershipRequest } from '@/models/MembershipRequest';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/admin.firebase';
import withAuth from '@/hoc/withAdminAuth';

function RequestsPage() {
  const [requests, setRequests] = useState<IMembershipRequest[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [user] = useAuthState(auth);
  const toast = useToast();

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const idToken = await user?.getIdToken();
        const response = await fetch('/api/admin/requests', {
          headers: {
            'Authorization': `Bearer ${idToken}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setRequests(data);
        } else {
          toast({
            title: 'Error fetching requests',
            status: 'error',
            duration: 3000,
          });
        }
      } catch (error) {
        console.error('Failed to fetch requests:', error);
        toast({
          title: 'Error fetching requests',
          status: 'error',
          duration: 3000,
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchRequests();
    }
  }, [user, toast]);

  const filteredRequests = requests.filter((request) => {
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'pending' && !request.isApproved && !request.softDeleted) ||
      (statusFilter === 'approved' && request.isApproved) ||
      (statusFilter === 'update_required' && request.softDeleted);

    const matchesSearch = 
      request.personalDetails.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.personalDetails.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.contactInformation.primaryEmail.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  if (isLoading) {
    return <Box p={8}>Loading...</Box>;
  }

  return (
    <Box p={8}>
      <VStack spacing={6} align="stretch">
        <Card>
          <CardBody>
            <VStack spacing={6} align="stretch">
              <HStack justify="space-between">
                <Heading size="lg">Membership Requests</Heading>
                <HStack spacing={4}>
                  <Select 
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    w="200px"
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="update_required">Update Required</option>
                  </Select>
                  
                  <Input
                    placeholder="Search by name or email"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    w="300px"
                  />
                </HStack>
              </HStack>

              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th>Name</Th>
                    <Th>Email</Th>
                    <Th>Status</Th>
                    <Th>Actions</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {filteredRequests.map((request) => (
                    <Tr key={request._id?.toString()}>
                      <Td>
                        {request.personalDetails.firstName} {request.personalDetails.lastName}
                      </Td>
                      <Td>{request.contactInformation.primaryEmail}</Td>
                      <Td>
                        {request.isApproved 
                          ? 'Approved'
                          : request.softDeleted
                            ? 'Update Required'
                            : 'Pending'
                        }
                      </Td>
                      <Td>
                        <Link href={`/admin/requests/${request._id}`} passHref>
                          <Button size="sm">View Details</Button>
                        </Link>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </VStack>
          </CardBody>
        </Card>
      </VStack>
    </Box>
  );
}

export default withAuth(RequestsPage); 