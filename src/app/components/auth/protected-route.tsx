'use client';

import { useEffect, useState, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Box, Spinner, Center } from '@chakra-ui/react';
import { useAuth } from '@/contexts/auth-context';
import { useCustomToast } from '@/app/components/ui/custom-toast';
import { APP_ROUTES, ERROR_MESSAGES } from '@/constants';

type ProtectedRouteProps = {
  children: ReactNode;
  allowedRoles?: string[];
  redirectPath?: string;
  showUnauthorizedMessage?: boolean;
};

export default function ProtectedRoute({
  children,
  allowedRoles = [],
  redirectPath = APP_ROUTES.SHOWS,
  showUnauthorizedMessage = true,
}: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const { showToast } = useCustomToast();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const checkAuthorization = async () => {
      if (isLoading) return;

      if (!user) {
        if (pathname !== APP_ROUTES.LOGIN) {
          sessionStorage.setItem('redirectAfterLogin', pathname);
        }
        router.push(APP_ROUTES.LOGIN);
        return;
      }

      if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
        if (showUnauthorizedMessage) {
          showToast({
            type: 'error',
            title: 'Access Denied',
            description: ERROR_MESSAGES.FORBIDDEN,
          });
        }

        router.push(redirectPath);
        return;
      }

      if (isMounted) {
        setIsAuthorized(true);
        setIsCheckingAuth(false);
      }
    };

    checkAuthorization();

    return () => {
      isMounted = false;
    };
  }, [user, isLoading, router, pathname, allowedRoles, showToast, redirectPath, showUnauthorizedMessage]);

  if (isLoading || isCheckingAuth) {
    return (
      <Box bg="background.primary" minH="100vh" w="100%">
        <Center h="100vh">
          <Spinner thickness="4px" speed="0.65s" color="primary" emptyColor="surface.light" size="xl" />
        </Center>
      </Box>
    );
  }

  return <>{children}</>;
}
