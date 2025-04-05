import { API_ROUTES } from '@/constants';
import { handleApiError } from '@/utils/error-utils';

export type LoginRequest = {
  username: string;
  password: string;
};

export type LoginResponse = {
  status: string;
  message: string;
  request_id: string;
  data: {
    user: {
      username: string;
      role: string;
    };
    token: string;
  };
};

export const login = async (credentials: LoginRequest): Promise<LoginResponse> => {
  try {
    const response = await fetch(API_ROUTES.LOGIN, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw { 
        error: data, 
        statusCode: response.status 
      };
    }
    
    return data;
  } catch (error: any) {
    if (error.statusCode && error.error) {
      throw new Error(handleApiError(error.error, error.statusCode));
    }
    throw new Error(handleApiError(error));
  }
};