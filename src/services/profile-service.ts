import { API_ROUTES, ERROR_MESSAGES } from '@/constants';
import { handleApiError } from '@/utils/error-utils';

export type ProfileImageResponse = {
  status: string;
  message: string;
  request_id: string;
  data: {
    presigned_url: string;
    expires_at: string;
  };
  code?: string;
};

export const getProfileImageUrl = async (token: string): Promise<string> => {
  try {
    const response = await fetch(API_ROUTES.PROFILE_IMAGE, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    const text = await response.text();
    
    if (!text.trim()) {
      throw {
        message: 'No response received from server. Please try again later.',
        statusCode: 500
      };
    }

    let data: ProfileImageResponse;
    try {
      data = JSON.parse(text);
    } catch (parseError) {
      console.error('Invalid JSON response:', text);
      throw {
        message: 'Server returned an invalid response. Please try again later.',
        statusCode: 500
      };
    }

    if (!response.ok || data.status === 'ERROR') {
      throw {
        error: data,
        statusCode: response.status,
        message: data.message || ERROR_MESSAGES.GENERIC_ERROR
      };
    }

    if (!data.data?.presigned_url) {
      throw {
        message: 'Presigned URL not found in the response.',
        statusCode: 500
      };
    }

    return data.data.presigned_url;
  } catch (error: any) {
    console.error('Error fetching profile image URL:', error);
    throw handleApiError(error);
  }
};
