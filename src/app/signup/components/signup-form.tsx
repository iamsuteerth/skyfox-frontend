// src/app/signup/components/signup-form.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { VStack, Button, Box, Center, Spinner } from '@chakra-ui/react';
import {
  validateName,
  validateUsername,
  validateEmail,
  validatePhone,
  validatePassword,
  validateConfirmPassword,
  isFormComplete
} from '@/utils/validators';

import PersonalInfoSection from './personal-info';
import SecurityInfoSection from './security-info';
import { getSecurityQuestions, SecurityQuestion } from '@/services/security-question-service';
import { useCustomToast } from '@/app/components/ui/custom-toast';

interface SignupFormState {
  fullName: string;
  username: string;
  email: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
  securityQuestionId: number;
  securityAnswer: string;
  imageType: 'default' | 'custom';
  selectedImageId?: number;
  customImage?: File;
  processedImage?: {
    base64: string;
    hash: string;
  };
  captchaAnswer: string;
  errors: {
    [key: string]: string;
  };
}

const SignupForm: React.FC = () => {
  const [formData, setFormData] = useState<SignupFormState>({
    fullName: '',
    username: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    securityQuestionId: 0,
    securityAnswer: '',
    imageType: 'default',
    captchaAnswer: '',
    errors: {},
  });

  const [securityQuestions, setSecurityQuestions] = useState<SecurityQuestion[]>([]);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const { showToast } = useCustomToast();

  useEffect(() => {
    const fetchSecurityQuestions = async () => {
      try {
        setIsLoading(true);
        const questions = await getSecurityQuestions();
        setSecurityQuestions(questions);
      } catch (error: any) {
        showToast({
          type: 'error',
          title: 'Error fetching security questions',
          description: error.message,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchSecurityQuestions();
  }, [showToast]);

  useEffect(() => {
    const requiredFields = ['fullName', 'username', 'email', 'phoneNumber', 'password', 'confirmPassword', 'securityQuestionId', 'securityAnswer'];
    setIsFormValid(isFormComplete(formData, requiredFields));
  }, [formData]);

  const handleInputChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value,
      errors: {
        ...prev.errors,
        [field]: ''
      }
    }));
  };

  const handleSecurityQuestionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      securityQuestionId: parseInt(e.target.value),
      errors: {
        ...prev.errors,
        securityQuestionId: ''
      }
    }));
  };

  const handleNameKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (
      e.key === 'Backspace' ||
      e.key === 'Delete' ||
      e.key === 'ArrowLeft' ||
      e.key === 'ArrowRight' ||
      e.key === 'Tab' ||
      e.key === 'Enter' ||
      e.key === ' ' || // Allow space
      e.metaKey
    ) {
      return;
    }
    if (!/^[a-zA-Z]$/.test(e.key)) {
      e.preventDefault();
    }
  };

  const handlePhoneKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (
      e.key === 'Backspace' ||
      e.key === 'Delete' ||
      e.key === 'ArrowLeft' ||
      e.key === 'ArrowRight' ||
      e.key === 'Tab' ||
      e.key === 'Enter' ||
      e.metaKey
    ) {
      return;
    }
    if (!/^\d$/.test(e.key)) {
      e.preventDefault();
    }
  };

  const validateForm = (): boolean => {
    const errors: { [key: string]: string } = {};

    const nameError = validateName(formData.fullName);
    if (nameError) errors.fullName = nameError;

    const usernameError = validateUsername(formData.username);
    if (usernameError) errors.username = usernameError;

    const emailError = validateEmail(formData.email);
    if (emailError) errors.email = emailError;

    const phoneError = validatePhone(formData.phoneNumber);
    if (phoneError) errors.phoneNumber = phoneError;

    const passwordError = validatePassword(formData.password);
    if (passwordError) errors.password = passwordError;

    const confirmPasswordError = validateConfirmPassword(formData.password, formData.confirmPassword);
    if (confirmPasswordError) errors.confirmPassword = confirmPasswordError;

    if (formData.securityQuestionId === 0) {
      errors.securityQuestionId = "Please select a security question";
    }

    if (!formData.securityAnswer) {
      errors.securityAnswer = "Security answer is required";
    } else if (formData.securityAnswer.length < 3) {
      console.log(`BOOYAH${formData.securityAnswer}`)
      errors.securityAnswer = "Security answer must be at least 3 characters";
    }

    setFormData(prev => ({ ...prev, errors }));

    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      const formPayload = {
        fullName: formData.fullName,
        username: formData.username,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        password: formData.password,
        securityQuestionId: formData.securityQuestionId,
        securityAnswer: formData.securityAnswer,
        imageType: formData.imageType,
        selectedImageId: formData.selectedImageId,
        processedImage: formData.processedImage,
        captchaAnswer: formData.captchaAnswer
      };

      console.log('Form submitted with data:', formPayload);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {isLoading ? <Center><Spinner color="primary" size="md" /></Center> : <VStack spacing={6} align="stretch">
        <PersonalInfoSection
          formData={formData}
          handleInputChange={handleInputChange}
          handleNameKeyDown={handleNameKeyDown}
          handlePhoneKeyDown={handlePhoneKeyDown}
        />

        <SecurityInfoSection
          formData={formData}
          securityQuestions={securityQuestions}
          handleInputChange={handleInputChange}
          handleSecurityQuestionChange={handleSecurityQuestionChange}
          showPassword={showPassword}
          showConfirmPassword={showConfirmPassword}
          setShowPassword={setShowPassword}
          setShowConfirmPassword={setShowConfirmPassword}
        />

        {/* ProfileImageSection and CaptchaSection later */}

        <Box mt={6}>
          <Button
            type="submit"
            w="100%"
            size="lg"
            height="56px"
            borderRadius="xl"
            bg="primary"
            color="white"
            _hover={{
              bg: "#CC4300",
            }}
            _active={{
              bg: "#B03B00",
            }}
            isDisabled={!isFormValid}
          >
            Signup
          </Button>
        </Box>
      </VStack>}
    </form>
  );
};

export default SignupForm;
