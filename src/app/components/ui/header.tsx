// src/app/components/ui/header.tsx
'use client';

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
  MenuDivider,
  useDisclosure,
  useColorModeValue,
  Stack,
  Avatar,
  Text,
  Image,
  Link,
} from '@chakra-ui/react';
import { HamburgerIcon, CloseIcon } from '@chakra-ui/icons';
import { useAuth } from '@/contexts/auth-context';
import ColorModeSwitcher from './color-mode-switcher';
import NextLink from 'next/link';
import { APP_ROUTES } from '@/constants';

const formatRole = (role?: string) => {
  if (!role) return '';
  return role.charAt(0).toUpperCase() + role.slice(1);
};

export default function Header() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { user, logout } = useAuth();

  const bg = useColorModeValue('background.primary.light', 'background.primary.dark');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  return (
    <Box bg={bg} px={4} boxShadow="sm" borderBottom="1px" borderColor={borderColor}>
      <Flex h={16} alignItems={'center'} justifyContent={'space-between'} maxW="1200px" mx="auto">
        <IconButton
          size={'md'}
          icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
          aria-label={'Open Menu'}
          display={{ md: 'none' }}
          onClick={isOpen ? onClose : onOpen}
        />
        <HStack spacing={8} alignItems={'center'}>
          <Link
            as={NextLink}
            href={APP_ROUTES.SHOWS}
            style={{ textDecoration: 'none' }}
          >
            <HStack>
              <Image src="/globe.svg" alt="SkyFox Logo" boxSize="32px" />
              <Text
                fontFamily={'heading'}
                fontWeight="bold"
                fontSize="xl"
                display={{ base: 'none', md: 'flex' }}
              >
                SkyFox
              </Text>
            </HStack>
          </Link>
          <HStack as={'nav'} spacing={4} display={{ base: 'none', md: 'flex' }}>
            <Button
              as={NextLink}
              href={APP_ROUTES.SHOWS}
              variant="ghost"
            >
              Shows
            </Button>
            {user?.role === 'admin' && (
              <>
                <Button
                  as={NextLink}
                  href="/admin/dashboard"
                  variant="ghost"
                >
                  Dashboard
                </Button>
                <Button
                  as={NextLink}
                  href="/admin/manage-shows"
                  variant="ghost"
                >
                  Manage Shows
                </Button>
              </>
            )}
            {user?.role === 'staff' && (
              <Button
                as={NextLink}
                href="/staff/check-in"
                variant="ghost"
              >
                Check-In
              </Button>
            )}
          </HStack>
        </HStack>
        <Flex alignItems={'center'}>
          <Box mr={2}>
            <ColorModeSwitcher />
          </Box>
          <Menu>
            <MenuButton
              as={Button}
              rounded={'full'}
              variant={'link'}
              cursor={'pointer'}
              minW={0}>
              {user?.role === 'customer' ? (
                <Avatar size={'sm'} src={'/default-profile.jpg'} />
              ) : (
                <Avatar size={'sm'} bg="primary.light" _dark={{ bg: 'primary.dark' }} />
              )}
            </MenuButton>
            <MenuList>
              <Text px={3} py={2} fontWeight="bold">
                {user?.username}
              </Text>
              <Text px={3} pb={2} fontSize="sm" color="gray.500">
                {formatRole(user?.role)}
              </Text>
              <MenuDivider />
              <MenuItem as={NextLink} href="/profile">
                Profile
              </MenuItem>
              {user?.role === 'customer' && (
                <MenuItem as={NextLink} href="/bookings">
                  My Bookings
                </MenuItem>
              )}
              <MenuDivider />
              <MenuItem onClick={logout}>Sign Out</MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </Flex>

      {/* Mobile menu */}
      {isOpen && (
        <Box pb={4} display={{ md: 'none' }}>
          <Stack as={'nav'} spacing={4}>
            <Button
              as={NextLink}
              href={APP_ROUTES.SHOWS}
              w="full" 
              variant="ghost"
            >
              Shows
            </Button>
            {user?.role === 'admin' && (
              <>
                <Button
                  as={NextLink}
                  href="/admin/dashboard"
                  w="full" 
                  variant="ghost"
                >
                  Dashboard
                </Button>
                <Button
                  as={NextLink}
                  href="/admin/manage-shows"
                  w="full" 
                  variant="ghost"
                >
                  Manage Shows
                </Button>
              </>
            )}
            {user?.role === 'staff' && (
              <Button
                as={NextLink}
                href="/staff/check-in"
                w="full" 
                variant="ghost"
              >
                Check-In
              </Button>
            )}
            <Button
              as={NextLink}
              href="/profile"
              w="full" 
              variant="ghost"
            >
              Profile
            </Button>
            {user?.role === 'customer' && (
              <Button
                as={NextLink}
                href="/bookings"
                w="full" 
                variant="ghost"
              >
                My Bookings
              </Button>
            )}
            <Button 
              w="full" 
              variant="ghost" 
              onClick={logout}
            >
              Sign Out
            </Button>
          </Stack>
        </Box>
      )}
    </Box>
  );
}
