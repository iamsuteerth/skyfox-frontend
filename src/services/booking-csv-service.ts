import { handleApiError } from '@/utils/error-utils';
import { ERROR_MESSAGES } from '@/constants';

export interface BookingCsvParams {
  month?: number;
  year?: number;
}

export const downloadBookingCsv = async (
  params: BookingCsvParams, 
  showToast?: Function
): Promise<void> => {
  try {
    if (params.month && (params.month < 1 || params.month > 12)) {
      const errorMsg = 'Invalid month. Month must be between 1 and 12.';
      if (showToast) {
        showToast({
          type: 'error',
          title: 'Invalid Parameters',
          description: errorMsg
        });
      }
      throw new Error(errorMsg);
    }
    
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        queryParams.append(key, value.toString());
      }
    });
    
    let filename = 'bookings';
    if (params.month) {
      const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                          'July', 'August', 'September', 'October', 'November', 'December'];
      filename += `-${monthNames[params.month - 1]}`;
    }
    if (params.year) {
      filename += `-${params.year}`;
    }
    filename += '.csv';
    
    const loadingToastId = showToast ? showToast({
      type: 'loading',
      title: 'Downloading Report',
      description: 'Preparing your booking report...'
    }) : undefined;
    
    const response = await fetch(`/api/booking-csv?${queryParams.toString()}`);
    
    if (!response.ok) {
      const data = await response.json();
      if (showToast) {
        showToast({
          type: 'error',
          title: 'Download Failed',
          description: data.message || ERROR_MESSAGES.GENERIC_ERROR
        });
      }
      throw new Error(data.message || ERROR_MESSAGES.GENERIC_ERROR);
    }
    
    if (showToast) {
      showToast({
        type: 'success',
        title: 'Download Complete',
        description: 'Your report has been downloaded successfully.'
      });
    }
    
    const blob = await response.blob();
    
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = filename;
    
    document.body.appendChild(a);
    a.click();
    
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  } catch (error: any) {
    console.error('Error downloading booking CSV:', error);
    if (showToast && !error.message.includes('Download Failed')) {
      showToast({
        type: 'error',
        title: 'Download Error',
        description: error.message || ERROR_MESSAGES.GENERIC_ERROR
      });
    }
    throw handleApiError(error);
  }
};
