'use client';

import { VStack, Heading, Text, Image } from '@chakra-ui/react';

interface BrandLogoProps {
  showTagline?: boolean;
  tagline?: string;
  size?: 'sm' | 'md' | 'lg';
  showHeading?: boolean;
}

export default function BrandLogo({
  showTagline = true,
  tagline = 'Sign in to your account',
  size = 'md',
  showHeading = true,
}: BrandLogoProps) {
  const logoSizes = {
    sm: { base: "60px", md: "70px" },
    md: { base: "80px", md: "100px" },
    lg: { base: "100px", md: "120px" },
  };

  const headingSizes = {
    sm: 'lg',
    md: 'xl',
    lg: '2xl'
  };

  return (
    <VStack spacing={4} mb={2} align="center">
      <Image
        src="/assets/logo.png"
        alt="SkyFox Logo"
        boxSize={logoSizes[size]}
        objectFit="contain"
      />
      {showHeading &&
        <>
          <Heading size={headingSizes[size]} color="text.primary" textAlign="center">
            SkyFox
          </Heading>
          {showTagline && (
            <Text color='text.tertiary' fontSize="lg" textAlign="center">
              {tagline}
            </Text>
          )}</>
      }

    </VStack>
  );
}
