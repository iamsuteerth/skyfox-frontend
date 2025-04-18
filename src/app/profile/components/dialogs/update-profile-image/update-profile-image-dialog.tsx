'use client';

import React, { useReducer, useState, useCallback } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Divider,
  useBreakpointValue,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from '@chakra-ui/react';

import { useDialog } from '@/contexts/dialog-context';
import { useCustomToast } from '@/app/components/ui/custom-toast';

import { getSecurityQuestionByEmail } from '@/services/security-question-service';
import { updateProfileImage } from '@/services/profile-service';
import { processDefaultAvatar, processImageForUpload } from '@/utils/image-utils';

import { imageFormReducer, initialImageFormState } from './image-form-reducer';
import { profileImageRefresher } from '@/app/components/profile-image';

import SecurityVerificationForm from '../shared/security-verification-tab';
import ImageSelectionForm from './image-selection-form';

const UpdateProfileImageDialog: React.FC = () => {
  const { dialogData, closeDialog } = useDialog();
  const { showToast } = useCustomToast();
  
  const [imageForm, dispatch] = useReducer(imageFormReducer, initialImageFormState);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isProcessingImage, setIsProcessingImage] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [securityQuestion, setSecurityQuestion] = useState<string | null>(null);
  const [securityAnswer, setSecurityAnswer] = useState('');
  const [securityError, setSecurityError] = useState('');
  const [processedImage, setProcessedImage] = useState<{ base64: string; hash: string } | null>(null);
  
  const modalSize = useBreakpointValue({
    base: 'xs',
    sm: 'md',
    md: 'lg'
  });

  const handleImageTypeChange = useCallback((value: 'default' | 'custom') => {
    dispatch({ type: 'SET_IMAGE_TYPE', payload: value });
  }, []);

  const handleDefaultImageSelect = useCallback((imageId: number) => {
    dispatch({ type: 'SELECT_DEFAULT_IMAGE', payload: imageId });
  }, []);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      if (file.size > 5 * 1024 * 1024) {
        dispatch({ 
          type: 'SET_ERROR', 
          payload: { 
            field: 'selectedImageId', 
            message: 'Image size must be less than 5MB' 
          } 
        });
        return;
      }

      const previewUrl = URL.createObjectURL(file);
      dispatch({ 
        type: 'SET_CUSTOM_IMAGE', 
        payload: { file, previewUrl } 
      });
    }
  }, []);

  const processSelectedImage = async () => {
    try {
      setIsProcessingImage(true);
      
      if (imageForm.imageType === 'default' && imageForm.selectedImageId) {
        const processed = await processDefaultAvatar(imageForm.selectedImageId);
        setProcessedImage(processed);
        return true;
      } else if (imageForm.imageType === 'custom' && imageForm.customImage) {
        const processed = await processImageForUpload(imageForm.customImage);
        setProcessedImage(processed);
        return true;
      }
      
      dispatch({ 
        type: 'SET_ERROR', 
        payload: { 
          field: 'selectedImageId', 
          message: 'Please select an image first' 
        } 
      });
      return false;
    } catch (error) {
      console.error('Error processing image:', error);
      showToast({
        type: 'error',
        title: 'Image Processing Error',
        description: 'Failed to process the selected image.',
      });
      return false;
    } finally {
      setIsProcessingImage(false);
    }
  };

  const validateImageStep = () => {
    if (!imageForm.imageChanged) {
      dispatch({ 
        type: 'SET_ERROR', 
        payload: { 
          field: 'selectedImageId', 
          message: 'Please select a new profile image or upload a custom one' 
        } 
      });
      return false;
    }
    
    if (imageForm.imageType === 'default' && !imageForm.selectedImageId) {
      dispatch({ 
        type: 'SET_ERROR', 
        payload: { 
          field: 'selectedImageId', 
          message: 'Please select a default avatar' 
        } 
      });
      return false;
    }
    
    if (imageForm.imageType === 'custom' && !imageForm.customImage) {
      dispatch({ 
        type: 'SET_ERROR', 
        payload: { 
          field: 'selectedImageId', 
          message: 'Please upload a custom image' 
        } 
      });
      return false;
    }
    
    return true;
  };
  
  const fetchSecurityQuestion = async () => {
    try {
      const email = dialogData?.email;
      
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
      
      if (response?.status === 'SUCCESS' && response.data?.question) {
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

  const handleNext = async () => {
    if (currentStep === 0 && validateImageStep()) {
      const imageProcessed = await processSelectedImage();
      
      if (!imageProcessed) {
        return;
      }
      
      const securityQuestionFetched = await fetchSecurityQuestion();
      if (securityQuestionFetched) {
        setCurrentStep(1);
      }
    }
  };

  const handleBack = useCallback(() => {
    setCurrentStep(0);
    setSecurityAnswer('');
    setSecurityError('');
  }, []);

  const handleSecurityAnswerChange = useCallback((value: string) => {
    setSecurityAnswer(value);
    if (value.trim()) {
      setSecurityError('');
    }
  }, []);

  const validateSecurityAnswer = useCallback(() => {
    if (!securityAnswer.trim()) {
      setSecurityError('Security answer is required');
      return false;
    }
    
    setSecurityError('');
    return true;
  }, [securityAnswer]);

  const handleSubmit = async () => {
    if (currentStep === 0) {
      handleNext();
      return;
    }
    
    if (!validateSecurityAnswer()) return;
    if (!processedImage) {
      showToast({
        type: 'error',
        title: 'Image Error',
        description: 'Image data is missing. Please try again.',
      });
      setCurrentStep(0);
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      const imageData = {
        security_answer: securityAnswer,
        profile_img: processedImage.base64,
        profile_img_sha: processedImage.hash
      };
      
      const result = await updateProfileImage(imageData, showToast);
      
      if (result.success) {
        profileImageRefresher.refreshProfileImage();
        
        if (dialogData?.onSuccess && typeof dialogData.onSuccess === 'function') {
          dialogData.onSuccess();
        }
        
        closeDialog();
      } else {
        setCurrentStep(0);
      }
    } catch (error) {
      console.error("Error updating profile image:", error);
      setCurrentStep(0);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={true} onClose={closeDialog} size={modalSize} isCentered motionPreset="slideInBottom" >
      <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(10px)" />
      <ModalContent bg="background.primary" borderColor="surface.light" borderWidth="1px" borderRadius="xl" mx={2} >
        <ModalHeader color="text.primary">Update Profile Image</ModalHeader>
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
                Select Image
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
                <ImageSelectionForm
                  formState={imageForm}
                  isProcessingImage={isProcessingImage}
                  onImageTypeChange={handleImageTypeChange}
                  onDefaultImageSelect={handleDefaultImageSelect}
                  onFileChange={handleFileChange}
                />
              </TabPanel>

              <TabPanel px={0}>
                <SecurityVerificationForm
                  securityQuestion={securityQuestion}
                  securityAnswer={securityAnswer}
                  securityError={securityError}
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
              isDisabled={!imageForm.imageChanged}
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

export default UpdateProfileImageDialog;
