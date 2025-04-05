'use client';

import { useEffect, useState } from 'react';
import { Box, Heading, Text, Center, VStack, Button, Spinner } from '@chakra-ui/react';
import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';
import { APP_ROUTES } from '@/constants';

export default function NotFound() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [redirectTimeLeft, setRedirectTimeLeft] = useState(5);
  const [isRedirecting, setIsRedirecting] = useState(false);
  
  const bgColor = 'background.primary';
  const textColor = 'text.primary';
  const headingColor = 'text.primary';
  
  // More robust redirection handling
  useEffect(() => {
    if (!isLoading && user) {
      setIsRedirecting(true);
      
      const interval = setInterval(() => {
        setRedirectTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            router.push(APP_ROUTES.SHOWS);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      return () => clearInterval(interval);
    }
  }, [user, isLoading, router]);

  const handleRedirect = () => {
    if (user) {
      router.push(APP_ROUTES.SHOWS);
    } else {
      router.push(APP_ROUTES.LOGIN);
    }
  };

  return (
    <Box minH="100vh" bg={bgColor}>
      <Center h="100vh">
        <VStack spacing={6} maxW="500px" textAlign="center" p={4}>
          <Heading size="2xl" color={headingColor}>404</Heading>
          <Heading size="lg" color={headingColor}>Page Not Found</Heading>
          <Text color={textColor}>The page you are looking for doesn't exist or has been moved.</Text>
          
          <Box minH="60px" display="flex" alignItems="center" justifyContent="center">
            {isLoading ? (
              <Spinner color="primary" size="md" />
            ) : (
              user && isRedirecting && redirectTimeLeft > 0 && (
                <Text color={textColor}>
                  Redirecting to shows page in {redirectTimeLeft} {redirectTimeLeft === 1 ? 'second' : 'seconds'}...
                </Text>
              )
            )}
            
            {isRedirecting && redirectTimeLeft === 0 && (
              <Text color={textColor}>
                Redirecting now...
              </Text>
            )}
          </Box>
          
          {isLoading ? (
            <Button
              isLoading
              loadingText="Loading"
              bg="primary"
              color="white"
              size="lg"
            >
              Loading
            </Button>
          ) : (
            <Button 
              onClick={handleRedirect}
              bg="primary"
              color="white"
              size="lg"
              isLoading={isRedirecting && redirectTimeLeft === 0}
              loadingText="Redirecting"
            >
              Go to {user ? 'Shows' : 'Login'}
            </Button>
          )}
        </VStack>
      </Center>
    </Box>
  );
}
