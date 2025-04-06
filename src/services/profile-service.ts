import { API_ROUTES } from '@/constants';
import { handleApiError } from '@/utils/error-utils';

export type ProfileImageResponse = {
  status: string;
  message: string;
  request_id: string;
  data: {
    presigned_url: string;
    expires_at: string;
  };
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

    const data: ProfileImageResponse = await response.json();

    if (!response.ok) {
      throw {
        error: data,
        statusCode: response.status
      };
    }

    return data.data.presigned_url;
  } catch (error: any) {
    console.error('Error fetching profile image URL:', error);
    throw new Error(handleApiError(error));
  }
};
