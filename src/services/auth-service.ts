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
      throw new Error(handleApiError(error.error, error.statusCode));
    }
    throw new Error(handleApiError(error));
  }
};

interface SecurityQuestionResponse {
  status: string;
  message: string;
  request_id: string;
  data: {
    question_id: number;
    question: string;
    email: string;
  };
}

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

export const getSecurityQuestionByEmail = async (email: string): Promise<SecurityQuestionResponse> => {
  try {
    const url = `${API_ROUTES.SECURITY_QUESTION_BY_EMAIL}?email=${encodeURIComponent(email)}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
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
      if (data.code === 'USER_NOT_FOUND') {
        throw new Error('No account exists with this email address. Please check the email or sign up.');
      }
      
      throw new Error(data.message || ERROR_MESSAGES.GENERIC_ERROR);
    }

    if (!response.ok) {
      throw new Error(data.message || `Request failed with status ${response.status}`);
    }

    return data;
  } catch (error: any) {
    console.error('Error fetching security question:', error);
    
    if (error.message) {
      throw error;
    }

    throw new Error(handleApiError(error));
  }
};

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
