import { API_ROUTES, ERROR_MESSAGES } from "@/constants";
import { handleApiError } from "@/utils/error-utils";

export interface SecurityQuestion {
  id: number;
  question: string;
}

export const getSecurityQuestions = async (): Promise<SecurityQuestion[]> => {
  try {
    const response = await fetch(API_ROUTES.SECURITY_QUESTIONS, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
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
      throw new Error(data.message || ERROR_MESSAGES.GENERIC_ERROR);
    }

    if (!response.ok) {
      throw new Error(data.message || `Request failed with status ${response.status}`);
    }

    return data.data;
  } catch (error: any) {
    console.error('Error fetching security questions:', error);
    if (error.message) {
      throw error;
    }
    throw new Error(handleApiError(error));
  }
};
