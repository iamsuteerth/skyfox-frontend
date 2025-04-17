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
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  useBreakpointValue,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  Text,
  Box,
  Divider,
} from '@chakra-ui/react';
import { useDialog } from '@/contexts/dialog-context';
import { useCustomToast } from '@/app/components/ui/custom-toast';
import { useAuth } from '@/contexts/auth-context';
import ProfileImageSection from '@/app/signup/components/profile-image-selection';

const UpdateProfileImageDialog: React.FC = () => {
  const { closeDialog } = useDialog();
  const { user } = useAuth();
  const { showToast } = useCustomToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isProcessingImage, setIsProcessingImage] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const modalSize = useBreakpointValue({
    base: 'xs',
    sm: 'md',
    md: '3xl'
  });

  // Form state for image selection
  const [imageForm, setImageForm] = useState({
    imageType: 'default' as 'default' | 'custom',
    selectedImageId: undefined as number | undefined,
    customImage: undefined as File | undefined,
    imageChanged: false,
    errors: {
      imageType: '',
      selectedImageId: '',
    },
  });

  // Form state for security verification
  const [securityAnswer, setSecurityAnswer] = useState('');
  const [securityQuestion, setSecurityQuestion] = useState('What was the name of your first pet?'); // Placeholder
  const [securityError, setSecurityError] = useState('');

  // Initialize with current user image if available
  useEffect(() => {
    // This is a placeholder implementation
    // In actual implementation, we would determine if user has a default avatar or custom image
    // and set the appropriate values
    
    // For now, let's assume user has default avatar with ID 1
    setImageForm({
      ...imageForm,
      imageType: 'default',
      selectedImageId: 1,
      imageChanged: false,
      errors: {
        imageType: '',
        selectedImageId: '',
      },
    });
  }, []);

  const handleImageTypeChange = (value: 'default' | 'custom') => {
    setImageForm({
      ...imageForm,
      imageType: value,
      errors: {
        ...imageForm.errors,
        imageType: '',
      },
    });
  };

  const handleDefaultImageSelect = (imageId: number) => {
    setImageForm({
      ...imageForm,
      selectedImageId: imageId,
      customImage: undefined,
      imageChanged: true,
      errors: {
        ...imageForm.errors,
        selectedImageId: '',
      },
    });
  };

  const handleCustomImageUpload = (file: File) => {
    setIsProcessingImage(true);
    
    // Simulate image processing
    setTimeout(() => {
      setImageForm({
        ...imageForm,
        customImage: file,
        selectedImageId: undefined,
        imageChanged: true,
        errors: {
          ...imageForm.errors,
          selectedImageId: '',
        },
      });
      setIsProcessingImage(false);
    }, 1000);
  };

  const validateImageStep = () => {
    const errors = {
      imageType: '',
      selectedImageId: '',
    };
    
    let isValid = true;
    
    if (!imageForm.imageChanged) {
      errors.selectedImageId = 'Please select a new profile image or upload a custom one';
      isValid = false;
    } else if (imageForm.imageType === 'default' && !imageForm.selectedImageId) {
      errors.selectedImageId = 'Please select a default avatar';
      isValid = false;
    } else if (imageForm.imageType === 'custom' && !imageForm.customImage) {
      errors.selectedImageId = 'Please upload a custom image';
      isValid = false;
    }
    
    setImageForm({
      ...imageForm,
      errors,
    });
    
    return isValid;
  };

  const validateSecurityStep = () => {
    if (!securityAnswer.trim()) {
      setSecurityError('Security answer is required');
      return false;
    }
    
    setSecurityError('');
    return true;
  };

  const handleNext = () => {
    if (currentStep === 0 && validateImageStep()) {
      setCurrentStep(1);
    }
  };

  const handleBack = () => {
    setCurrentStep(0);
  };

  const handleSubmit = async () => {
    if (currentStep === 0) {
      handleNext();
      return;
    }
    
    if (!validateSecurityStep()) return;
    
    try {
      setIsSubmitting(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      showToast({
        type: 'success',
        title: 'Profile Image Updated',
        description: 'Your profile image has been updated successfully',
      });
      
      // Here we would trigger a refresh of the profile image
      // This will be implemented later
      
      closeDialog();
    } catch (error) {
      console.error("Error updating profile image:", error);
      showToast({
        type: 'error',
        title: 'Error',
        description: 'Failed to update profile image',
      });
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
                <ProfileImageSection
                  formData={{
                    imageType: imageForm.imageType,
                    selectedImageId: imageForm.selectedImageId,
                    customImage: imageForm.customImage,
                    errors: imageForm.errors,
                  }}
                  handleImageTypeChange={handleImageTypeChange}
                  handleDefaultImageSelect={handleDefaultImageSelect}
                  handleCustomImageUpload={handleCustomImageUpload}
                  isProcessingImage={isProcessingImage}
                />
                
                {!imageForm.imageChanged && (
                  <Text color="blue.500" fontSize="sm" mt={2}>
                    Note: You need to select a new image or upload a custom one to proceed.
                  </Text>
                )}
              </TabPanel>

              <TabPanel px={0}>
                <Box>
                  <Box
                    p={4}
                    borderRadius="md"
                    bg="background.secondary"
                    borderWidth="1px"
                    borderColor="surface.light"
                    mb={4}
                  >
                    <Text fontWeight="medium" color="text.primary" mb={1}>Security Question</Text>
                    <Text color="text.secondary">{securityQuestion}</Text>
                  </Box>

                  <FormControl isInvalid={!!securityError} mb={4}>
                    <FormLabel color="text.primary">Your Answer</FormLabel>
                    <Input
                      type="password"
                      value={securityAnswer}
                      onChange={(e) => setSecurityAnswer(e.target.value)}
                      placeholder="Enter your answer"
                      bg="background.secondary"
                      borderColor="surface.light"
                      _hover={{ borderColor: "surface.medium" }}
                      _focus={{ 
                        borderColor: "primary", 
                        boxShadow: "0 0 0 1px var(--chakra-colors-primary)" 
                      }}
                    />
                    {securityError && (
                      <FormErrorMessage>{securityError}</FormErrorMessage>
                    )}
                  </FormControl>

                  <Text fontSize="sm" color="text.tertiary">
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
