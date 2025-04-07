import React, { useState } from 'react';
import { VStack, Button } from '@chakra-ui/react';

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted', formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <VStack spacing={4} align="stretch">
        <Button
          type="submit"
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
          Signup
        </Button>
      </VStack>
    </form>
  );
};

export default SignupForm;