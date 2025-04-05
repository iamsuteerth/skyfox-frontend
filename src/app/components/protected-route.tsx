// src/app/components/protected-route.tsx
'use client';

import { useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { APP_ROUTES, ERROR_MESSAGES } from '@/constants';
import { Box, Spinner, Center, useToast } from '@chakra-ui/react';

type ProtectedRouteProps = {
  children: ReactNode;
  allowedRoles?: string[];
};

export default function ProtectedRoute({ 
  children, 
  allowedRoles = [] 
}: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const toast = useToast();
  // Add immediate loading state
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    // If authentication is still loading, wait
    if (isLoading) return;

    // If no user, redirect to login immediately
    if (!user) {
      router.push(APP_ROUTES.LOGIN);
      return;
    }

    // Check role-based access
    if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
      toast({
        title: 'Unauthorized',
        description: ERROR_MESSAGES.FORBIDDEN,
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top-right'
      });
      
      router.push(APP_ROUTES.SHOWS);
      return;
    }

    // Only set authorized if all checks pass
    setIsAuthorized(true);
  }, [user, isLoading, router, allowedRoles, toast]);

  // Always show loading spinner until explicitly authorized
  if (isLoading || !isAuthorized) {
    return (
      <Center h="100vh">
        <Spinner 
          thickness="4px"
          speed="0.65s"
          emptyColor="gray.200"
          color="primary.light"
          _dark={{ color: 'primary.dark' }}
          size="xl"
        />
      </Center>
    );
  }

  // Only render children if authorized
  return <>{children}</>;
}
