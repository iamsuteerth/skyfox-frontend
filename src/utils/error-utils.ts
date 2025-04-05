// src/utils/error-utils.ts
import { ERROR_MESSAGES } from '@/constants';

export type ApiErrorResponse = {
  status: string;
  code: string;
  message: string;
  request_id: string;
};

export const handleApiError = (error: any, statusCode?: number): string => {
  // If it's already a string message, return it
  if (typeof error === 'string') return error;

  // Handle specific status codes
  if (statusCode) {
    switch (statusCode) {
      case 400:
        return ERROR_MESSAGES.INVALID_REQUEST;
      case 401:
        // For 401, use the message from API if available
        if (error && error.status === 'ERROR') {
          return error.message;
        }
        break;
      // Add more status code handlers as needed
    }
  }

  // If it's our API error format
  if (error && error.status === 'ERROR') {
    return error.message;
  }

  // Handle network errors
  if (error instanceof Error) {
    if (error.message.includes('fetch')) {
      return ERROR_MESSAGES.NETWORK_ERROR;
    }
    return error.message;
  }

  // Generic fallback
  return ERROR_MESSAGES.GENERIC_ERROR;
};