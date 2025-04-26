'use client';

import NextLink from 'next/link';
import router from 'next/router';
import { usePathname } from 'next/navigation';

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
  Stack,
  Avatar,
  Text,
  Image,
  Link
} from '@chakra-ui/react';
import { HamburgerIcon, CloseIcon } from '@chakra-ui/icons';

import { useAuth } from '@/contexts/auth-context';
import { APP_ROUTES, ROLES } from '@/constants';
import ProfileImage from '@/app/components/profile-image';

const formatRole = (role?: string) => {
  if (!role) return '';
  return role.charAt(0).toUpperCase() + role.slice(1);
};

export default function Header() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { user, logout } = useAuth();
  const pathname = usePathname();

  const bg = 'background.primary';
  const borderColor = 'surface.light';

  const validRoutes = {
    shows: APP_ROUTES.SHOWS,
  };

  const handleShowsClick = (e: React.MouseEvent) => {
    e.preventDefault();
    router.push('/shows');
  };

  const isActive = (route: string) => pathname === route;

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
              <Image src="/assets/logo.png" alt="SkyFox Logo" boxSize="32px" />
              <Text
                fontFamily={'heading'}
                fontWeight="bold"
                fontSize="xl"
                display={{ base: 'none', md: 'flex' }}
                color="text.primary"
              >
                SkyFox
              </Text>
            </HStack>
          </Link>
          <HStack as={'nav'} spacing={4} display={{ base: 'none', md: 'flex' }}>
            <Button
              as={NextLink}
              href={APP_ROUTES.SHOWS}
              variant={isActive(validRoutes.shows) ? "solid" : "ghost"}
            >
              Shows
            </Button>
          </HStack>
        </HStack>
        <Flex alignItems={'center'}>
          <Menu>
            <MenuButton
              as={Button}
              rounded={'full'}
              variant={'link'}
              cursor={'pointer'}
              minW={0}>
              {user?.role === ROLES.CUSTOMER ? (
                <ProfileImage size="md" />
              ) : (
                <Avatar size={'md'} bg="primary" />
              )}
            </MenuButton>
            <MenuList bg="background.primary" borderColor="surface.light">
              <Text px={3} py={2} fontWeight="bold" color="text.primary">
                {user?.username}
              </Text>
              <Text px={3} pb={2} fontSize="sm" color="text.tertiary">
                {formatRole(user?.role)}
              </Text>
              <MenuDivider borderColor="surface.light" />
              <MenuItem as={NextLink} href={APP_ROUTES.PROFILE} bg="background.primary" _hover={{ bg: 'background.secondary' }}>
                Profile
              </MenuItem>
              <MenuDivider borderColor="surface.light" />
              <MenuItem onClick={logout} bg="background.primary" _hover={{ bg: 'background.secondary' }}>
                Sign Out
              </MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </Flex>

      {isOpen && (
        <Box pb={4} display={{ md: 'none' }} bg={bg}>
          <Stack as={'nav'} spacing={4}>
            <Button
              as={NextLink}
              href={APP_ROUTES.SHOWS}
              w="full"
              variant="ghost"
            >
              Shows
            </Button>
          </Stack>
        </Box>
      )}
    </Box>
  );
}
