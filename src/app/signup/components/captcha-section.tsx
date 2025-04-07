'use client';

import React from 'react';
import { Box, Heading, FormControl, FormLabel, HStack, Text, IconButton } from '@chakra-ui/react';
import { RepeatIcon } from '@chakra-ui/icons';
import FormInput from '@/app/components/form-input';

interface CaptchaSectionProps {
  formData: {
    captchaAnswer: string;
    errors: {
      [key: string]: string;
    };
  };
  handleInputChange: (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => void;
  regenerateCaptcha: () => void;
  firstNumber: number;
  secondNumber: number;
}

const CaptchaSection: React.FC<CaptchaSectionProps> = ({
  formData,
  handleInputChange,
  regenerateCaptcha,
  firstNumber,
  secondNumber
}) => {
  return (
    <>
      <Heading as="h2" size="md" mt={4} color="text.primary">Verify You're Human</Heading>
      
      <Box>
        <FormControl isInvalid={!!formData.errors.captchaAnswer}>
          <FormLabel fontWeight="medium" color="text.primary">Solve this simple math problem</FormLabel>
          
          <HStack spacing={4} mb={4} align="center">
            <Box bg="background.secondary" p={3} borderRadius="md">
              <Text fontWeight="bold" color="text.primary">{firstNumber}</Text>
            </Box>
            <Text color="text.primary" fontWeight="bold">+</Text>
            <Box bg="background.secondary" p={3} borderRadius="md">
              <Text fontWeight="bold" color="text.primary">{secondNumber}</Text>
            </Box>
            <Box>
              <IconButton
                aria-label="Generate new captcha"
                icon={<RepeatIcon />}
                onClick={regenerateCaptcha}
                size="lg"
                colorScheme="orange"
                variant="ghost"
              />
            </Box>
          </HStack>
          
          <FormInput
            label=""
            value={formData.captchaAnswer}
            onChange={handleInputChange('captchaAnswer')}
            placeholder="Enter your answer"
            type="number"
            error={formData.errors.captchaAnswer}
          />
        </FormControl>
      </Box>
    </>
  );
};

export default CaptchaSection;
