import { ERROR_MESSAGES } from '@/constants';

export type ApiErrorResponse = {
  status: string;
  code: string;
  message: string;
  request_id: string;
};

export const handleApiError = (error: any, statusCode?: number): string => {
  if (typeof error === 'string') return error;

  if (statusCode) {
    switch (statusCode) {
      case 400:
        return ERROR_MESSAGES.INVALID_REQUEST;
      case 401:
        if (error && error.status === 'ERROR') {
          return error.message;
        }
        break;
    }
  }

  if (error && error.status === 'ERROR') {
    return error.message;
  }

  if (error instanceof Error) {
    if (error.message.includes('fetch')) {
      return ERROR_MESSAGES.NETWORK_ERROR;
    }
    return error.message;
  }

  return ERROR_MESSAGES.GENERIC_ERROR;
};