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
} from '@chakra-ui/react';
import { useAuth } from '@/contexts/auth-context';
import { useDialog } from '@/contexts/dialog-context';
import { RoleBasedElement } from '@/app/components/auth/role-based-element';
import ProfileImage from '@/app/components/profile-image';
import DialogManager from './dialogs/dialog-manager';
import { ROLES } from '@/constants';
import { formatTimestampToOrdinalDate } from '@/utils/date-utils';

const Profile: React.FC = () => {
  const { user } = useAuth();
  const { openDialog } = useDialog();
  const [isLoading, setIsLoading] = useState(true);
  
  const columnDirection = useBreakpointValue<FlexProps['direction']>({base: 'column', md: 'row'});
  const columnWidth = useBreakpointValue({ base: '100%', md: '50%' });
  const spacing = useBreakpointValue({ base: 4, md: 6 });
  const profileImageSize = useBreakpointValue({base: 'xl',sm: '2xl',md: '2xl'})

  useEffect(() => {
    // Simulate profile data loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  const handleChangePassword = () => {
    openDialog('changePassword');
  };
  
  const handleUpdateProfile = () => {
    openDialog('updateProfile');
  };
  
  const formatRole = (role?: string) => {
    if (!role) return '';
    return role.charAt(0).toUpperCase() + role.slice(1);
  };
  
  return (
    <Container maxW="container.xl" py={8}>
      <Heading as="h1" size="lg" mb={6} color="text.primary">
        My Profile
      </Heading>
      
      <Flex direction={columnDirection} gap={spacing} align="flex-start">
        {/* Profile Section - Left Column */}
        <Box width={columnWidth} bg="background.primary" borderRadius="xl" p={6} borderWidth="1px" borderColor="surface.light">
          <VStack spacing={6} align="center">
            <Skeleton isLoaded={!isLoading} borderRadius="full">
              <RoleBasedElement 
                allowedRoles={[ROLES.CUSTOMER]} 
                fallback={<Box boxSize="150px" borderRadius="full" bg="primary" />}
              >
                <ProfileImage size={profileImageSize} />
              </RoleBasedElement>
            </Skeleton>
            
            <VStack spacing={2} align="center">
              <Skeleton isLoaded={!isLoading}>
                <Text fontSize="xl" fontWeight="bold" color="text.primary">
                  {user?.username || 'User'}
                </Text>
              </Skeleton>
              
              <Skeleton isLoaded={!isLoading}>
                <Badge colorScheme="brand" px={3} py={1} borderRadius="full">
                  {formatRole(user?.role)}
                </Badge>
              </Skeleton>
              
              <Skeleton isLoaded={!isLoading}>
                <Text fontSize="sm" color="text.tertiary" paddingTop={2}>
                  Member since {formatTimestampToOrdinalDate('2025-04-15 06:00:06.14253+00')}
                </Text>
              </Skeleton>
            </VStack>
            
            <VStack spacing={3} width="100%">
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
              
              <RoleBasedElement allowedRoles={[ROLES.CUSTOMER]}>
                <Skeleton isLoaded={!isLoading} width="100%">
                  <Button 
                    onClick={handleUpdateProfile}
                    width="100%" 
                    colorScheme="primary"
                  >
                    Update Profile
                  </Button>
                </Skeleton>
              </RoleBasedElement>
            </VStack>
          </VStack>
        </Box>
        
        {/* Account Details - Right Column */}
        <Box width={columnWidth}>
          <VStack spacing={spacing} align="stretch">
            {/* Account Information Card */}
            <Card bg="background.primary" borderColor="surface.light" borderWidth="1px">
              <CardBody>
                <VStack spacing={4} align="stretch">
                  <Flex justify="space-between" align="center">
                    <Heading size="md" color="text.primary">Account Information</Heading>
                  </Flex>
                  
                  <Divider borderColor="surface.light" />
                  
                  {/* Different details based on role */}
                  <RoleBasedElement allowedRoles={[ROLES.CUSTOMER]}>
                    <VStack spacing={3} align="stretch">
                      <Skeleton isLoaded={!isLoading}>
                        <HStack justify="space-between">
                          <Text color="text.secondary" fontWeight="medium">Full Name</Text>
                          <Text color="text.primary">{'John Doe'}</Text>
                        </HStack>
                      </Skeleton>
                      
                      <Skeleton isLoaded={!isLoading}>
                        <HStack justify="space-between">
                          <Text color="text.secondary" fontWeight="medium">Email</Text>
                          <Text color="text.primary">{'john.doe@example.com'}</Text>
                        </HStack>
                      </Skeleton>
                      
                      <Skeleton isLoaded={!isLoading}>
                        <HStack justify="space-between">
                          <Text color="text.secondary" fontWeight="medium">Phone</Text>
                          <Text color="text.primary">{'+1 (555) 123-4567'}</Text>
                        </HStack>
                      </Skeleton>
                      
                      <Skeleton isLoaded={!isLoading}>
                        <HStack justify="space-between">
                          <Text color="text.secondary" fontWeight="medium">Security Question</Text>
                          <Text color="text.primary">●●●●●●●</Text>
                        </HStack>
                      </Skeleton>
                    </VStack>
                  </RoleBasedElement>
                  
                  <RoleBasedElement allowedRoles={[ROLES.ADMIN, ROLES.STAFF]}>
                    <VStack spacing={3} align="stretch">
                      <Skeleton isLoaded={!isLoading}>
                        <HStack justify="space-between">
                          <Text color="text.secondary" fontWeight="medium">Username</Text>
                          <Text color="text.primary">{user?.username || 'admin123'}</Text>
                        </HStack>
                      </Skeleton>
                      
                      <Skeleton isLoaded={!isLoading}>
                        <HStack justify="space-between">
                          <Text color="text.secondary" fontWeight="medium">Role</Text>
                          <Text color="text.primary">{formatRole(user?.role)}</Text>
                        </HStack>
                      </Skeleton>
                      
                      {user?.role === ROLES.STAFF && (
                        <Skeleton isLoaded={!isLoading}>
                          <HStack justify="space-between">
                            <Text color="text.secondary" fontWeight="medium">Counter No.</Text>
                            <Text color="text.primary">{'3'}</Text>
                          </HStack>
                        </Skeleton>
                      )}
                    </VStack>
                  </RoleBasedElement>
                </VStack>
              </CardBody>
            </Card>
            
            {/* Latest Booking Preview for Customers (Coming Soon) */}
            <RoleBasedElement allowedRoles={[ROLES.CUSTOMER]}>
              <Card bg="background.primary" borderColor="surface.light" borderWidth="1px">
                <CardBody>
                  <VStack spacing={4} align="stretch">
                    <Flex justify="space-between" align="center">
                      <Heading size="md" color="text.primary">My Bookings</Heading>
                    </Flex>
                    
                    <Divider borderColor="surface.light" />
                    
                    <Box 
                      p={6} 
                      textAlign="center" 
                      borderWidth="1px" 
                      borderStyle="dashed" 
                      borderColor="surface.medium"
                      borderRadius="md"
                    >
                      <Text color="text.tertiary" mb={3}>
                        Your bookings will appear here once you make a reservation.
                      </Text>
                      <Button 
                        colorScheme="primary" 
                        variant="outline" 
                        isDisabled={true}
                      >
                        View All Bookings (Coming Soon)
                      </Button>
                    </Box>
                  </VStack>
                </CardBody>
              </Card>
            </RoleBasedElement>
          </VStack>
        </Box>
      </Flex>
      
      <DialogManager />
    </Container>
  );
};

export default Profile;
