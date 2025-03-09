'use client';

import {
  Box,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Card,
  CardBody,
  useToast,
  VStack,
  Heading,
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { IMembershipRequest } from '@/models/MembershipRequest';
import { selectIsAdminAuthenticated } from '@/store/slices/adminSlice';
import { adminFetch } from '@/utils/adminApi';

interface DashboardStats {
  total: number;
  pending: number;
  approved: number;
  updateRequired: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    total: 0,
    pending: 0,
    approved: 0,
    updateRequired: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const toast = useToast();
  const router = useRouter();
  const isAdminAuthenticated = useSelector(selectIsAdminAuthenticated);

  useEffect(() => {
    if (!isAdminAuthenticated) {
      router.push('/admin');
      return;
    }
  }, [isAdminAuthenticated, router]);

  useEffect(() => {
    const fetchStats = async () => {
      if (!isAdminAuthenticated) return;

      try {
        const data: IMembershipRequest[] = await adminFetch('/api/admin/requests');
        
        // Calculate stats
        const newStats = {
          total: data.length,
          pending: data.filter((r) => !r.isApproved && !r.softDeleted).length,
          approved: data.filter((r) => r.isApproved).length,
          updateRequired: data.filter((r) => r.softDeleted).length,
        };
        setStats(newStats);
      } catch (error) {
        console.error('Failed to fetch statistics:', error);
        toast({
          title: 'Error fetching statistics',
          status: 'error',
          duration: 3000,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, [toast, isAdminAuthenticated]);

  if (!isAdminAuthenticated) {
    return null;
  }

  if (isLoading) {
    return <Box p={8}>Loading dashboard data...</Box>;
  }

  return (
    <Box p={8}>
      <VStack spacing={8} align="stretch">
        <Heading size="lg">Dashboard Overview</Heading>
        <SimpleGrid columns={{ base: 1, md: 4 }} spacing={6}>
          <Card>
            <CardBody>
              <Stat>
                <StatLabel>Total Requests</StatLabel>
                <StatNumber>{stats.total}</StatNumber>
                <StatHelpText>All time</StatHelpText>
              </Stat>
            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <Stat>
                <StatLabel>Pending</StatLabel>
                <StatNumber>{stats.pending}</StatNumber>
                <StatHelpText>Awaiting review</StatHelpText>
              </Stat>
            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <Stat>
                <StatLabel>Approved</StatLabel>
                <StatNumber>{stats.approved}</StatNumber>
                <StatHelpText>Members</StatHelpText>
              </Stat>
            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <Stat>
                <StatLabel>Update Required</StatLabel>
                <StatNumber>{stats.updateRequired}</StatNumber>
                <StatHelpText>Pending updates</StatHelpText>
              </Stat>
            </CardBody>
          </Card>
        </SimpleGrid>
      </VStack>
    </Box>
  );
} 