import { API_ROUTES, ERROR_MESSAGES } from '@/constants';
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
      throw new Error(handleApiError(error));
    }
    throw new Error(handleApiError(error));
  }
};



interface VerifySecurityAnswerResponse {
  status: string;
  message: string;
  request_id: string;
  data: {
    reset_token: string;
    expires_in_seconds: number;
  };
}

interface ResetPasswordResponse {
  status: string;
  message: string;
  request_id: string;
  code?: string;
}



export const verifySecurityAnswer = async ({
  email,
  security_answer,
}: {
  email: string;
  security_answer: string;
}): Promise<VerifySecurityAnswerResponse> => {
  try {
    const response = await fetch(API_ROUTES.VERIFY_SECURITY_ANSWER, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, security_answer }),
    });

    const text = await response.text();
    
    if (!text.trim()) {
      throw new Error('No response received from server. Please try again later.');
    }
    
    let data;
    
    try {
      data = JSON.parse(text);
    } catch (parseError) {
      console.error('Invalid JSON response:', text);
      throw new Error('Server returned an invalid response. Please try again later.');
    }

    if (data.status === 'ERROR') {
      switch (data.code) {
        case 'INVALID_ANSWER':
          throw new Error('The security answer provided is incorrect. Please try again.');
        case 'VALIDATION_ERROR':
          const validationErrors = data.errors?.map((err: any) => err.message).join(', ');
          throw new Error(`Validation failed: ${validationErrors || data.message}`);
        default:
          throw new Error(data.message || ERROR_MESSAGES.GENERIC_ERROR);
      }
    }

    if (!response.ok) {
      throw new Error(data.message || `Request failed with status ${response.status}`);
    }

    return data;
  } catch (error: any) {
    console.error('Error verifying security answer:', error);
    
    if (error.message) {
      throw error;
    }
    throw new Error(handleApiError(error));
  }
};

export const resetPassword = async ({
  email,
  reset_token,
  new_password,
}: {
  email: string;
  reset_token: string;
  new_password: string;
}): Promise<ResetPasswordResponse> => {
  try {
    const response = await fetch(API_ROUTES.FORGOT_PASSWORD, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        reset_token,
        new_password,
      }),
    });

    const text = await response.text();
    
    if (!text.trim()) {
      throw new Error('No response received from server. Please try again later.');
    }
    
    let data;
    
    try {
      data = JSON.parse(text);
    } catch (parseError) {
      console.error('Invalid JSON response:', text);
      throw new Error('Server returned an invalid response. Please try again later.');
    }

    if (data.status === 'ERROR') {
      switch (data.code) {
        case 'INVALID_RESET_TOKEN':
          throw new Error('The reset token is invalid, expired, or has already been used. Please start again.');
        
        case 'PASSWORD_REUSE':
          throw new Error('New password cannot match any of your previous passwords. Please choose a different password.');
        
        case 'VALIDATION_ERROR':
          if (data.errors && data.errors.length > 0) {
            const validationErrors = data.errors.map((err: any) => err.message).join(', ');
            throw new Error(`Validation failed: ${validationErrors}`);
          }
          throw new Error(data.message || 'Validation failed. Please check your input.');
        
        default:
          throw new Error(data.message || ERROR_MESSAGES.GENERIC_ERROR);
      }
    }

    if (!response.ok) {
      throw new Error(data.message || `Request failed with status ${response.status}`);
    }

    return data;
  } catch (error: any) {
    console.error('Error resetting password:', error);
    
    if (error.message) {
      throw error;
    }
    
    throw new Error(handleApiError(error));
  }
};

export type ChangePasswordRequest = {
  current_password: string;
  new_password: string;
};

export const changePassword = async (
  passwordData: ChangePasswordRequest,
  showToast?: Function,
): Promise<ResetPasswordResponse> => {
  try {
    const response = await fetch(API_ROUTES.CHANGE_PASWORD, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(passwordData)
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || `Request failed with status ${response.status}`);
    }
    if (showToast) {
      showToast({
        type: 'success',
        title: 'Success',
        description: 'Password changed successfully',
      });
    }
    return data
  } catch (error: any) {
    console.error('Error changing password:', error);
    if (showToast) {
      showToast({
        type: 'error',
        title: 'Failed to change passwords!',
        description: error.message || handleApiError(error),
      });
    }
    throw handleApiError(error);
  }
};