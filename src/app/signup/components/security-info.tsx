// src/app/signup/components/security-info-section.tsx
'use client';

import React, { useState } from 'react';
import { 
  SimpleGrid, 
  Heading, 
  FormControl, 
  FormLabel, 
  FormErrorMessage,
  Box,
  Select,
  IconButton,
  useDisclosure
} from '@chakra-ui/react';
import {ChevronDownIcon, ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import FormInput from '@/app/components/form-input';
import { SecurityQuestion } from '@/services/security-question-service';

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
          <FormLabel fontWeight="medium" color="text.primary">Security Question</FormLabel>
          <Box position="relative">
            <Select
              size="md"
              value={formData.securityQuestionId}
              onChange={handleSelectChange}
              onFocus={onSelectOpen}
              onBlur={onSelectClose}
              disabled={securityQuestions.length === 0}
              bg="background.secondary"
              color="text.primary"
              borderColor="gray.200"
              borderRadius="xl"
              height="56px"
              _focus={{
                borderColor: 'primary',
                boxShadow: '0 0 0 1px #E04B00',
              }}
              _hover={{
                borderColor: 'primary',
              }}
              icon={<ChevronDownIcon color="primary" />}
              iconSize="20px"
              sx={{
                appearance: 'none',
                WebkitAppearance: 'none',
                MozAppearance: 'none',
                paddingRight: '2.5rem',
                '& option': {
                  background: 'var(--chakra-colors-background-secondary)',
                  color: 'var(--chakra-colors-text-primary)',
                  padding: '10px',
                  fontSize: '16px',
                },
                '&::-ms-expand': {
                  display: 'none',
                },
                '&:focus': {
                  outline: 'none',
                },
              }}
            >
              <option value={0} disabled>Select a security question</option>
              {securityQuestions?.map(q => (
                <option key={q.id} value={q.id}>
                  {q.question}
                </option>
              ))}
            </Select>
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
      </SimpleGrid>
    </>
  );
};

export default SecurityInfoSection;
