// src/app/signup/components/personal-info-section.tsx
'use client';

import React from 'react';
import { SimpleGrid, Heading } from '@chakra-ui/react';
import FormInput from '@/app/components/form-input';

interface PersonalInfoSectionProps {
  formData: {
    fullName: string;
    username: string;
    email: string;
    phoneNumber: string;
    errors: {
      [key: string]: string;
    };
  };
  handleInputChange: (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleNameKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  handlePhoneKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

const PersonalInfoSection: React.FC<PersonalInfoSectionProps> = ({
  formData,
  handleInputChange,
  handleNameKeyDown,
  handlePhoneKeyDown,
}) => {
  return (
    <>
      <Heading as="h2" size="md" color="text.primary">Personal Information</Heading>
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
        <FormInput
          label="Full Name"
          value={formData.fullName}
          onChange={handleInputChange('fullName')}
          onKeyDown={handleNameKeyDown}
          placeholder="Enter your full name"
          error={formData.errors.fullName}
        />
        <FormInput
          label="Username"
          value={formData.username}
          onChange={handleInputChange('username')}
          placeholder="Choose a username"
          error={formData.errors.username}
        />
        <FormInput
          label="Email"
          value={formData.email}
          onChange={handleInputChange('email')}
          placeholder="Enter your email"
          type="email"
          error={formData.errors.email}
        />
        <FormInput
          label="Phone Number"
          value={formData.phoneNumber}
          onChange={handleInputChange('phoneNumber')}
          onKeyDown={handlePhoneKeyDown}
          placeholder="Enter your phone number"
          type="tel"
          error={formData.errors.phoneNumber}
        />
      </SimpleGrid>
    </>
  );
};

export default PersonalInfoSection;
