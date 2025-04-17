'use client';

import React, { useState } from 'react';
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
  Radio,
  RadioGroup,
  SimpleGrid,
  Grid,
  AspectRatio,
  Image,
  Center,
  FormControl,
  FormLabel,
} from '@chakra-ui/react';
import { useDialog } from '@/contexts/dialog-context';
import { useCustomToast } from '@/app/components/ui/custom-toast';
import FormInput from '@/app/components/form-input';
import { getSecurityQuestionByEmail } from '@/services/security-question-service';
import { processDefaultAvatar, processImageForUpload } from '@/utils/image-utils';
import { updateProfileImage } from '@/services/profile-service';
import { profileImageRefresher } from '@/app/components/profile-image';
import { AddIcon } from '@chakra-ui/icons';

const DEFAULT_AVATARS = [1, 2, 3, 4, 5, 6].map(id => ({
  id,
  src: `/default_avatars/default_${id}.jpg`
}));

const UpdateProfileImageDialog: React.FC = () => {
  const { dialogData, closeDialog } = useDialog();
  const { showToast } = useCustomToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isProcessingImage, setIsProcessingImage] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [securityQuestion, setSecurityQuestion] = useState<string | null>(null);
  const modalSize = useBreakpointValue({
    base: 'xs',
    sm: 'md',
    md: 'lg'
  });

  const [imageForm, setImageForm] = useState({
    imageType: 'default' as 'default' | 'custom',
    selectedImageId: undefined as number | undefined,
    customImage: undefined as File | undefined,
    imageChanged: false,
    previewUrl: null as string | null,
    errors: {
      imageType: '',
      selectedImageId: '',
    },
  });

  const [securityAnswer, setSecurityAnswer] = useState('');
  const [securityError, setSecurityError] = useState('');


  const [processedImage, setProcessedImage] = useState<{ base64: string; hash: string } | null>(null);

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
      previewUrl: `/default_avatars/default_${imageId}.jpg`,
      errors: {
        ...imageForm.errors,
        selectedImageId: '',
      },
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      if (file.size > 5 * 1024 * 1024) {
        setImageForm(prev => ({
          ...prev,
          errors: {
            ...prev.errors,
            selectedImageId: 'Image size must be less than 5MB'
          }
        }));
        return;
      }

      const previewUrl = URL.createObjectURL(file);
      
      setImageForm({
        ...imageForm,
        customImage: file,
        selectedImageId: undefined,
        imageChanged: true,
        previewUrl: previewUrl,
        errors: {
          ...imageForm.errors,
          selectedImageId: '',
        },
      });
    }
  };

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
      
      setImageForm(prev => ({
        ...prev,
        errors: {
          ...prev.errors,
          selectedImageId: 'Please select an image first'
        }
      }));
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

  const validateSecurityAnswer = () => {
    if (!securityAnswer.trim()) {
      setSecurityError('Security answer is required');
      return false;
    }
    
    setSecurityError('');
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

  const handleBack = () => {
    setCurrentStep(0);
    setSecurityAnswer('');
    setSecurityError('');
  };

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
        
        // Call the onSuccess callback if provided
        if (dialogData?.onSuccess && typeof dialogData.onSuccess === 'function') {
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
                <VStack spacing={5} align="stretch">
                  <FormControl isInvalid={!!imageForm.errors.imageType}>
                    <FormLabel fontWeight="medium" color="text.primary">Choose Image Source</FormLabel>
                    <RadioGroup
                      onChange={(value) => handleImageTypeChange(value as 'default' | 'custom')}
                      value={imageForm.imageType}
                    >
                      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                        <Radio value="default" colorScheme="brand" borderColor="primary" background="background.primary">
                          <Text fontWeight="medium" color="text.primary">Use Default Avatar</Text>
                        </Radio>
                        <Radio value="custom" colorScheme="brand" borderColor="primary" background="background.primary">
                          <Text fontWeight="medium" color="text.primary">Upload Your Photo</Text>
                        </Radio>
                      </SimpleGrid>
                    </RadioGroup>
                  </FormControl>

                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                    <Box>
                      <FormLabel fontWeight="medium" color="text.primary">Image Preview</FormLabel>
                      <Center
                        border="2px dashed"
                        borderColor={imageForm.errors.selectedImageId ? "error" : "gray.200"}
                        borderRadius="xl"
                        h="150px"
                        w="150px"
                        mx="auto"
                        bg="background.secondary"
                        overflow="hidden"
                        flexDirection="column"
                        textAlign="center"
                        padding={3}
                      >
                        {isProcessingImage ? (
                          <Text color="text.tertiary">Processing...</Text>
                        ) : imageForm.previewUrl ? (
                          <Image
                            src={imageForm.previewUrl}
                            alt="Profile preview"
                            objectFit="cover"
                            h="100%"
                            w="100%"
                          />
                        ) : (
                          <Text color="text.tertiary">
                            No image selected
                          </Text>
                        )}
                      </Center>
                      {imageForm.errors.selectedImageId && (
                        <Text color="error" fontSize="sm" textAlign="center" mt={2}>
                          {imageForm.errors.selectedImageId}
                        </Text>
                      )}
                    </Box>

                    <Box>
                      {imageForm.imageType === 'default' ? (
                        <Box>
                          <FormLabel fontWeight="medium" color="text.primary">Select Default Avatar</FormLabel>
                          <Grid
                            templateColumns="repeat(3, 1fr)"
                            gap={3}
                          >
                            {DEFAULT_AVATARS.map((avatar) => (
                              <AspectRatio ratio={1} key={avatar.id}>
                                <Box
                                  as="button"
                                  type="button"
                                  onClick={() => handleDefaultImageSelect(avatar.id)}
                                  border="2px solid"
                                  borderColor={imageForm.selectedImageId === avatar.id ? "primary" : "transparent"}
                                  borderRadius="md"
                                  overflow="hidden"
                                  transition="all 0.2s"
                                  _hover={{
                                    transform: "scale(1.05)",
                                    boxShadow: "md"
                                  }}
                                >
                                  <Image
                                    src={avatar.src}
                                    alt={`Default avatar ${avatar.id}`}
                                    objectFit="cover"
                                  />
                                </Box>
                              </AspectRatio>
                            ))}
                          </Grid>
                        </Box>
                      ) : (
                        <Box>
                          <FormLabel fontWeight="medium" color="text.primary">Upload Custom Image</FormLabel>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            style={{ display: 'none' }}
                            id="image-upload"
                          />
                          <label htmlFor="image-upload">
                            <Button
                              as="span"
                              leftIcon={<AddIcon />}
                              size="lg"
                              height="56px"
                              width="100%"
                              borderRadius="xl"
                              bg="background.secondary"
                              color="text.primary"
                              _hover={{
                                bg: "gray.200",
                              }}
                              cursor="pointer"
                              display="flex"
                            >
                              Choose Image
                            </Button>
                          </label>
                          <Text fontSize="sm" color="text.tertiary" mt={1}>
                            Recommended: Square image, max 5MB
                          </Text>
                        </Box>
                      )}
                    </Box>
                  </SimpleGrid>
                  
                  {!imageForm.imageChanged && (
                    <Text color="blue.500" fontSize="sm" mt={2}>
                      You need to select a new image to proceed.
                    </Text>
                  )}
                </VStack>
              </TabPanel>

              <TabPanel px={0}>
                <VStack spacing={4} align="stretch">
                  <Box
                    p={4}
                    borderRadius="md"
                    bg="background.secondary"
                    borderWidth="1px"
                    borderColor="surface.light"
                  >
                    <Text fontWeight="medium" color="text.primary" mb={1}>Security Question</Text>
                    <Text color="text.secondary">{securityQuestion || 'Loading security question...'}</Text>
                  </Box>

                  <FormInput
                    label="Your Answer"
                    value={securityAnswer}
                    onChange={(e) => setSecurityAnswer(e.target.value)}
                    placeholder="Enter your answer"
                    type="password"
                    error={securityError}
                  />
                  
                  <Text fontSize="sm" color="text.tertiary" mt={2}>
                    For security reasons, we need to confirm your identity before making changes to your profile.
                  </Text>
                </VStack>
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
