import { ERROR_MESSAGES } from '@/constants';

export type ApiErrorResponse = {
  status: string;
  code: string;
  message: string;
  request_id: string;
  errors?: Array<{
    field: string;
    message: string;
  }>;
};

export const handleApiError = (error: any): string => {
  if (typeof error === 'string') return error;
  
  if (error?.error?.status === 'ERROR') {
    if (error.error.code === 'VALIDATION_ERROR' && error.error.errors?.length > 0) {
      return `Validation failed: ${error.error.errors.map((e: any) => e.message).join(', ')}`;
    }
    
    // Handle specific error codes with custom messages
    switch (error.error.code) {
      case 'INVALID_CREDENTIALS':
        return ERROR_MESSAGES.INVALID_CREDENTIALS;
      case 'INVALID_REQUEST':
        return ERROR_MESSAGES.INVALID_REQUEST;
      case 'UNAUTHORIZED':
        return ERROR_MESSAGES.UNAUTHORIZED;
      case 'INVALID_TOKEN':
        return ERROR_MESSAGES.UNAUTHORIZED;
      case 'FORBIDDEN':
        return ERROR_MESSAGES.FORBIDDEN;
      case 'PROFILE_IMAGE_NOT_FOUND':
        return 'Profile image not found. Please upload a profile picture.';
      case 'USER_NOT_FOUND':
        return 'No account exists with this email address. Please check your email or sign up.';
      case 'INVALID_ANSWER':
        return 'The security answer provided is incorrect. Please try again.';
      case 'INVALID_RESET_TOKEN':
        return 'The reset token is invalid, expired, or has already been used. Please start again.';
      case 'PASSWORD_REUSE':
        return 'New password cannot match any of your previous passwords. Please choose a different password.';
      case 'DATE_OUT_OF_RANGE':
        return 'You can only view shows from today to the next 6 days.';
      default:
        // If we have a message from the API, use it
        return error.error.message || ERROR_MESSAGES.GENERIC_ERROR;
    }
  }
  
  // Handle HTTP status codes
  if (error?.statusCode) {
    switch (error.statusCode) {
      case 400:
        return ERROR_MESSAGES.INVALID_REQUEST;
      case 401:
        return ERROR_MESSAGES.UNAUTHORIZED;
      case 403:
        return ERROR_MESSAGES.FORBIDDEN;
      case 404:
        return 'The requested resource was not found.';
      case 500:
      case 502:
      case 503:
      case 504:
        return 'Server error. Please try again later.';
    }
  }
  
  // Handle network errors
  if (error instanceof Error) {
    if (
      error.message.includes('fetch') || 
      error.message.includes('network') ||
      error.message.includes('ECONNREFUSED') ||
      error.message.includes('Failed to fetch')
    ) {
      return ERROR_MESSAGES.NETWORK_ERROR;
    }
    return error.message;
  }
  
  // Default error message
  return ERROR_MESSAGES.GENERIC_ERROR;
};
