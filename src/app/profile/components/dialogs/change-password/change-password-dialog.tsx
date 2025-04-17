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
  IconButton,
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { useDialog } from '@/contexts/dialog-context';
import { useCustomToast } from '@/app/components/ui/custom-toast';
import { changePassword, ChangePasswordRequest } from '@/services/auth-service';
import { validatePassword } from '@/utils/validators';
import FormInput from '@/app/components/form-input';

const ChangePasswordDialog: React.FC = () => {
  const { closeDialog } = useDialog();
  const { showToast } = useCustomToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const modalSize = useBreakpointValue({ base: 'xs', sm: 'sm', md: 'md' });

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<{
    currentPassword?: string;
    newPassword?: string;
    confirmPassword?: string;
  }>({});

  const validateForm = () => {
    const newErrors: {
      currentPassword?: string;
      newPassword?: string;
      confirmPassword?: string;
    } = {};

    if (!currentPassword) {
      newErrors.currentPassword = 'Current password is required';
    }

    const passwordError = validatePassword(newPassword);
    if (passwordError) {
      newErrors.newPassword = passwordError;
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your new password';
    } else if (confirmPassword !== newPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      setIsSubmitting(true);
      const passwordData: ChangePasswordRequest = {
        current_password: currentPassword,
        new_password: newPassword
      };

      await changePassword(passwordData, showToast);
      closeDialog();
    } catch (error: any) {
      // Error handling is done in the service layer
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
        <ModalHeader color="text.primary">Change Password</ModalHeader>
        <ModalCloseButton color="text.tertiary" />
        <Divider borderColor="surface.light" />

        <ModalBody py={6}>
          <VStack spacing={4} align="stretch">
            <FormInput
              label="Current Password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Enter your current password"
              type={showCurrentPassword ? 'text' : 'password'}
              error={errors.currentPassword}
              rightElement={
                <IconButton
                  aria-label={showCurrentPassword ? 'Hide password' : 'Show password'}
                  icon={showCurrentPassword ? <ViewOffIcon /> : <ViewIcon />}
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  variant="ghost"
                  size="sm"
                  color="text.tertiary"
                />
              }
            />

            <FormInput
              label="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
              type={showNewPassword ? 'text' : 'password'}
              error={errors.newPassword}
              rightElement={
                <IconButton
                  aria-label={showNewPassword ? 'Hide password' : 'Show password'}
                  icon={showNewPassword ? <ViewOffIcon /> : <ViewIcon />}
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  variant="ghost"
                  size="sm"
                  color="text.tertiary"
                />
              }
            />

            <FormInput
              label="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              type={showConfirmPassword ? 'text' : 'password'}
              error={errors.confirmPassword}
              rightElement={
                <IconButton
                  aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                  icon={showConfirmPassword ? <ViewOffIcon /> : <ViewIcon />}
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  variant="ghost"
                  size="sm"
                  color="text.tertiary"
                />
              }
            />
          </VStack>
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
          <Button
            bg="primary"
            color="white"
            _hover={{ bg: "#CC4300" }}
            _active={{ bg: "#B03B00" }}
            onClick={handleSubmit}
            isLoading={isSubmitting}
            loadingText="Updating"
          >
            Change Password
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ChangePasswordDialog;
