// src/app/login/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Heading,
  Text,
  useToast,
  FormErrorMessage,
  InputGroup,
  InputRightElement,
  IconButton,
  Flex,
  Link,
  Card,
  CardBody,
  Image,
  useColorModeValue,
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import NextLink from 'next/link';
import { useAuth } from '@/contexts/auth-context';
import { APP_ROUTES, ERROR_MESSAGES } from '@/constants';
import ColorModeSwitcher from '@/app/components/ui/color-mode-switcher';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const { login, isLoading, error } = useAuth();
  const router = useRouter();
  const toast = useToast();

  // Theme colors
  const cardBg = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('text.primary.light', 'text.primary.dark');
  const inputBg = useColorModeValue('background.secondary.light', 'background.secondary.dark');

  const validateForm = () => {
    let isValid = true;

    if (!username) {
      setUsernameError('Username is required');
      isValid = false;
    } else {
      setUsernameError('');
    }

    if (!password) {
      setPasswordError('Password is required');
      isValid = false;
    } else {
      setPasswordError('');
    }

    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      await login(username, password);
    } catch (err: any) {
    }
  };

  return (
    <Box minH="100vh" bg={useColorModeValue('background.primary.light', 'background.primary.dark')}>
      <Box position="absolute" top={4} right={4}>
        <ColorModeSwitcher />
      </Box>

      <Flex direction="column" align="center" justify="center" minH="100vh" px={4}>
        <Card
          bg={cardBg}
          shadow="lg"
          borderRadius="xl"
          mx="auto"
          maxW="450px"
          w="100%"
          overflow="hidden"
        >
          <CardBody p={8}>
            <VStack spacing={6} align="stretch">
              <VStack spacing={2} mb={2} align="center">
                <Image src="/globe.svg" alt="SkyFox Logo" boxSize="80px" />
                <Heading size="xl" color={textColor}>SkyFox</Heading>
                <Text color={useColorModeValue('text.tertiary.light', 'text.tertiary.dark')}>
                  Sign in to your account
                </Text>
              </VStack>

              {error && (
                <Text color="error.light" _dark={{ color: 'error.dark' }} textAlign="center">
                  {error}
                </Text>
              )}

              <form onSubmit={handleSubmit}>
                <VStack spacing={4}>
                  <FormControl isInvalid={!!usernameError}>
                    <FormLabel>Username</FormLabel>
                    <Input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Enter your username"
                      bg={inputBg}
                    />
                    {usernameError && <FormErrorMessage>{usernameError}</FormErrorMessage>}
                  </FormControl>

                  <FormControl isInvalid={!!passwordError}>
                    <FormLabel>Password</FormLabel>
                    <InputGroup>
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        bg={inputBg}
                      />
                      <InputRightElement>
                        <IconButton
                          aria-label={showPassword ? 'Hide password' : 'Show password'}
                          icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                          onClick={() => setShowPassword(!showPassword)}
                          variant="ghost"
                          size="sm"
                        />
                      </InputRightElement>
                    </InputGroup>
                    {passwordError && <FormErrorMessage>{passwordError}</FormErrorMessage>}
                  </FormControl>

                  <Button
                    type="submit"
                    isLoading={isLoading}
                    loadingText="Signing in"
                    w="100%"
                    size="lg"
                  >
                    Sign In
                  </Button>
                </VStack>
              </form>

              <Flex justify="center" mt={2}>
                <Link
                  as={NextLink}
                  href={APP_ROUTES.FORGOT_PASSWORD}
                  color="primary.light"
                  _dark={{ color: 'primary.dark' }}
                >
                  Forgot password?
                </Link>
              </Flex>

              <Box textAlign="center" mt={4}>
                <Text>
                  Don&apos;t have an account?{' '}
                  <Link
                    as={NextLink}
                    href={APP_ROUTES.SIGNUP}
                    color="primary.light"
                    _dark={{ color: 'primary.dark' }}
                  >
                    Sign up
                  </Link>
                </Text>
              </Box>
            </VStack>
          </CardBody>
        </Card>
      </Flex>
    </Box>
  );
}
