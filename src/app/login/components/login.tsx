'use client';

import { useState } from 'react';
import NextLink from 'next/link';
import {
  Button,
  VStack,
  Box,
  Text,
  Flex,
  Link,
  IconButton
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';

import { useAuth } from '@/contexts/auth-context';
import { APP_ROUTES } from '@/constants';

import BrandLogo from '@/app/components/brand-logo';
import FormInput from '@/app/components/form-input';
import NeumorphicCard from '@/app/components/neumorphic-card';
import PageContainer from '@/app/components/page-container';

export default function LoginClient() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const { login, isLoading, error } = useAuth();

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
    <PageContainer>
      <NeumorphicCard maxW="480px" w="100%" mx="auto">
        <VStack spacing={8} align="stretch">
          <BrandLogo />

          {error && (
            <Box
              bg="error"
              color="white"
              py={2}
              px={4}
              borderRadius="md"
              textAlign="center"
            >
              {error}
            </Box>
          )}

          <form onSubmit={handleSubmit}>
            <VStack spacing={6}>
              <FormInput
                label="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                error={usernameError}
              />

              <FormInput
                label="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                type={showPassword ? 'text' : 'password'}
                error={passwordError}
                rightElement={
                  <IconButton
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                    onClick={() => setShowPassword(!showPassword)}
                    variant="ghost"
                    size="sm"
                    color="text.tertiary"
                  />
                }
              />

              <Button
                type="submit"
                isLoading={isLoading}
                loadingText="Signing in"
                w="100%"
                size="lg"
                height="56px"
                mt={2}
                borderRadius="xl"
                bg="primary"
                color="white"
                _hover={{
                  bg: "#CC4300",
                }}
                _active={{
                  bg: "#B03B00",
                }}
              >
                Sign In
              </Button>
            </VStack>
          </form>

          <Flex justify="center" mt={2}>
            <Link
              as={NextLink}
              href={APP_ROUTES.FORGOT_PASSWORD}
              color="primary"
              fontWeight="medium"
              _hover={{
                textDecoration: "none",
                color: "#CC4300"
              }}
            >
              Forgot password?
            </Link>
          </Flex>

          <Box textAlign="center" mt={2}>
            <Text color="text.secondary">
              Don&apos;t have an account?{' '}
              <Link
                as={NextLink}
                href={APP_ROUTES.SIGNUP}
                color="primary"
                fontWeight="medium"
                _hover={{
                  textDecoration: "none",
                  color: "#CC4300"
                }}
              >
                Sign up
              </Link>
            </Text>
          </Box>
        </VStack>
      </NeumorphicCard>
    </PageContainer>
  );
}
