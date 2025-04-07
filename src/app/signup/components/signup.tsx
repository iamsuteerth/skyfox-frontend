'use client';

import React from 'react';
import { Box, VStack } from '@chakra-ui/react';
import PageContainer from '@/app/components/page-container';
import NeumorphicCard from '@/app/components/neumorphic-card';
import SignupHeader from '@/app/signup/components/signup-header';
import BrandLogo from '@/app/components/brand-logo';
import SignupForm from '@/app/signup/components/signup-form';

export default function Signup() {
  return (
    <>
      <SignupHeader />
      <PageContainer>
        <NeumorphicCard maxW="960px" w="100%" mx="auto">
          <VStack spacing={8} align="stretch">
            <BrandLogo showHeading={false} showTagline={false} />
            <SignupForm />
          </VStack>
        </NeumorphicCard>
      </PageContainer>
    </>
  );
}