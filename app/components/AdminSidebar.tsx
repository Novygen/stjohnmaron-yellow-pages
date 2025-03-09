'use client';

import {
  Box,
  VStack,
  Icon,
  Text,
  Flex,
  useColorModeValue,
  Drawer,
  DrawerContent,
  DrawerOverlay,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
} from '@chakra-ui/react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { MdDashboard, MdPeople, MdEvent, MdSettings } from 'react-icons/md';

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/admin/dashboard', icon: MdDashboard },
  { label: 'Requests', href: '/admin/requests', icon: MdPeople },
  { label: 'Events', href: '/admin/events', icon: MdEvent },
  { label: 'Settings', href: '/admin/settings', icon: MdSettings },
];

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function AdminSidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const SidebarContent = () => (
    <VStack spacing={1} align="stretch" w="full">
      {NAV_ITEMS.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link key={item.label + item.href} href={item.href}>
            <Flex
              align="center"
              px={4}
              py={3}
              cursor="pointer"
              role="group"
              bg={isActive ? 'brand.50' : 'transparent'}
              color={isActive ? 'brand.500' : 'inherit'}
              borderLeft="3px solid"
              borderLeftColor={isActive ? 'brand.500' : 'transparent'}
              _hover={{
                bg: 'brand.50',
                color: 'brand.500',
              }}
            >
              <Icon
                as={item.icon}
                boxSize={5}
                mr={4}
              />
              <Text fontWeight={isActive ? 'medium' : 'normal'}>
                {item.label}
              </Text>
            </Flex>
          </Link>
        );
      })}
    </VStack>
  );

  // Mobile drawer
  const MobileDrawer = () => (
    <Drawer isOpen={isOpen!} placement="left" onClose={onClose!}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader borderBottomWidth="1px">Admin Menu</DrawerHeader>
        <DrawerBody p={0} mt={4}>
          <SidebarContent />
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );

  // Desktop sidebar
  const DesktopSidebar = () => (
    <Box
      position="fixed"
      left={0}
      w="64"
      h="full"
      bg={bgColor}
      borderRight="1px"
      borderRightColor={borderColor}
      display={{ base: 'none', lg: 'block' }}
    >
      <Box pt={8} pb={4}>
        <Text
          fontSize="lg"
          fontWeight="bold"
          textAlign="center"
          mb={8}
          color="brand.500"
        >
          Admin Portal
        </Text>
        <SidebarContent />
      </Box>
    </Box>
  );

  return (
    <>
      <DesktopSidebar />
      {isOpen && <MobileDrawer />}
    </>
  );
} 