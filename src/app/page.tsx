'use client';

import { Box, Button, Flex, Heading, Text, useColorMode } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import { APP_ROUTES } from '@/constants';
import ColorModeSwitcher from '@/app/components/ui/color-mode-switcher';

export default function Home() {
  const { colorMode } = useColorMode();
  const router = useRouter();

  return (
    <Box minH="100vh" p={8} maxW="1200px" mx="auto">
      <Flex justify="space-between" align="center" mb={8}>
        <Heading>SkyFox Cinema Development</Heading>
        <ColorModeSwitcher />
      </Flex>
      
      <Text mb={6}>Welcome to SkyFox Cinema development page.</Text>
      
      <Flex direction="column" gap={4} maxW="400px">
        <Button onClick={() => router.push(APP_ROUTES.LOGIN)} colorScheme="orange">
          Go to Login Page
        </Button>
        
        <Button onClick={() => router.push(APP_ROUTES.SHOWS)} colorScheme="blue">
          Go to Shows Page
        </Button>
        
        <Button onClick={() => router.push('/theme-preview')} colorScheme="purple">
          View Theme Preview
        </Button>
      </Flex>
    </Box>
  );
}
