'use client';

import React from 'react';
import {
  SimpleGrid,
  Heading,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Box,
  IconButton,
  useDisclosure
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { SecurityQuestion } from '@/services/security-question-service';
import FormInput from '@/app/components/form-input';
import Select from '@/app/components/select';

interface SecurityInfoSectionProps {
  formData: {
    password: string;
    confirmPassword: string;
    securityQuestionId: number;
    securityAnswer: string;
    errors: {
      [key: string]: string;
    };
  };
  securityQuestions: SecurityQuestion[];
  handleInputChange: (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSecurityQuestionChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  showPassword: boolean;
  showConfirmPassword: boolean;
  setShowPassword: (show: boolean) => void;
  setShowConfirmPassword: (show: boolean) => void;
}

const SecurityInfoSection: React.FC<SecurityInfoSectionProps> = ({
  formData,
  securityQuestions,
  handleInputChange,
  handleSecurityQuestionChange,
  showPassword,
  showConfirmPassword,
  setShowPassword,
  setShowConfirmPassword,
}) => {
  const { onOpen: onSelectOpen, onClose: onSelectClose } = useDisclosure();

  const securityQuestionOptions = securityQuestions.map(q => ({
    value: q.id,
    label: q.question
  }));

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    handleSecurityQuestionChange(e);
    onSelectClose();
  };

  return (
    <>
      <Heading as="h2" size="md" mt={4} color="text.primary">Security Information</Heading>
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
        <FormInput
          label="Password"
          value={formData.password}
          onChange={handleInputChange('password')}
          placeholder="Enter your password"
          type={showPassword ? 'text' : 'password'}
          error={formData.errors.password}
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

        <FormInput
          label="Confirm Password"
          value={formData.confirmPassword}
          onChange={handleInputChange('confirmPassword')}
          placeholder="Confirm your password"
          type={showConfirmPassword ? 'text' : 'password'}
          error={formData.errors.confirmPassword}
          rightElement={
            <IconButton
              aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
              icon={showConfirmPassword ? <ViewOffIcon /> : <ViewIcon />}
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              variant="ghost"
              size="sm"
              color="text.tertiary"
            />
          }
        />

        <FormControl isInvalid={!!formData.errors.securityQuestionId}>
          <Box position="relative">
            <Select
              options={securityQuestionOptions}
              value={formData.securityQuestionId || null}
              onChange={(value) => {
                const syntheticEvent = {
                  target: {
                    name: 'securityQuestionId',
                    value: value
                  }
                } as React.ChangeEvent<HTMLSelectElement>;

                handleSecurityQuestionChange(syntheticEvent);
              }}
              label="Security Question"
              placeholder="Select a security question"
              error={formData.errors.securityQuestionId}
              name="securityQuestionId"
              sizeOverride={48}
            />
          </Box>
          {formData.errors.securityQuestionId && (
            <FormErrorMessage color="error">{formData.errors.securityQuestionId}</FormErrorMessage>
          )}
        </FormControl>

        <FormInput
          label="Security Answer"
          value={formData.securityAnswer}
          onChange={handleInputChange('securityAnswer')}
          placeholder="Enter your answer"
          error={formData.errors.securityAnswer}
        />
      </SimpleGrid >
    </>
  );
};

export default SecurityInfoSection;
