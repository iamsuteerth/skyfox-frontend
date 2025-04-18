'use client';

import React from 'react';
import {
  VStack,
  Box,
  Text,
} from '@chakra-ui/react';
import FormInput from '@/app/components/form-input';

interface SecurityVerificationFormProps {
  securityQuestion: string | null;
  securityAnswer: string;
  securityError: string;
  onChange: (value: string) => void;
}

const SecurityVerificationForm: React.FC<SecurityVerificationFormProps> = ({
  securityQuestion,
  securityAnswer,
  securityError,
  onChange,
}) => {
  return (
    <VStack spacing={4} align="stretch">
      <Box
        p={4}
        borderRadius="md"
        bg="background.secondary"
        borderWidth="1px"
        borderColor="surface.light"
      >
        <Text fontWeight="medium" color="text.primary" mb={1}>Security Question</Text>
        <Text color="text.secondary">{securityQuestion || 'Loading security question...'}</Text>
      </Box>

      <FormInput
        label="Your Answer"
        value={securityAnswer}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Enter your answer"
        type="password"
        error={securityError}
      />

      <Text fontSize="sm" color="text.tertiary" mt={2}>
        For security reasons, we need to confirm your identity before making changes to your profile.
      </Text>
    </VStack>
  );
};

export default SecurityVerificationForm;
