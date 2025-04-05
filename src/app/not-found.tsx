'use client';

import { Box, Heading, Text, Center, VStack } from '@chakra-ui/react';

export default function NotFound() {
  const bgColor = 'background.primary';
  const textColor = 'text.primary';
  const headingColor = 'text.primary';

  return (
    <Box minH="100vh" bg={bgColor}>
      <Center h="100vh">
        <VStack spacing={6} maxW="500px" textAlign="center" p={4}>
          <Heading size="2xl" color={headingColor}>404</Heading>
          <Heading size="lg" color={headingColor}>Page Not Found</Heading>
          <Text color={textColor}>The page you are looking for doesn't exist or has been moved.</Text>
        </VStack>
      </Center>
    </Box>
  );
}
