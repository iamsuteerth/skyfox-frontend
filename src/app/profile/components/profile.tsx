'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Flex,
  Heading,
  Text,
  VStack,
  HStack,
  Card,
  CardBody,
  Button,
  Divider,
  Badge,
  useBreakpointValue,
  Skeleton,
  FlexProps,
  Avatar
} from '@chakra-ui/react';
import { EditIcon } from '@chakra-ui/icons';

import { useAuth } from '@/contexts/auth-context';
import { useDialog } from '@/contexts/dialog-context';
import DialogManager from './dialogs/dialog-manager';
import { useCustomToast } from '@/app/components/ui/custom-toast';

import { AdminStaffProfileResponse, CustomerProfileResponse, getProfile } from '@/services/profile-service';
import { formatTimestampToOrdinalDate } from '@/utils/date-utils';
import { ROLES } from '@/constants';

import ProfileImage from '@/app/components/profile-image';
import { RoleBasedElement } from '@/app/components/auth/role-based-element';
import LatestBookingCard from './latest-booking-card';

const Profile: React.FC = () => {
  const { user } = useAuth();
  const { openDialog } = useDialog();
  const { showToast } = useCustomToast();
  const [isLoading, setIsLoading] = useState(true);
  const [profileData, setProfileData] = useState<CustomerProfileResponse['data'] | AdminStaffProfileResponse['data'] | null>(null);
  const [error, setError] = useState<string | null>(null);


  const columnDirection = useBreakpointValue<FlexProps['direction']>({ base: 'column', md: 'row' });
  const columnWidth = useBreakpointValue({ base: '100%', md: '50%' });
  const spacing = useBreakpointValue({ base: 4, md: 6 });
  const profileImageSize = useBreakpointValue({ base: 'xl', sm: '2xl', md: '2xl' })

  const fetchProfileData = async () => {
    setIsLoading(true);
    try {
      const response = await getProfile(showToast);
      if (response && response.status === 'SUCCESS') {
        setProfileData(response.data);
        setError(null);
      }
    } catch (err: any) {
      console.error('Error fetching profile data:', err);
      setError('Failed to load profile data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, [showToast]);

  const handleChangePassword = () => {
    openDialog('changePassword');
  };

  const handleUpdateProfile = () => {
    openDialog('updateProfile', { ...customerData, onSuccess: fetchProfileData });
  };

  const handleUpdateProfileImage = () => {
    if (isLoading) {
      return;
    }
    openDialog('updateProfileImage', customerData)
  }

  const formatRole = (role?: string) => {
    if (!role) return '';
    return role.charAt(0).toUpperCase() + role.slice(1);
  };

  const isCustomer = user?.role === ROLES.CUSTOMER;
  const customerData = isCustomer ? profileData as CustomerProfileResponse['data'] : null;
  const adminStaffData = !isCustomer ? profileData as AdminStaffProfileResponse['data'] : null;

  return (
    <Container maxW="container.xl" py={8}>
      <Heading as="h1" size="lg" mb={6} color="text.primary">
        My Profile
      </Heading>

      <Flex direction={columnDirection} gap={spacing} align="flex-start">
        <Box width={columnWidth} bg="background.primary" borderRadius="xl" p={6} borderWidth="1px" borderColor="surface.light">
          <VStack spacing={6} align="center">
            <Skeleton isLoaded={!isLoading} borderRadius="full">
              <RoleBasedElement
                allowedRoles={[ROLES.CUSTOMER]}
                fallback={<Avatar size={profileImageSize} bg="primary" />}
              >
                <ProfileImage size={profileImageSize} />
              </RoleBasedElement>
            </Skeleton>

            <VStack spacing={2} align="center">
              <RoleBasedElement allowedRoles={[ROLES.CUSTOMER, ROLES.ADMIN, ROLES.STAFF]}>
                <Skeleton isLoaded={!isLoading}>
                  <Text fontSize="xl" fontWeight="bold" color="text.primary">
                    {user?.username || ''}
                  </Text>
                </Skeleton>

                <Skeleton isLoaded={!isLoading}>
                  <Badge colorScheme="brand" px={3} py={1} borderRadius="full">
                    {formatRole(user?.role)}
                  </Badge>
                </Skeleton>

                <Skeleton isLoaded={!isLoading}>
                  <Text fontSize="sm" color="text.tertiary" paddingTop={2}>
                    Member since {formatTimestampToOrdinalDate(profileData?.created_at || '')}
                  </Text>
                </Skeleton>
              </RoleBasedElement>
            </VStack>

            <VStack spacing={3} width="100%">
              <RoleBasedElement allowedRoles={[ROLES.CUSTOMER, ROLES.ADMIN, ROLES.STAFF]}>
                <Skeleton isLoaded={!isLoading} width="100%">
                  <Button
                    onClick={handleChangePassword}
                    width="100%"
                    colorScheme="primary"
                    variant="outline"
                  >
                    Change Password
                  </Button>
                </Skeleton>
              </RoleBasedElement>

              <RoleBasedElement allowedRoles={[ROLES.CUSTOMER]}>
                <Skeleton isLoaded={!isLoading} width="100%">
                  <Button
                    width="100%"
                    leftIcon={<EditIcon />}
                    onClick={handleUpdateProfileImage}
                    colorScheme="primary"
                  >
                    Update Profile Image
                  </Button>
                </Skeleton>
              </RoleBasedElement>

              <RoleBasedElement allowedRoles={[ROLES.CUSTOMER]}>
                <Skeleton isLoaded={!isLoading} width="100%">
                  <Button
                    onClick={handleUpdateProfile}
                    width="100%"
                    leftIcon={<EditIcon />}
                    colorScheme="primary"
                  >
                    Update Profile
                  </Button>
                </Skeleton>
              </RoleBasedElement>
            </VStack>
          </VStack>
        </Box>

        <Box width={columnWidth}>
          <VStack spacing={spacing} align="stretch">
            <Card bg="background.primary" borderColor="surface.light" borderWidth="1px">
              <CardBody>
                <VStack spacing={4} align="stretch">
                  <Flex justify="space-between" align="center">
                    <Heading size="md" color="text.primary">Account Information</Heading>
                  </Flex>

                  <Divider borderColor="surface.light" />

                  <RoleBasedElement allowedRoles={[ROLES.CUSTOMER]}>
                    <VStack spacing={3} align="stretch">
                      <Skeleton isLoaded={!isLoading}>
                        <Flex justify="space-between" align="center">
                          <Text color="text.secondary" fontWeight="medium" flexShrink={0} mr={2}>Full Name</Text>
                          <Text color="text.primary" textAlign="right">{customerData?.name || '-'}</Text>
                        </Flex>
                      </Skeleton>

                      <Skeleton isLoaded={!isLoading}>
                        <Flex justify="space-between" align="center">
                          <Text color="text.secondary" fontWeight="medium" flexShrink={0} mr={2}>Email</Text>
                          <Text color="text.primary" textAlign="right" wordBreak="break-word">{customerData?.email || '-'}</Text>
                        </Flex>
                      </Skeleton>

                      <Skeleton isLoaded={!isLoading}>
                        <Flex justify="space-between" align="center">
                          <Text color="text.secondary" fontWeight="medium" flexShrink={0} mr={2}>Phone Number</Text>
                          <Text color="text.primary" textAlign="right">{customerData?.phone_number || '-'}</Text>
                        </Flex>
                      </Skeleton>

                      <Skeleton isLoaded={!isLoading}>
                        <Flex justify="space-between" align="center">
                          <Text color="text.secondary" fontWeight="medium" flexShrink={0} mr={2}>Security Question</Text>
                          <Text color="text.primary" textAlign="right">{customerData?.security_question_exists ? '●●●●●●●' : 'Not set up'}</Text>
                        </Flex>
                      </Skeleton>
                    </VStack>
                  </RoleBasedElement>

                  <RoleBasedElement allowedRoles={[ROLES.ADMIN, ROLES.STAFF]}>
                    <VStack spacing={3} align="stretch">
                      <Skeleton isLoaded={!isLoading}>
                        <Flex justify="space-between" align="center">
                          <Text color="text.secondary" fontWeight="medium" flexShrink={0} mr={2}>Full Name</Text>
                          <Text color="text.primary" textAlign="right">{adminStaffData?.name || '-'}</Text>
                        </Flex>
                      </Skeleton>

                      <Skeleton isLoaded={!isLoading}>
                        <Flex justify="space-between" align="center">
                          <Text color="text.secondary" fontWeight="medium" flexShrink={0} mr={2}>Username</Text>
                          <Text color="text.primary" textAlign="right">{user?.username || '-'}</Text>
                        </Flex>
                      </Skeleton>

                      <Skeleton isLoaded={!isLoading}>
                        <Flex justify="space-between" align="center">
                          <Text color="text.secondary" fontWeight="medium" flexShrink={0} mr={2}>Counter No.</Text>
                          <Text color="text.primary" textAlign="right">{adminStaffData?.counter_no?.toString() || '-'}</Text>
                        </Flex>
                      </Skeleton>
                    </VStack>
                  </RoleBasedElement>
                </VStack>
              </CardBody>
            </Card>
            <RoleBasedElement allowedRoles={[ROLES.CUSTOMER]}>
              <LatestBookingCard />
            </RoleBasedElement>
          </VStack>
        </Box>
      </Flex>

      <DialogManager />
    </Container>
  );
};

export default Profile;
