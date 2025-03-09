'use client';

import {
  Box,
  Container,
  Heading,
  HStack,
  Button,
  useToast,
  Icon,
  Spinner,
  Center,
} from '@chakra-ui/react';
import { ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { MdDashboard, MdPeople, MdLogout } from 'react-icons/md';
import { useSelector, useDispatch } from 'react-redux';
import { selectIsAdminAuthenticated } from '@/store/slices/adminSlice';
import { clearAdminCredentials } from '@/store/slices/adminSlice';
import { signOut } from 'firebase/auth';
import { auth } from '@/admin.firebase';

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/admin/dashboard', icon: MdDashboard },
  { label: 'Requests', href: '/admin/requests', icon: MdPeople },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const toast = useToast();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAdminAuthenticated);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      dispatch(clearAdminCredentials());
      router.push('/admin');
      toast({
        title: 'Logged out successfully',
        status: 'success',
        duration: 3000,
      });
    } catch (error) {
      console.error('Logout failed:', error);
      toast({
        title: 'Logout failed',
        status: 'error',
        duration: 3000,
      });
    }
  };

  // If not on sign-in page and not authenticated, redirect to sign-in
  if (!isAuthenticated && pathname !== '/admin') {
    router.push('/admin');
    return (
      <Center minH="100vh">
        <Spinner
          thickness="4px"
          speed="0.65s"
          emptyColor="gray.200"
          color="brand.500"
          size="xl"
        />
      </Center>
    );
  }

  // On sign-in page and authenticated, redirect to dashboard
  if (isAuthenticated && pathname === '/admin') {
    router.push('/admin/dashboard');
    return (
      <Center minH="100vh">
        <Spinner
          thickness="4px"
          speed="0.65s"
          emptyColor="gray.200"
          color="brand.500"
          size="xl"
        />
      </Center>
    );
  }

  // Show sign-in page without navigation
  if (pathname === '/admin') {
    return <>{children}</>;
  }

  // Show protected layout with navigation
  return (
    <Box>
      <Box bg="brand.500" color="white" py={4} mb={8}>
        <Container maxW="container.xl">
          <HStack justify="space-between">
            <HStack spacing={8}>
              <Heading size="lg">Admin Portal</Heading>
              <HStack spacing={4}>
                {NAV_ITEMS.map((item) => (
                  <Link key={item.href} href={item.href} passHref>
                    <Button
                      as="a"
                      variant={pathname === item.href ? 'solid' : 'ghost'}
                      leftIcon={<Icon as={item.icon} />}
                      color="white"
                      _hover={{ bg: 'brand.600' }}
                    >
                      {item.label}
                    </Button>
                  </Link>
                ))}
              </HStack>
            </HStack>
            <Button
              variant="ghost"
              leftIcon={<Icon as={MdLogout} />}
              onClick={handleLogout}
              color="white"
              _hover={{ bg: 'brand.600' }}
            >
              Logout
            </Button>
          </HStack>
        </Container>
      </Box>
      <Container maxW="container.xl">
        {children}
      </Container>
    </Box>
  );
} 