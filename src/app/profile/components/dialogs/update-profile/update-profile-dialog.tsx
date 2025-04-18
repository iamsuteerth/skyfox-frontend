'use client';

import React, { useReducer, useState, useCallback, useEffect } from 'react';
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
} from '@chakra-ui/react';

import { useDialog } from '@/contexts/dialog-context';
import { useCustomToast } from '@/app/components/ui/custom-toast';

import { updateCustomerProfile } from '@/services/profile-service';
import { getSecurityQuestionByEmail } from '@/services/security-question-service';
import { validateName, validateEmail, validatePhone } from '@/utils/validators';

import { profileFormReducer, createInitialState, ProfileFormState } from './profile-form-reducer';

import FormInput from '@/app/components/form-input';
import SecurityVerificationForm from '../shared/security-verification-tab';

const UpdateProfileDialog: React.FC = () => {
  const { dialogData, closeDialog } = useDialog();
  const { showToast } = useCustomToast();

  const customerData = dialogData || {
    name: '',
    email: '',
    phone_number: '',
    security_question_exists: false
  };

  const [formState, dispatch] = useReducer(
    profileFormReducer,
    customerData,
    createInitialState
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [securityQuestion, setSecurityQuestion] = useState<string | null>(null);

  const [originalValues] = useState({
    name: customerData.name || '',
    email: customerData.email || '',
    phone_number: customerData.phone_number || '',
  });

  const hasChanges =
    formState.name !== originalValues.name ||
    formState.email !== originalValues.email ||
    formState.phone_number !== originalValues.phone_number;

  const modalSize = useBreakpointValue({
    base: 'xs',
    sm: 'md',
    md: 'lg'
  });

  useEffect(() => {
    if (dialogData) {
      dispatch({
        type: 'RESET_FORM',
        payload: createInitialState(dialogData)
      });
    }
  }, [dialogData]);

  const handleInputChange = useCallback((field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    let error = '';

    if (field === 'name') {
      error = validateName(value) || '';
    } else if (field === 'email') {
      error = validateEmail(value) || '';
    } else if (field === 'phone_number') {
      error = validatePhone(value) || '';
    }

    dispatch({
      type: 'SET_FIELD',
      payload: { field, value, error }
    });
  }, []);

  const handleNameKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
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
  }, []);

  const handlePhoneKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
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
  }, []);

  const handleSecurityAnswerChange = useCallback((value: string) => {
    dispatch({
      type: 'SET_FIELD',
      payload: { field: 'security_answer', value }
    });
  }, []);

  const validatePersonalInfo = useCallback(() => {
    const errors = {
      name: validateName(formState.name) || '',
      email: validateEmail(formState.email) || '',
      phone_number: validatePhone(formState.phone_number) || '',
    };

    let isValid = true;
    Object.entries(errors).forEach(([field, error]) => {
      if (error) {
        dispatch({
          type: 'SET_ERROR',
          payload: { field: field as keyof ProfileFormState['errors'], message: error }
        });
        isValid = false;
      }
    });

    return isValid;
  }, [formState.name, formState.email, formState.phone_number]);

  const validateSecurityAnswer = useCallback(() => {
    if (!formState.security_answer.trim()) {
      dispatch({
        type: 'SET_ERROR',
        payload: { field: 'security_answer', message: 'Security answer is required' }
      });
      return false;
    }

    dispatch({
      type: 'SET_ERROR',
      payload: { field: 'security_answer', message: '' }
    });
    return true;
  }, [formState.security_answer]);

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
      showToast({
        type: 'error',
        title: 'Security Question Error',
        description: error.message || 'Failed to fetch your security question. Please try again later.',
      });
      closeDialog();
      return false;
    }
  };

  const handleNext = async () => {
    if (currentStep === 0 && validatePersonalInfo()) {
      const securityQuestionFetched = await fetchSecurityQuestion();
      if (securityQuestionFetched) {
        setCurrentStep(1);
      }
    }
  };

  const handleBack = useCallback(() => {
    setCurrentStep(0);
  }, []);

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
      console.error("Error updating profile:", error);
      setCurrentStep(0);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={true} onClose={closeDialog} size={modalSize} isCentered motionPreset="slideInBottom" >
      <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(10px)" />
      <ModalContent bg="background.primary" borderColor="surface.light" borderWidth="1px" borderRadius="xl" mx={2} >
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
                <SecurityVerificationForm
                  securityQuestion={securityQuestion}
                  securityAnswer={formState.security_answer}
                  securityError={formState.errors.security_answer}
                  onChange={handleSecurityAnswerChange}
                />
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
                Confirm
              </Button>
            </>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default UpdateProfileDialog;
