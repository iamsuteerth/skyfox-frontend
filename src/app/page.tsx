'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Center, Spinner } from '@chakra-ui/react';
import { useAuth } from '@/contexts/auth-context';
import { APP_ROUTES } from '@/constants';

export default function Home() {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      if (user) {
        router.push(APP_ROUTES.SHOWS);
      } else {
        router.push(APP_ROUTES.LOGIN);
      }
    }
  }, [isLoading, user, router]);

  return (
    <Box bg="background.primary" minH="100vh" w="100%">
      <Center h="100vh">
        <Spinner thickness="4px" speed="0.65s" color="primary" emptyColor="surface.light" size="xl" />
      </Center>
    </Box>
  );
}
