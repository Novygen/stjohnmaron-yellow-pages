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
  Badge,
  Stack,
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { IMember } from '@/models/Member';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/admin.firebase';
import withAuth from '@/hoc/withAdminAuth';

function MembersPage() {
  const [members, setMembers] = useState<IMember[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [parishFilter, setParishFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [user] = useAuthState(auth);
  const toast = useToast();

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const idToken = await user?.getIdToken();
        const response = await fetch('/api/admin/members', {
          headers: {
            'Authorization': `Bearer ${idToken}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setMembers(data);
        } else {
          toast({
            title: 'Error fetching members',
            status: 'error',
            duration: 3000,
          });
        }
      } catch (error) {
        console.error('Failed to fetch members:', error);
        toast({
          title: 'Error fetching members',
          status: 'error',
          duration: 3000,
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchMembers();
    }
  }, [user, toast]);

  const filteredMembers = members.filter((member) => {
    const matchesStatus = statusFilter === 'all' || member.status === statusFilter;
    
    const matchesParish = parishFilter === 'all' || 
      (member.personalDetails.parishStatus?.status === parishFilter) || 
      (parishFilter === 'other_parish' && member.personalDetails.parishStatus?.status === 'other_parish');

    const matchesSearch = 
      member.personalDetails.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.personalDetails.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.contactInformation.primaryEmail.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesStatus && matchesSearch && matchesParish;
  });

  const getStatusBadge = (status: string) => {
    const statusProps = {
      active: { colorScheme: 'green', label: 'Active' },
      inactive: { colorScheme: 'gray', label: 'Inactive' },
      suspended: { colorScheme: 'red', label: 'Suspended' },
    }[status] || { colorScheme: 'gray', label: status };

    return <Badge colorScheme={statusProps.colorScheme}>{statusProps.label}</Badge>;
  };

  const getParishStatusBadge = (member: IMember) => {
    if (!member.personalDetails.parishStatus) return null;
    
    const statusMap = {
      member: { colorScheme: 'green', label: 'Member' },
      visitor: { colorScheme: 'blue', label: 'Visitor' },
      other_parish: { 
        colorScheme: 'purple', 
        label: member.personalDetails.parishStatus.otherParishName || 'Other Parish'
      },
    };
    
    const status = member.personalDetails.parishStatus.status;
    const statusProps = statusMap[status] || { colorScheme: 'gray', label: 'Unknown' };

    return <Badge colorScheme={statusProps.colorScheme}>{statusProps.label}</Badge>;
  };

  const getEmploymentInfo = (member: IMember) => {
    const activeEmployments = member.employments.filter(emp => emp.isActive);
    if (activeEmployments.length === 0) return 'No active employment';

    return activeEmployments.map(emp => {
      switch (emp.type) {
        case 'employed':
          return `${emp.details.jobTitle} at ${emp.details.companyName}`;
        case 'business_owner':
          return `Owner of ${emp.details.businessName}`;
        case 'student':
          return `Student at ${emp.details.schoolName}`;
        default:
          return 'Unknown employment type';
      }
    }).join(', ');
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
                <Heading size={{ base: 'md', lg: 'lg' }}>Members Directory</Heading>
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
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="suspended">Suspended</option>
                  </Select>
                  
                  <Select 
                    value={parishFilter}
                    onChange={(e) => setParishFilter(e.target.value)}
                    size="sm"
                    w={{ base: '100%', sm: '180px' }}
                  >
                    <option value="all">All Parish Status</option>
                    <option value="member">Parish Members</option>
                    <option value="visitor">Visitors</option>
                    <option value="other_parish">Other Parishes</option>
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
                      <Th display={{ base: 'none', lg: 'table-cell' }}>Employment</Th>
                      <Th>Status</Th>
                      <Th display={{ base: 'none', md: 'table-cell' }}>Parish</Th>
                      <Th>Actions</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {filteredMembers.map((member) => (
                      <Tr key={member._id?.toString()}>
                        <Td>
                          <VStack align="start" spacing={0}>
                            <Text>
                              {member.personalDetails.firstName} {member.personalDetails.lastName}
                            </Text>
                            <Text 
                              fontSize="sm" 
                              color="gray.500" 
                              display={{ base: 'block', md: 'none' }}
                            >
                              {member.contactInformation.primaryEmail}
                            </Text>
                          </VStack>
                        </Td>
                        <Td display={{ base: 'none', md: 'table-cell' }}>
                          {member.contactInformation.primaryEmail}
                        </Td>
                        <Td display={{ base: 'none', lg: 'table-cell' }}>
                          <Text noOfLines={2}>
                            {getEmploymentInfo(member)}
                          </Text>
                        </Td>
                        <Td>{getStatusBadge(member.status)}</Td>
                        <Td display={{ base: 'none', md: 'table-cell' }}>{getParishStatusBadge(member)}</Td>
                        <Td>
                          <Link href={`/admin/members/${member._id}`} passHref>
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

export default withAuth(MembersPage); 