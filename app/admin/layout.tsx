'use client';

import { Box, useToast, useDisclosure } from '@chakra-ui/react';
import { ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { signOut } from 'firebase/auth';
import { auth } from '@/admin.firebase';
import { clearAdminCredentials } from '@/store/slices/adminSlice';
import AdminSidebar from '@/app/components/AdminSidebar';
import AdminTopbar from '@/app/components/AdminTopbar';

export default function AdminLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const toast = useToast();
  const dispatch = useDispatch();
  const { isOpen, onOpen, onClose } = useDisclosure();

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

  // Show sign-in page without navigation
  if (pathname === '/admin') {
    return <>{children}</>;
  }

  return (
    <Box minH="100vh" bg="gray.50">
      <AdminSidebar isOpen={isOpen} onClose={onClose} />
      <AdminTopbar onMobileMenuClick={onOpen} onLogout={handleLogout} />
      
      <Box
        ml={{ base: 0, lg: '64' }}
        pt="16"
        transition=".3s ease"
      >
        <Box as="main" p={9}>
          {children}
        </Box>
      </Box>
    </Box>
  );
} 