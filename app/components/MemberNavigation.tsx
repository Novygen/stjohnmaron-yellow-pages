"use client";

import {
  Box,
  Flex,
  HStack,
  IconButton,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useDisclosure,
  useColorModeValue,
  Text,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  VStack,
} from "@chakra-ui/react";
import { FiMenu, FiX, FiUser, FiLogOut, FiChevronDown } from "react-icons/fi";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { auth } from "@/firebase";
import { signOut } from "firebase/auth";
import { useDispatch } from "react-redux";
import { clearUser } from "@/store/slices/userSlice";

const NAV_ITEMS = [
  {
    label: "Dashboard",
    href: "/member",
  },
  {
    label: "Profile",
    href: "/member/profile",
  },
  {
    label: "Directory",
    href: "/",
  },
];

export default function MemberNavigation() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();
  
  const bg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      dispatch(clearUser());
      router.push("/sign-in");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const NavLink = ({ href, children, isMobile = false }: { href: string; children: React.ReactNode; isMobile?: boolean }) => {
    const isActive = pathname === href;
    const activeProps = isActive
      ? {
          color: "blue.500",
          fontWeight: "semibold",
        }
      : {};

    return (
      <Link href={href} passHref>
        <Text
          px={3}
          py={2}
          rounded="md"
          _hover={{
            textDecoration: "none",
            bg: useColorModeValue("gray.50", "gray.700"),
          }}
          cursor="pointer"
          {...activeProps}
          display="block"
          w={isMobile ? "full" : "auto"}
        >
          {children}
        </Text>
      </Link>
    );
  };

  return (
    <Box>
      <Flex
        bg={bg}
        px={4}
        h={16}
        alignItems="center"
        justifyContent="space-between"
        borderBottom={1}
        borderStyle="solid"
        borderColor={borderColor}
      >
        <IconButton
          size="md"
          icon={isOpen ? <FiX /> : <FiMenu />}
          aria-label="Open Menu"
          display={{ md: "none" }}
          onClick={isOpen ? onClose : onOpen}
        />

        <HStack spacing={8} alignItems="center">
          <Box fontWeight="bold" fontSize="lg">
            St. John Maron
          </Box>
          <HStack as="nav" spacing={4} display={{ base: "none", md: "flex" }}>
            {NAV_ITEMS.map((item) => (
              <NavLink key={item.href} href={item.href}>
                {item.label}
              </NavLink>
            ))}
          </HStack>
        </HStack>

        <Menu>
          <MenuButton
            as={Button}
            rounded="full"
            variant="link"
            cursor="pointer"
            minW={0}
            rightIcon={<FiChevronDown />}
          >
            <HStack>
              <FiUser />
              <Text display={{ base: "none", md: "block" }}>Account</Text>
            </HStack>
          </MenuButton>
          <MenuList>
            <MenuItem icon={<FiUser />} as={Link} href="/member/profile">
              Profile
            </MenuItem>
            <MenuItem icon={<FiLogOut />} onClick={handleSignOut}>
              Sign Out
            </MenuItem>
          </MenuList>
        </Menu>
      </Flex>

      <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader borderBottomWidth="1px">Menu</DrawerHeader>
          <DrawerBody>
            <VStack align="stretch" spacing={4}>
              {NAV_ITEMS.map((item) => (
                <NavLink key={item.href} href={item.href} isMobile>
                  {item.label}
                </NavLink>
              ))}
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
  );
} 