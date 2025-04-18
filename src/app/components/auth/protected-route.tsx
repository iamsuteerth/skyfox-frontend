'use client';

import { useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Spinner, Center } from '@chakra-ui/react';
import { useAuth } from '@/contexts/auth-context';
import { useCustomToast } from '@/app/components/ui/custom-toast';
import { APP_ROUTES, ERROR_MESSAGES } from '@/constants';

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
  const { showToast } = useCustomToast();
  const [isAuthorized, setIsAuthorized] = useState(false);

  const bgColor = 'background.primary';
  const spinnerColor = 'primary';
  const spinnerEmptyColor = 'surface.light';

  useEffect(() => {
    if (isLoading) return;

    if (!user) {
      router.push(APP_ROUTES.LOGIN);
      return;
    }

    if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
      showToast({
        type: 'error',
        title: 'Error',
        description: ERROR_MESSAGES.FORBIDDEN,
      });

      router.push(APP_ROUTES.SHOWS);
      return;
    }

    setIsAuthorized(true);
  }, [user, isLoading, router, allowedRoles, showToast]);

  if (isLoading || !isAuthorized) {
    return (
      <Box bg={bgColor} minH="100vh" w="100%">
        <Center h="100vh">
          <Spinner
            thickness="4px"
            speed="0.65s"
            emptyColor={spinnerEmptyColor}
            color={spinnerColor}
            size="xl"
          />
        </Center>
      </Box>
    );
  }

  return <>{children}</>;
}
