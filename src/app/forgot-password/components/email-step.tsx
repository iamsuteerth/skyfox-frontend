'use client';

import { useState } from 'react';
import { VStack, Button, Box } from '@chakra-ui/react';
import FormInput from '@/app/components/form-input';
import { getSecurityQuestionByEmail } from '@/services/security-question-service';
import { ERROR_MESSAGES } from '@/constants';

interface EmailStepProps {
  email: string;
  setEmail: (email: string) => void;
  setQuestion: (question: string) => void;
  setQuestionId: (id: number) => void;
  setActiveStep: (step: number) => void;
  setError: (error: string) => void;
}

export default function EmailStep({
  email,
  setEmail,
  setQuestion,
  setQuestionId,
  setActiveStep,
  setError
}: EmailStepProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [localError, setLocalError] = useState('');
  
  const validateEmail = () => {
    if (!email) {
      setEmailError('Email is required');
      return false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError('Please enter a valid email');
      return false;
    }
    
    setEmailError('');
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateEmail()) return;
    
    setIsLoading(true);
    setError(''); 
    setLocalError(''); 
    
    try {
      const response = await getSecurityQuestionByEmail(email);
      
      if (response.status === 'ERROR') {
        throw new Error(response.message || ERROR_MESSAGES.GENERIC_ERROR);
      }
      
      setQuestion(response.data.question);
      setQuestionId(response.data.question_id);
      setActiveStep(1);
    } catch (err: any) {
      console.error('Error fetching security question:', err);
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

      <form onSubmit={handleSubmit} noValidate>
        <VStack spacing={6}>
          <FormInput
            label="Email"
            value={email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
            placeholder="Enter your email address"
            error={emailError}
            type="email"
          />

          <Button
            type="submit"
            isLoading={isLoading}
            loadingText="Submitting"
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
            Continue
          </Button>
        </VStack>
      </form>
    </VStack>
  );
}
