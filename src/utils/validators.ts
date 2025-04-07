export const validatePassword = (
  newPassword: string,
  confirmPassword: string,
  setNewPasswordError: (error: string) => void,
  setConfirmPasswordError: (error: string) => void
): boolean => {
  let isValid = true;

  if (!newPassword) {
    setNewPasswordError('Password is required');
    isValid = false;
  } else if (newPassword.length < 8) {
    setNewPasswordError('Password must be at least 8 characters');
    isValid = false;
  } else if (!/[A-Z]/.test(newPassword)) {
    setNewPasswordError('Password must contain at least one uppercase letter');
    isValid = false;
  } else if (!/[^A-Za-z0-9]/.test(newPassword)) {
    setNewPasswordError('Password must contain at least one special character');
    isValid = false;
  } else {
    setNewPasswordError('');
  }

  if (!confirmPassword) {
    setConfirmPasswordError('Please confirm your password');
    isValid = false;
  } else if (confirmPassword !== newPassword) {
    setConfirmPasswordError('Passwords do not match');
    isValid = false;
  } else {
    setConfirmPasswordError('');
  }

  return isValid;
};
