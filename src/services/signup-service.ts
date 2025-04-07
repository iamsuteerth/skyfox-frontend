import { API_ROUTES, SUCCESS_MESSAGES } from "@/constants";
import { handleApiError } from "@/utils/error-utils";

interface SignupData {
  name: string;
  username: string;
  password: string;
  number: string;
  email: string;
  profile_img: string;
  profile_img_sha: string;
  security_question_id: number;
  security_answer: string;
}

interface SignupResponse {
  success: boolean;
  data?: {
    username: string;
    name: string;
  };
  errors?: Array<{
    field: string;
    message: string;
  }>;
}

export const signupUser = async (userData: SignupData, showToast: Function): Promise<SignupResponse> => {
  try {
    const response = await fetch(API_ROUTES.CUSTOMER_SIGNUP, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
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

    if (data.status === 'SUCCESS') {
      showToast({
        type: 'success',
        title: 'Success',
        description: SUCCESS_MESSAGES.SIGNUP_SUCCESS,
      });
      return {
        success: true,
        data: data.data
      };
    }

    if (data.status === 'ERROR' && data.code === 'VALIDATION_ERROR' && data.errors) {
      data.errors.forEach((err: { field: string; message: string }) => {
        showToast({
          type: 'error',
          title: `${err.field} Error`,
          description: err.message,
        });
      });
      return {
        success: false,
        errors: data.errors
      };
    }
    throw new Error(data.message || 'An error occurred during signup');

  } catch (error: any) {
    console.error('Error during signup:', error);
    showToast({
      type: 'error',
      title: 'Signup Failed',
      description: error.message || handleApiError(error),
    });
    return {
      success: false,
      errors: [{
        field: 'general',
        message: error.message || handleApiError(error)
      }]
    };
  }
};
