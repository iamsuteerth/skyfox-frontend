'use client';

import React, { useState, useEffect } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  VStack,
  Divider,
  useBreakpointValue,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Text,
  Box,
} from '@chakra-ui/react';
import { useDialog } from '@/contexts/dialog-context';
import { useCustomToast } from '@/app/components/ui/custom-toast';
import FormInput from '@/app/components/form-input';
import { validateName, validateEmail, validatePhone } from '@/utils/validators';
import { updateCustomerProfile } from '@/services/profile-service';
import { getSecurityQuestionByEmail } from '@/services/security-question-service';

const UpdateProfileDialog: React.FC = () => {
  const { dialogData, closeDialog } = useDialog();
  const { showToast } = useCustomToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [securityQuestion, setSecurityQuestion] = useState<string | null>(null);
  
  const modalSize = useBreakpointValue({
    base: 'xs',
    sm: 'md',
    md: 'lg'
  });

  const customerData = dialogData || {
    name: '',
    email: '',
    phone_number: '',
    security_question_exists: false
  };

  const [formState, setFormState] = useState({
    name: customerData.name || '',
    email: customerData.email || '',
    phone_number: customerData.phone_number || '',
    security_answer: '',
    errors: {
      name: '',
      email: '',
      phone_number: '',
      security_answer: '',
    },
    touched: {
      name: false,
      email: false,
      phone_number: false,
    }
  });

  useEffect(() => {
    if (dialogData) {
      setFormState(prev => ({
        ...prev,
        name: dialogData.name || '',
        email: dialogData.email || '',
        phone_number: dialogData.phone_number || '',
      }));
    }
  }, [dialogData]);

  const [originalValues] = useState({
    name: customerData.name || '',
    email: customerData.email || '',
    phone_number: customerData.phone_number || '',
  });

  const hasChanges =
    formState.name !== originalValues.name ||
    formState.email !== originalValues.email ||
    formState.phone_number !== originalValues.phone_number;

  const handleInputChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    let error = '';
    if (field === 'name') {
      error = validateName(value) || '';
    } else if (field === 'email') {
      error = validateEmail(value) || '';
    } else if (field === 'phone_number') {
      error = validatePhone(value) || '';
    }

    setFormState(prev => ({
      ...prev,
      [field]: value,
      errors: {
        ...prev.errors,
        [field]: error
      },
      touched: {
        ...prev.touched,
        [field]: true
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

  const validatePersonalInfo = () => {
    const errors = {
      name: validateName(formState.name) || '',
      email: validateEmail(formState.email) || '',
      phone_number: validatePhone(formState.phone_number) || '',
    };

    setFormState(prev => ({
      ...prev,
      errors: {
        ...prev.errors,
        ...errors
      }
    }));

    return !Object.values(errors).some(error => error !== '');
  };

  const validateSecurityAnswer = () => {
    const error = !formState.security_answer.trim()
      ? 'Security answer is required'
      : '';

    setFormState(prev => ({
      ...prev,
      errors: {
        ...prev.errors,
        security_answer: error
      }
    }));

    return error === '';
  };

  const handleNext = async () => {
    if (currentStep === 0 && validatePersonalInfo()) {
      const securityQuestionFetched = await fetchSecurityQuestion();
      if (securityQuestionFetched) {
        setCurrentStep(1);
      }
    }
  };

  const handleBack = () => {
    setCurrentStep(0);
  };

  const fetchSecurityQuestion = async () => {
    try {
      const email = customerData.email;
      
      if (!email) {
        showToast({
          type: 'error',
          title: 'Error',
          description: 'Email address is missing. Cannot fetch security question.',
        });
        closeDialog();
        return false;
      }
      
      const response = await getSecurityQuestionByEmail(email);
      
      if (response && response.status === 'SUCCESS' && response.data && response.data.question) {
        setSecurityQuestion(response.data.question);
        return true;
      } else {
        throw new Error('Security question not found in the response');
      }
    } catch (error: any) {
      console.error('Failed to fetch security question:', error);
      showToast({
        type: 'error',
        title: 'Security Question Error',
        description: error.message || 'Failed to fetch your security question. Please try again later.',
      });
      closeDialog();
      return false;
    }
  };

  const handleSubmit = async () => {
    if (currentStep === 0) {
      handleNext();
      return;
    }

    if (!validateSecurityAnswer()) return;

    try {
      setIsSubmitting(true);

      const updateData = {
        name: formState.name,
        email: formState.email,
        phone_number: formState.phone_number,
        security_answer: formState.security_answer
      };

      const result = await updateCustomerProfile(updateData, showToast);

      if (result.success) {
        if (dialogData.onSuccess && typeof dialogData.onSuccess === 'function') {
          dialogData.onSuccess();
        }
        closeDialog();
      } else {
        setCurrentStep(0);
      }
    } catch (error) {
      setCurrentStep(0);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={true}
      onClose={closeDialog}
      size={modalSize}
      isCentered
      motionPreset="slideInBottom"
    >
      <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(10px)" />
      <ModalContent
        bg="background.primary"
        borderColor="surface.light"
        borderWidth="1px"
        borderRadius="xl"
        mx={2}
      >
        <ModalHeader color="text.primary">Update Profile</ModalHeader>
        <ModalCloseButton color="text.tertiary" />
        <Divider borderColor="surface.light" />

        <ModalBody py={6}>
          <Tabs index={currentStep} variant="enclosed" colorScheme="primary" isFitted>
            <TabList mb={4}>
              <Tab
                _selected={{
                  color: 'primary',
                  borderColor: 'surface.light',
                  borderBottomColor: 'transparent',
                  bg: 'background.secondary'
                }}
                onClick={() => currentStep === 1 && handleBack()}
              >
                Personal Info
              </Tab>
              <Tab
                isDisabled={currentStep === 0}
                _selected={{
                  color: 'primary',
                  borderColor: 'surface.light',
                  borderBottomColor: 'transparent',
                  bg: 'background.secondary'
                }}
              >
                Security Verification
              </Tab>
            </TabList>

            <TabPanels>
              <TabPanel px={0}>
                <VStack spacing={4} align="stretch">
                  <FormInput
                    label="Full Name"
                    value={formState.name}
                    onChange={handleInputChange('name')}
                    onKeyDown={handleNameKeyDown}
                    placeholder="Enter your full name"
                    error={formState.errors.name}
                  />

                  <FormInput
                    label="Email"
                    value={formState.email}
                    onChange={handleInputChange('email')}
                    placeholder="Enter your email"
                    type="email"
                    error={formState.errors.email}
                  />

                  <FormInput
                    label="Phone Number"
                    value={formState.phone_number}
                    onChange={handleInputChange('phone_number')}
                    onKeyDown={handlePhoneKeyDown}
                    placeholder="Enter your phone number"
                    type="tel"
                    error={formState.errors.phone_number}
                  />

                  {!hasChanges && (
                    <Text color="blue.500" fontSize="sm" mt={2}>
                      You need to change at least one field to update your profile.
                    </Text>
                  )}
                </VStack>
              </TabPanel>

              <TabPanel px={0}>
                <Box>
                  <Box
                    p={4}
                    borderRadius="md"
                    bg="background.secondary"
                    borderColor="surface.light"
                    borderWidth="1px"
                    mb={4}
                  >
                    <Text fontWeight="medium" color="text.primary" mb={1}>Security Question</Text>
                    <Text color="text.secondary">{securityQuestion || 'Loading security question...'}</Text>
                  </Box>

                  <FormInput
                    label="Your Answer"
                    value={formState.security_answer}
                    onChange={handleInputChange('security_answer')}
                    placeholder="Enter your security answer"
                    type="password"
                    error={formState.errors.security_answer}
                  />

                  <Text fontSize="sm" color="text.tertiary" mt={4}>
                    For security reasons, we need to confirm your identity before making changes to your profile.
                  </Text>
                </Box>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </ModalBody>

        <Divider borderColor="surface.light" />
        <ModalFooter>
          <Button
            variant="outline"
            mr={3}
            onClick={closeDialog}
            isDisabled={isSubmitting}
            borderColor="surface.light"
            color="text.primary"
            _hover={{ bg: 'rgba(224, 75, 0, 0.12)' }}
          >
            Cancel
          </Button>

          {currentStep === 0 ? (
            <Button
              bg="primary"
              color="white"
              _hover={{ bg: "#CC4300" }}
              _active={{ bg: "#B03B00" }}
              onClick={handleNext}
              isDisabled={!hasChanges || Object.values(formState.errors).some(e => e !== '')}
            >
              Next
            </Button>
          ) : (
            <>
              <Button
                variant="outline"
                mr={3}
                onClick={handleBack}
                isDisabled={isSubmitting}
                borderColor="surface.light"
                color="text.primary"
                _hover={{ bg: 'rgba(224, 75, 0, 0.12)' }}
              >
                Back
              </Button>
              <Button
                bg="primary"
                color="white"
                _hover={{ bg: "#CC4300" }}
                _active={{ bg: "#B03B00" }}
                onClick={handleSubmit}
                isLoading={isSubmitting}
                loadingText="Updating"
              >
                Update Profile
              </Button>
            </>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default UpdateProfileDialog;
