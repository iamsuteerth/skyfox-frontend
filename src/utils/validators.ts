export const validatePasswords = (
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

export const validateName = (name: string): string | null => {
  if (!name) return "Name is required";
  if (name.length < 3 || name.length > 70) 
    return "Name must be between 3 and 70 characters";
  if (!/^[a-zA-Z\s]+$/.test(name)) 
    return "Name can only contain letters and spaces";
  if (/\s{2,}/.test(name)) 
    return "Name cannot contain consecutive spaces";
  if (name.trim().split(/\s+/).length > 4) 
    return "Name cannot have more than 4 words";
  return null;
};

export const validateUsername = (username: string): string | null => {
  if (!username) return "Username is required";
  if (username.length < 3 || username.length > 30) 
    return "Username must be between 3 and 30 characters";
  if (/\s/.test(username)) 
    return "Username cannot contain spaces";
  if (/^\d/.test(username)) 
    return "Username cannot start with a number";
  if (!/^[a-z0-9_.-]+$/.test(username)) 
    return "Username can only contain lowercase letters, numbers, and the special characters: _ . -";
  if (/[_.-]{2,}/.test(username)) 
    return "Username cannot contain consecutive special characters";
  return null;
};

export const validatePassword = (password: string): string | null => {
  if (!password) return "Password is required";
  if (password.length < 8) 
    return "Password must be at least 8 characters long";
  if (!/[A-Z]/.test(password)) 
    return "Password must contain at least one uppercase letter";
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) 
    return "Password must contain at least one special character";
  return null;
};

export const validatePhone = (phone: string): string | null => {
  if (!phone) return "Phone number is required";
  if (!/^\d{10}$/.test(phone)) 
    return "Phone number must be exactly 10 digits";
  return null;
};

export const validateEmail = (email: string): string | null => {
  if (!email) return "Email is required";
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) 
    return "Please enter a valid email address";
  return null;
};

export const validateConfirmPassword = (password: string, confirmPassword: string): string | null => {
  if (!confirmPassword) return "Please confirm your password";
  if (password !== confirmPassword) 
    return "Passwords do not match";
  return null;
};

export const isFormComplete = (formData: Record<string, any>, requiredFields: string[]): boolean => {
  return requiredFields.every(field => formData[field]?.trim?.() !== '');
};
