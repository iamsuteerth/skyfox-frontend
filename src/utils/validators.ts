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

export function validateCardNumber(cardNumber: string): string | null {
  if (!/^\d{16}$/.test(cardNumber)) return 'Card number must be exactly 16 digits';
  let sum = 0;
  let shouldDouble = false;
  for (let i = cardNumber.length - 1; i >= 0; i--) {
    let digit = parseInt(cardNumber.charAt(i), 10);
    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    shouldDouble = !shouldDouble;
  }
  if (sum % 10 !== 0) return 'Invalid card number!';
  return null;
}

export function validateCVV(cvv: string): string | null {
  if (!/^\d+$/.test(cvv)) return 'CVV must contain only numeric characters';
  if (cvv.length !== 3) return 'CVV must be exactly 3 digits';
  const cvvInt = parseInt(cvv, 10);
  if (cvvInt < 1 || cvvInt > 999) return 'CVV must be between 001 and 999';
  return null;
}

export function validateExpiry(expiry: string): string | null {
  if (!/^(0[1-9]|1[0-2])\/(\d{2})$/.test(expiry))
    return 'Expiry must be in MM/YY format with valid month (01-12)';

  const [monthStr, yearStr] = expiry.split('/');
  const month = parseInt(monthStr, 10);
  const year = 2000 + parseInt(yearStr, 10);

  const now = new Date();
  const currentYear = now.getFullYear();

  const expiryDate = new Date(year, month, 0, 23, 59, 59, 999);

  if (expiryDate < now) return "Card has expired";
  if (year > currentYear + 20) return 'Expiry cannot exceed 20 years from now';

  return null;
}


export function validateCardName(name: string): string | null {
  const trimmed = name.trim();
  if (trimmed.length === 0) return 'Name cannot be empty';
  if (!/^[a-zA-Z\s'-]+$/.test(trimmed))
    return "Name must contain only letters, spaces, apostrophes, and hyphens";
  if (trimmed.length < 2 || trimmed.length > 40)
    return 'Name must be between 2-40 characters';
  if (trimmed.includes('  '))
    return 'Consecutive spaces are not allowed';
  return null;
}
