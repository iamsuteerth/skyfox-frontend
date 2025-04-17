import { API_ROUTES, ERROR_MESSAGES } from '@/constants';
import { handleApiError } from '@/utils/error-utils';

export type UpdateProfileRequest = {
  name: string;
  email: string;
  phone_number: string;
  security_answer: string;
};

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

interface UpdateResult {
  success: boolean;
  data?: any;
  error?: string;
}

export type CustomerProfileResponse = {
  status: string;
  message: string;
  request_id: string;
  data: {
    username: string;
    name: string;
    email: string;
    phone_number: string;
    security_question_exists: boolean;
    created_at: string;
  };
};

export type AdminStaffProfileResponse = {
  status: string;
  message: string;
  request_id: string;
  data: {
    username: string;
    name: string;
    counter_no: number;
    created_at: string;
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

export const getProfile = async (showToast?: Function): Promise<CustomerProfileResponse | AdminStaffProfileResponse> => {
  try {
    const response = await fetch(API_ROUTES.PROFILE, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Request failed to fetch profile!`)
    }

    const data = await response.json();

    return data;
  } catch (error: any) {
    console.error('Error fetching user profile:', error);
    if (showToast) {
      showToast({
        type: 'error',
        title: 'Profile Data Error',
        description: 'Unable to get profile data',
      });
    }
    throw handleApiError(error);
  }
};

export const updateProfileImage = async (
  imageData: {
    security_answer: string;
    profile_img: string;
    profile_img_sha: string;
  },
  showToast?: Function
): Promise<UpdateResult> => {
  try {
    const response = await fetch(API_ROUTES.UPDATE_CUSTOMER_PROFILE_IMAGE, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(imageData)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Request failed to fetch profile!`)
    }

    if (showToast) {
      showToast({
        type: 'success',
        title: 'Success',
        description: 'Profile image updated successfully',
      });
    }
    return {
      success: true,
    }
  } catch (error: any) {
    console.error('Error updating profile image:', error);
    if (showToast) {
      showToast({
        type: 'error',
        title: 'Failed to update customer profile image',
        description: error.message || handleApiError(error),
      });
    }
    return {
      success: false,
      error: error.message || handleApiError(error)
    };
  }
};

export const updateCustomerProfile = async (
  profileData: UpdateProfileRequest,
  showToast?: Function,
): Promise<UpdateResult> => {
  try {
    const response = await fetch(API_ROUTES.UPDATE_CUSTOMER_PROFILE, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(profileData)
    });

    const data = await response.json();
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Request failed to fetch profile!`)
    }

    if (showToast) {
      showToast({
        type: 'success',
        title: 'Success',
        description: 'Profile image updated successfully',
      });
    }
    return {
      success: true,
      data: data,
    }
  } catch (error: any) {
    console.error('Error updating customer profile:', error);
    if (showToast) {
      showToast({
        type: 'error',
        title: 'Failed to update customer profile image',
        description: error.message || handleApiError(error),
      });
    }
    return {
      success: false,
      error: error.message || handleApiError(error)
    };
  }
};