import { API_ROUTES } from "@/constants";
import { handleApiError } from "@/utils/error-utils";

export interface CheckInBooking {
  id: number;
  date: string;
  show_id: number;
  customer_id: number | null;
  customer_username: string;
  no_of_seats: number;
  amount_paid: number;
  status: string;
  booking_time: string;
  payment_type: string;
}

export interface CheckInResult {
  checked_in: number[];
  already_done: number[];
  invalid: number[];
}

export const getCheckInBookings = async (
  showToast?: (opts: { type: 'error' | 'success' | 'warning'; title: string; description: string }) => void
): Promise<CheckInBooking[]> => {
  try {
    const response = await fetch(API_ROUTES.CHECKIN_BOOKINGS, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    if (!response.ok) {
      throw new Error('Failed to fetch check-in bookings');
    }
    const data = await response.json();
    if (data.status === 'SUCCESS') return data.data as CheckInBooking[];
    throw new Error(data.message);
  } catch (error: any) {
    showToast?.({
      type: 'error', title: 'Check-in fetch error', description: error.message
    });
    return [];
  }
};

export const bulkCheckIn = async (
  bookingIds: number[],
  showToast?: (opts: { type: 'error' | 'success' | 'warning'; title: string; description: string }) => void
): Promise<{ checked_in: number[]; already_done: number[]; invalid: number[] } | null> => {
  try {
    const response = await fetch(API_ROUTES.CHECKIN_BOOKINGS, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ booking_ids: bookingIds })
    });
    if (!response.ok) throw new Error('Bulk check-in failed');
    const data = await response.json();
    if (data.status === 'SUCCESS') return data.data;
    throw new Error(data.message);
  } catch (error: any) {
    showToast?.({
      type: 'error', title: 'Bulk Check-In Error', description: error.message
    });
    return null;
  }
};

export const singleCheckIn = async (
  bookingId: number,
  showToast?: (opts: { type: 'error' | 'success' | 'warning'; title: string; description: string }) => void
): Promise<{ success: boolean; data?: CheckInResult; error?: string }> => {
  try {
    const response = await fetch(API_ROUTES.CHECKIN_SINGLE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ booking_id: bookingId })
    });

    if (!response.ok) throw new Error('Single check-in failed');
    const data = await response.json();
    if (data.status === 'SUCCESS') return { success: true, data: data.data };
    throw new Error(data.message);
  } catch (error: any) {
    console.error('Single check-in error:', error);
    if (showToast) {
      showToast({
        type: 'error',
        title: 'Check-In Error',
        description: error.message || handleApiError(error),
      });
    }
    return { success: false, error: error.message || handleApiError(error) };
  }
};
