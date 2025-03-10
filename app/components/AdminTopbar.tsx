'use client';

import {
  Box,
  Flex,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Avatar,
  Text,
  useColorModeValue,
  HStack,
} from '@chakra-ui/react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { MdMenu, MdLogout, MdChevronRight } from 'react-icons/md';
import { useSelector } from 'react-redux';
import { selectAdminEmail } from '@/store/slices/adminSlice';
import { Fragment } from 'react';

interface TopbarProps {
  onMobileMenuClick: () => void;
  onLogout: () => void;
}

interface Breadcrumb {
  label: string;
  href: string;
  isLast: boolean;
}

// Breadcrumb components following shadcn/ui pattern
const BreadcrumbList = ({ children }: { children: React.ReactNode }) => {
  return (
    <nav aria-label="breadcrumbs">
      <ol className="flex items-center space-x-2">{children}</ol>
    </nav>
  );
};

const BreadcrumbItem = ({ children }: { children: React.ReactNode }) => {
  return <li className="inline-flex items-center space-x-2">{children}</li>;
};

const BreadcrumbLink = ({ href, children, isLast }: { href: string; children: React.ReactNode; isLast?: boolean }) => {
  if (isLast) {
    return <span className="text-brand-500 font-medium">{children}</span>;
  }
  return (
    <Link href={href} className="hover:text-brand-500 transition-colors">
      {children}
    </Link>
  );
};

const BreadcrumbSeparator = () => {
  return <MdChevronRight className="text-gray-400" />;
};

export default function AdminTopbar({ onMobileMenuClick, onLogout }: TopbarProps) {
  const pathname = usePathname();
  const adminEmail = useSelector(selectAdminEmail) || '';
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  // Generate breadcrumbs from pathname
  const generateBreadcrumbs = (): Breadcrumb[] => {
    if (!pathname) return [];

    const segments = pathname.split('/').filter(Boolean);
    
    // Handle root admin path
    if (segments.length === 1 && segments[0] === 'admin') {
      return [{
        label: 'Admin',
        href: '/admin/dashboard',
        isLast: true
      }];
    }

    // Generate breadcrumbs
    const breadcrumbs: Breadcrumb[] = [];
    
    // Always add admin as first breadcrumb if we're in admin section
    if (segments[0] === 'admin') {
      // Add remaining segments
        segments.slice(1).forEach((segment, index) => {
        const isLast = index === segments.length - 2; // -2 because we sliced off 'admin'
        const href = `/${segments.slice(0, index + 2).join('/')}`;
        
        breadcrumbs.push({
          label: segment.charAt(0).toUpperCase() + segment.slice(1),
          href,
          isLast
        });
      });
    }

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  return (
    <Box
      position="fixed"
      top={0}
      left={{ base: 0, lg: '64' }}
      right={0}
      height="16"
      bg={bgColor}
      borderBottom="1px"
      borderBottomColor={borderColor}
      px={4}
      zIndex="sticky"
    >
      <Flex h="full" align="center" justify="space-between">
        <HStack spacing={4}>
          <IconButton
            aria-label="Open menu"
            icon={<MdMenu />}
            variant="ghost"
            display={{ base: 'flex', lg: 'none' }}
            onClick={onMobileMenuClick}
          />
          
          <BreadcrumbList>
            {breadcrumbs.map((breadcrumb, index) => (
              <Fragment key={`${breadcrumb.href}-${index}`}>
                <BreadcrumbItem>
                  <BreadcrumbLink href={breadcrumb.href} isLast={breadcrumb.isLast}>
                    {breadcrumb.label}
                  </BreadcrumbLink>
                </BreadcrumbItem>
                {!breadcrumb.isLast && <BreadcrumbSeparator />}
              </Fragment>
            ))}
          </BreadcrumbList>
        </HStack>

        <Menu>
          <MenuButton>
            <HStack spacing={3}>
              <Avatar size="sm" name={adminEmail} />
              <Text display={{ base: 'none', md: 'block' }}>
                {adminEmail}
              </Text>
            </HStack>
          </MenuButton>
          <MenuList>
            <MenuItem icon={<MdLogout />} onClick={onLogout}>
              Sign Out
            </MenuItem>
          </MenuList>
        </Menu>
      </Flex>
    </Box>
  );
} 