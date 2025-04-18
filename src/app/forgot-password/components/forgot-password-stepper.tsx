'use client';

import NextLink from 'next/link';
import { Box, Flex, Heading, Text, useBreakpointValue } from '@chakra-ui/react';
import { ArrowLeft } from 'lucide-react';
import { APP_ROUTES } from '@/constants';

interface ForgotPasswordHeaderProps {
  currentStep?: number;
}

export default function ForgotPasswordHeader({ currentStep = 0 }: ForgotPasswordHeaderProps) {
  const headerPadding = useBreakpointValue({ base: 4, md: 6, lg: 8 });
  const fontSize = useBreakpointValue({ base: 'xl', md: '2xl', lg: '3xl' });
  const showSubtitle = useBreakpointValue({ base: false, sm: true });

  const getSubtitle = () => {
    switch (currentStep) {
      case 0:
        return "Enter your email to begin the recovery process";
      case 1:
        return "Verify your identity by answering your security question";
      case 2:
        return "Create a new password for your account";
      default:
        return "Follow the steps to reset your password";
    }
  };

  return (
    <Box
      as="header"
      width="100%"
      bg="white"
      boxShadow="sm"
      borderBottom="1px"
      borderColor="gray.100"
      mb={6}
    >
      <Flex
        maxW="1200px"
        mx="auto"
        py={headerPadding}
        px={headerPadding}
        direction="column"
        align="flex-start"
      >
        <NextLink href={APP_ROUTES.LOGIN}>
          <Flex
            align="center"
            color="gray.500"
            _hover={{ color: "primary" }}
          >
            <ArrowLeft size={16} style={{ marginRight: '8px' }} />
            Back to Login
          </Flex>
        </NextLink>

        <Heading
          as="h1"
          fontSize={fontSize}
          fontWeight="bold"
          color="gray.800"
        >
          Reset Your Password
        </Heading>

        {showSubtitle && (
          <Text
            color="gray.600"
            mt={1}
            fontSize={{ base: 'sm', md: 'md' }}
          >
            {getSubtitle()}
          </Text>
        )}
      </Flex>
    </Box>
  );
}