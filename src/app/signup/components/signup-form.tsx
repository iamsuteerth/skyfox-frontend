'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
import { processDefaultAvatar, processImageForUpload } from '@/utils/image-utils';
import { getSecurityQuestions, SecurityQuestion } from '@/services/security-question-service';
import { signupUser } from '@/services/signup-service';

import { useCustomToast } from '@/app/components/ui/custom-toast';

import PersonalInfoSection from './personal-info';
import SecurityInfoSection from './security-info';
import ProfileImageSection from './profile-image-selection';
import CaptchaSection from './captcha-section';
import { APP_ROUTES } from '@/constants';

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
  const [showSecurityAnswer, setShowSecurityAnswer] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessingImage, setIsProcessingImage] = useState(false);

  const [firstNumber, setFirstNumber] = useState(0);
  const [secondNumber, setSecondNumber] = useState(0);
  const [captchaSum, setCaptchaSum] = useState(0);

  const { showToast } = useCustomToast();
  const router = useRouter()

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
    generateCaptcha();
  }, [])

  useEffect(() => {
    const requiredFields = ['fullName', 'username', 'email', 'phoneNumber', 'password', 'confirmPassword', 'securityQuestionId', 'securityAnswer', 'imageType', 'captchaAnswer'];
    const basicFieldsValid = isFormComplete(formData, requiredFields);
    const imageValid = Boolean(
      (formData.imageType === 'default' && formData.selectedImageId) ||
      (formData.imageType === 'custom' && formData.customImage)
    );
    setIsFormValid(basicFieldsValid && imageValid);
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
      e.key === ' ' ||
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

  const handleImageTypeChange = (value: 'default' | 'custom') => {
    setFormData(prev => ({
      ...prev,
      imageType: value,
      selectedImageId: undefined,
      customImage: undefined,
      processedImage: undefined,
      errors: {
        ...prev.errors,
        selectedImageId: '',
        imageType: ''
      }
    }));
  };

  const handleDefaultImageSelect = async (imageId: number) => {
    try {
      setIsProcessingImage(true);

      const processedImage = await processDefaultAvatar(imageId);

      setFormData(prev => ({
        ...prev,
        selectedImageId: imageId,
        customImage: undefined,
        processedImage,
        errors: {
          ...prev.errors,
          selectedImageId: ''
        }
      }));
    } catch (error: any) {
      showToast({
        type: 'error',
        title: 'Image Processing Error',
        description: error.message,
      });
    } finally {
      setIsProcessingImage(false);
    }
  };

  const handleCustomImageUpload = async (file: File) => {
    try {
      setIsProcessingImage(true);
      if (file.size > 5 * 1024 * 1024) {
        throw new Error('Image size should be less than 5MB');
      }
      const processedImage = await processImageForUpload(file);
      setFormData(prev => ({
        ...prev,
        customImage: file,
        selectedImageId: undefined,
        processedImage,
        errors: {
          ...prev.errors,
          selectedImageId: ''
        }
      }));
    } catch (error: any) {
      showToast({
        type: 'error',
        title: 'Image Processing Error',
        description: error.message,
      });
    } finally {
      setIsProcessingImage(false);
    }
  };

  const generateCaptcha = () => {
    const num1 = Math.floor(Math.random() * 16) + 5;
    const num2 = Math.floor(Math.random() * 16) + 5;
    setFirstNumber(num1);
    setSecondNumber(num2);
    setCaptchaSum(num1 + num2);
  };

  const verifyCaptcha = (userAnswer: string) => {
    return parseInt(userAnswer, 10) === captchaSum;
  };

  const regenerateCaptcha = () => {
    generateCaptcha();
    setFormData(prev => ({
      ...prev,
      captchaAnswer: '',
      errors: {
        ...prev.errors,
        captchaAnswer: ''
      }
    }));
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
      errors.securityAnswer = "Security answer must be at least 3 characters";
    }

    if (formData.imageType === 'default' && !formData.selectedImageId) {
      errors.selectedImageId = "Please select a default avatar";
    } else if (formData.imageType === 'custom' && !formData.customImage) {
      errors.selectedImageId = "Please upload a custom image";
    }

    if (!formData.captchaAnswer) {
      errors.captchaAnswer = "Please solve the captcha";
    } else if (!verifyCaptcha(formData.captchaAnswer)) {
      errors.captchaAnswer = "Incorrect answer, please try again";
    }

    setFormData(prev => ({ ...prev, errors }));

    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        setIsLoading(true);

        const apiData = {
          name: formData.fullName,
          username: formData.username,
          password: formData.password,
          number: formData.phoneNumber,
          email: formData.email,
          profile_img: formData.processedImage?.base64 || '',
          profile_img_sha: formData.processedImage?.hash || '',
          security_question_id: formData.securityQuestionId,
          security_answer: formData.securityAnswer
        };
        const response = await signupUser(apiData, showToast);

        if (response.success) {
          router.push(APP_ROUTES.LOGIN);
        }
      } catch (error: any) {
        console.error('Signup error:', error);
      } finally {
        setIsLoading(false);
      }
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
          showSecurityAnswer={showSecurityAnswer}
          setShowSecurityAnswer={setShowSecurityAnswer}
        />

        <ProfileImageSection
          formData={formData}
          handleImageTypeChange={handleImageTypeChange}
          handleDefaultImageSelect={handleDefaultImageSelect}
          handleCustomImageUpload={handleCustomImageUpload}
          isProcessingImage={isProcessingImage}
        />

        <CaptchaSection
          formData={formData}
          handleInputChange={handleInputChange}
          regenerateCaptcha={regenerateCaptcha}
          firstNumber={firstNumber}
          secondNumber={secondNumber}
        />

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
