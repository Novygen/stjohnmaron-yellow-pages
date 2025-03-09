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
  Select,
  Input,
  VStack,
  Card,
  CardBody,
  useToast,
  TableContainer,
  Text,
  Stack,
  Badge,
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

  const getStatusBadge = (request: IMembershipRequest) => {
    if (request.isApproved) {
      return <Badge colorScheme="green">Approved</Badge>;
    }
    if (request.softDeleted) {
      return <Badge colorScheme="orange">Update Required</Badge>;
    }
    return <Badge colorScheme="blue">Pending</Badge>;
  };

  if (isLoading) {
    return <Box p={4}>Loading...</Box>;
  }

  return (
    <Box p={{ base: 2, md: 4 }}>
      <VStack spacing={4} align="stretch">
        <Card>
          <CardBody>
            <VStack spacing={4} align="stretch">
              <Stack
                direction={{ base: 'column', md: 'row' }}
                justify="space-between"
                align={{ base: 'stretch', md: 'center' }}
                spacing={4}
              >
                <Heading size={{ base: 'md', lg: 'lg' }}>Membership Requests</Heading>
                <Stack
                  direction={{ base: 'column', sm: 'row' }}
                  spacing={4}
                  w={{ base: '100%', md: 'auto' }}
                >
                  <Select 
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    size="sm"
                    w={{ base: '100%', sm: '150px' }}
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
                    size="sm"
                    w={{ base: '100%', sm: '200px' }}
                  />
                </Stack>
              </Stack>

              <TableContainer>
                <Table variant="simple" size={{ base: 'sm', lg: 'md' }}>
                  <Thead>
                    <Tr>
                      <Th>Name</Th>
                      <Th display={{ base: 'none', md: 'table-cell' }}>Email</Th>
                      <Th>Status</Th>
                      <Th>Actions</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {filteredRequests.map((request) => (
                      <Tr key={request._id?.toString()}>
                        <Td>
                          <VStack align="start" spacing={0}>
                            <Text>
                              {request.personalDetails.firstName} {request.personalDetails.lastName}
                            </Text>
                            <Text 
                              fontSize="sm" 
                              color="gray.500" 
                              display={{ base: 'block', md: 'none' }}
                            >
                              {request.contactInformation.primaryEmail}
                            </Text>
                          </VStack>
                        </Td>
                        <Td display={{ base: 'none', md: 'table-cell' }}>
                          {request.contactInformation.primaryEmail}
                        </Td>
                        <Td>{getStatusBadge(request)}</Td>
                        <Td>
                          <Link href={`/admin/requests/${request._id}`} passHref>
                            <Button size="sm" colorScheme="blue">View Details</Button>
                          </Link>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </TableContainer>
            </VStack>
          </CardBody>
        </Card>
      </VStack>
    </Box>
  );
}

export default withAuth(RequestsPage); 