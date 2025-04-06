'use client';

import { useState } from 'react';
import { VStack, Button, IconButton, Box } from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { useRouter } from 'next/navigation';
import FormInput from '@/app/components/form-input';
import { resetPassword } from '@/services/auth-service';
import { APP_ROUTES, ERROR_MESSAGES, SUCCESS_MESSAGES } from '@/constants';
import { useCustomToast } from '@/app/components/ui/custom-toast';
import { validatePassword } from '@/utils/password'

interface ResetStepProps {
  email: string;
  resetToken: string;
  resetFlow: () => void;
  setError: (error: string) => void;
}

export default function ResetStep({
  email,
  resetToken,
  resetFlow,
  setError
}: ResetStepProps) {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [newPasswordError, setNewPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [localError, setLocalError] = useState('');
  
  const router = useRouter();
  const { showToast } = useCustomToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validatePassword(newPassword, confirmPassword, setNewPasswordError, setConfirmPasswordError)) return;
    
    setIsLoading(true);
    setError('');
    setLocalError(''); 
    
    try {
      const response = await resetPassword({
        email,
        reset_token: resetToken,
        new_password: newPassword
      });
      
      if (response.status === 'ERROR') {
        if (response.code === 'INVALID_RESET_TOKEN' || response.code === 'TOKEN_EXPIRED') {
          resetFlow();
          throw new Error('Reset token has expired. Please start again.');
        }
        throw new Error(response.message || ERROR_MESSAGES.GENERIC_ERROR);
      }
      
      showToast({
        type: 'success',
        title: 'Success',
        description: SUCCESS_MESSAGES.PASSWORD_RESET_SUCCESS
      });
      
      router.push(APP_ROUTES.LOGIN);
    } catch (err: any) {
      console.error('Error resetting password:', err);
      setLocalError(err.message || ERROR_MESSAGES.GENERIC_ERROR);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <VStack spacing={6} align="stretch">
      {localError && (
        <Box 
          bg="error" 
          color="white" 
          py={2} 
          px={4} 
          borderRadius="md" 
          textAlign="center"
        >
          {localError}
        </Box>
      )}

      <form onSubmit={handleSubmit}>
        <VStack spacing={6}>
          <FormInput
            label="New Password"
            value={newPassword}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewPassword(e.target.value)}
            placeholder="Enter new password"
            type={showNewPassword ? 'text' : 'password'}
            error={newPasswordError}
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
            label="Confirm Password"
            value={confirmPassword}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
            placeholder="Confirm new password"
            type={showConfirmPassword ? 'text' : 'password'}
            error={confirmPasswordError}
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

          <Button
            type="submit"
            isLoading={isLoading}
            loadingText="Resetting Password"
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
            Reset Password
          </Button>
        </VStack>
      </form>
    </VStack>
  );
}
