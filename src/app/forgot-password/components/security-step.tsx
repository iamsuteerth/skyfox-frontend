'use client';

import { useState } from 'react';
import { VStack, Button, FormControl, FormLabel, Text, Box } from '@chakra-ui/react';
import { verifySecurityAnswer } from '@/services/auth-service';
import { ERROR_MESSAGES } from '@/constants';
import FormInput from '@/app/components/form-input';

interface SecurityStepProps {
  email: string;
  question: string;
  setResetToken: (token: string) => void;
  setActiveStep: (step: number) => void;
  setError: (error: string) => void;
}

export default function SecurityStep({
  email,
  question,
  setResetToken,
  setActiveStep,
  setError
}: SecurityStepProps) {
  const [securityAnswer, setSecurityAnswer] = useState('');
  const [securityAnswerError, setSecurityAnswerError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [localError, setLocalError] = useState('');

  const validateSecurityAnswer = () => {
    if (!securityAnswer) {
      setSecurityAnswerError('Security answer is required');
      return false;
    }

    if (securityAnswer.length < 3) {
      setSecurityAnswerError('Security answer must be at least 3 characters long');
      return false;
    }

    setSecurityAnswerError('');
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateSecurityAnswer()) return;

    setIsLoading(true);
    setError('');
    setLocalError('');

    try {
      const response = await verifySecurityAnswer({
        email,
        security_answer: securityAnswer
      });

      if (response.status === 'ERROR') {
        throw new Error(response.message || ERROR_MESSAGES.GENERIC_ERROR);
      }

      setResetToken(response.data.reset_token);
      setActiveStep(2);
    } catch (err: any) {
      console.error('Error verifying security answer:', err);
      setLocalError(err.message || ERROR_MESSAGES.GENERIC_ERROR);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <VStack spacing={6} align="stretch">
      {localError && (
        <Box
          bg="error"
          color="white"
          py={2}
          px={4}
          borderRadius="md"
          textAlign="center"
        >
          {localError}
        </Box>
      )}

      <form onSubmit={handleSubmit}>
        <VStack spacing={6}>
          <FormControl>
            <FormLabel fontWeight="medium">Security Question</FormLabel>
            <Text color="text.tertiary" p={4} bg="background.secondary" borderRadius="md">
              {question}
            </Text>
          </FormControl>

          <FormInput
            label="Your Answer"
            type='password'
            value={securityAnswer}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSecurityAnswer(e.target.value)}
            placeholder="Enter your answer"
            error={securityAnswerError}
          />

          <Button
            type="submit"
            isLoading={isLoading}
            loadingText="Verifying"
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
            Verify
          </Button>
        </VStack>
      </form>
    </VStack>
  );
}
