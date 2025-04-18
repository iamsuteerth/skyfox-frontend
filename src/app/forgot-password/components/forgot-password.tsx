'use client';

import { useState } from 'react';
import { VStack, Box } from '@chakra-ui/react';
import { useSteps } from '@chakra-ui/react';

import BrandLogo from '@/app/components/brand-logo';
import NeumorphicCard from '@/app/components/neumorphic-card';
import PageContainer from '@/app/components/page-container';

import EmailStep from './email-step';
import SecurityStep from './security-step';
import ResetStep from './reset-step';
import ForgotPasswordHeader from './forgot-password-stepper';

const steps = [
  { title: 'Email', description: 'Enter your email address' },
  { title: 'Verify', description: 'Answer security question' },
  { title: 'Reset', description: 'Create new password' }
];

export default function ForgotPassword() {
  const { activeStep, setActiveStep } = useSteps({
    index: 0,
    count: steps.length,
  });

  const [email, setEmail] = useState('');
  const [questionId, setQuestionId] = useState<number | null>(null);
  const [question, setQuestion] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [error, setError] = useState('');

  const resetFlow = () => {
    setEmail('');
    setQuestionId(null);
    setQuestion('');
    setResetToken('');
    setError('');
    setActiveStep(0);
  };

  return (
    <>
      <ForgotPasswordHeader currentStep={activeStep} />
      <PageContainer>
        <NeumorphicCard maxW="480px" w="100%" mx="auto">
          <VStack spacing={8} align="stretch">
            <BrandLogo tagline="Reset your password" />

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

            {activeStep === 0 && (
              <EmailStep
                email={email}
                setEmail={setEmail}
                setQuestion={setQuestion}
                setQuestionId={setQuestionId}
                setActiveStep={setActiveStep}
                setError={setError}
              />
            )}

            {activeStep === 1 && (
              <SecurityStep
                email={email}
                question={question}
                setResetToken={setResetToken}
                setActiveStep={setActiveStep}
                setError={setError}
              />
            )}

            {activeStep === 2 && (
              <ResetStep
                email={email}
                resetToken={resetToken}
                resetFlow={resetFlow}
                setError={setError}
              />
            )}
          </VStack>
        </NeumorphicCard>
      </PageContainer>
    </>
  );
}