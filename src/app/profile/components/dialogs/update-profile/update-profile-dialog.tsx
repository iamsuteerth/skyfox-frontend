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
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
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
import { useAuth } from '@/contexts/auth-context';
import ProfileImage from '@/app/components/profile-image';

const UpdateProfileDialog: React.FC = () => {
  const { closeDialog } = useDialog();
  const { user } = useAuth();
  const { showToast } = useCustomToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const modalSize = useBreakpointValue({
    base: 'xs',
    sm: 'md',
    md: 'lg'
  });

  // Personal info form state
  const [fullName, setFullName] = useState('John Doe');
  const [email, setEmail] = useState('john@gmail.com');
  const [phone, setPhone] = useState('1234567890');

  // Security verification state
  const [securityAnswer, setSecurityAnswer] = useState('');

  // Error state
  const [errors, setErrors] = useState<{
    fullName?: string;
    email?: string;
    phone?: string;
    securityAnswer?: string;
  }>({});

  const validatePersonalInfo = () => {
    const newErrors: { fullName?: string; email?: string; phone?: string } = {};

    if (!fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Invalid email address';
    }

    if (!phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\+?\d{10,14}$/.test(phone.replace(/\s+/g, ''))) {
      newErrors.phone = 'Invalid phone number format';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateSecurityAnswer = () => {
    const newErrors: { securityAnswer?: string } = {};

    if (!securityAnswer.trim()) {
      newErrors.securityAnswer = 'Security answer is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (currentStep === 0 && validatePersonalInfo()) {
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

    if (!validateSecurityAnswer()) return;

    try {
      setIsSubmitting(true);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      showToast({
        type: 'success',
        title: 'Profile Updated',
        description: 'Your profile has been updated successfully',
      });

      closeDialog();
    } catch (error) {
      console.error("Error updating profile:", error);
      showToast({
        type: 'error',
        title: 'Error',
        description: 'Failed to update profile',
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
                  <Box textAlign="center" mb={2}>
                    <ProfileImage size="xl" />
                  </Box>

                  <FormControl isRequired isInvalid={!!errors.fullName}>
                    <FormLabel color="text.primary">Full Name</FormLabel>
                    <Input
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="John Doe"
                      bg="background.secondary"
                      borderColor="surface.light"
                      _hover={{ borderColor: "surface.medium" }}
                      _focus={{ borderColor: "primary", boxShadow: "0 0 0 1px var(--chakra-colors-primary)" }}
                    />
                    {errors.fullName && (
                      <FormErrorMessage>{errors.fullName}</FormErrorMessage>
                    )}
                  </FormControl>

                  <FormControl isRequired isInvalid={!!errors.email}>
                    <FormLabel color="text.primary">Email</FormLabel>
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="john.doe@example.com"
                      bg="background.secondary"
                      borderColor="surface.light"
                      _hover={{ borderColor: "surface.medium" }}
                      _focus={{ borderColor: "primary", boxShadow: "0 0 0 1px var(--chakra-colors-primary)" }}
                    />
                    {errors.email && (
                      <FormErrorMessage>{errors.email}</FormErrorMessage>
                    )}
                  </FormControl>

                  <FormControl isRequired isInvalid={!!errors.phone}>
                    <FormLabel color="text.primary">Phone Number</FormLabel>
                    <Input
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+1 (555) 123-4567"
                      bg="background.secondary"
                      borderColor="surface.light"
                      _hover={{ borderColor: "surface.medium" }}
                      _focus={{ borderColor: "primary", boxShadow: "0 0 0 1px var(--chakra-colors-primary)" }}
                    />
                    {errors.phone && (
                      <FormErrorMessage>{errors.phone}</FormErrorMessage>
                    )}
                  </FormControl>
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
                    <Text color="text.secondary">What was the name of your first pet?</Text>
                  </Box>

                  <FormControl isRequired isInvalid={!!errors.securityAnswer}>
                    <FormLabel color="text.primary">Your Answer</FormLabel>
                    <Input
                      type="password"
                      value={securityAnswer}
                      onChange={(e) => setSecurityAnswer(e.target.value)}
                      placeholder="Enter your answer"
                      bg="background.secondary"
                      borderColor="surface.light"
                      _hover={{ borderColor: "surface.medium" }}
                      _focus={{ borderColor: "primary", boxShadow: "0 0 0 1px var(--chakra-colors-primary)" }}
                    />
                    {errors.securityAnswer && (
                      <FormErrorMessage>{errors.securityAnswer}</FormErrorMessage>
                    )}
                  </FormControl>

                  <Box>
                    <Text fontSize="sm" color="text.tertiary">
                      Please provide your security answer to verify your identity before updating your profile information.
                    </Text>
                  </Box>
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

