'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { APP_ROUTES } from '@/constants';
import { useAuth } from '@/contexts/auth-context';
import { Box, Center, Spinner } from '@chakra-ui/react';

export default function Home() {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  const bgColor = 'background.primary'
  const spinnerColor = 'primary'

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
    <Box bg={bgColor} minH="100vh" w="100%">
      <Center h="100vh">
        <Spinner
          thickness="4px"
          speed="0.65s"
          color={spinnerColor}
          emptyColor="surface.light" 
          size="xl"
        />

      </Center>
    </Box>
  );
}
