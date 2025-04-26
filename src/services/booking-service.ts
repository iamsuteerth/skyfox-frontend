import { API_ROUTES, ERROR_MESSAGES } from '@/constants';
import { handleApiError } from '@/utils/error-utils';

export type SeatType = 'Standard' | 'Deluxe';

export interface Seat {
  column: string;
  occupied: boolean;
  price: number;
  seat_number: string;
  type: SeatType;
}

export interface SeatMap {
  [row: string]: Seat[];
}

export interface SeatMapResponse {
  status: string;
  message: string;
  request_id: string;
  data: {
    seat_map: SeatMap;
  };
}

export interface BookingInitializeRequest {
  show_id: number;
  seat_numbers: string[];
}

export interface BookingInitializeResponse {
  status: string;
  message: string;
  request_id: string;
  data: {
    booking_id: number;
    show_id: number;
    seat_numbers: string[];
    amount_due: number;
    expiration_time: string;
    time_remaining_ms: number;
  };
}

export interface AdminBookingRequest {
  show_id: number;
  customer_name: string;
  phone_number: string;
  seat_numbers: string[];
  amount_paid: number;
}

export interface PaymentRequest {
  booking_id: number;
  card_number: string;
  cvv: string;
  expiry_month: string;
  expiry_year: string;
  cardholder_name: string;
}

export const getSeatMap = async (showId: number): Promise<SeatMap> => {
  try {
    const response = await fetch(API_ROUTES.GET_SEAT_MAP.replace('{show_id}', showId.toString()), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || ERROR_MESSAGES.GENERIC_ERROR);
    }

    const data: SeatMapResponse = await response.json();
    return data.data.seat_map;
  } catch (error: any) {
    console.error('Error fetching seat map:', error);
    throw handleApiError(error);
  }
};

export const createAdminBooking = async (
  showId: number,
  customerName: string,
  phoneNumber: string,
  seatNumbers: string[],
  amountPaid: number,
  showToast?: Function
): Promise<{ success: boolean; bookingId?: number; error?: string }> => {
  try {
    const response = await fetch(API_ROUTES.ADMIN_CREATE_BOOKING, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        show_id: showId,
        customer_name: customerName,
        phone_number: phoneNumber,
        seat_numbers: seatNumbers,
        amount_paid: amountPaid
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || ERROR_MESSAGES.GENERIC_ERROR);
    }

    const data = await response.json();
    
    if (showToast) {
      showToast({
        type: 'success',
        title: 'Booking Successful',
        description: 'Customer booking has been created'
      });
    }
    
    return {
      success: true,
      bookingId: data.data.booking_id
    };
  } catch (error: any) {
    console.error('Admin booking error:', error);
    if (showToast) {
      showToast({
        type: 'error',
        title: 'Booking Failed',
        description: error.message || 'Failed to create booking'
      });
    }
    return {
      success: false,
      error: error.message
    };
  }
};

export const initializeCustomerBooking = async (
  showId: number,
  seatNumbers: string[],
  amount: number,
  showToast?: Function
): Promise<any> => {
  try {
    const response = await fetch(API_ROUTES.INITIALIZE_BOOKING, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ show_id: showId, seat_numbers: seatNumbers, amount })
    });

    const data = await response.json();
    if (!response.ok || data.status === 'ERROR') {
      if (showToast) {
        showToast({
          type: 'error',
          title: 'Booking Error',
          description: data.message || ERROR_MESSAGES.GENERIC_ERROR,
        });
      }
      throw new Error(data.message || ERROR_MESSAGES.GENERIC_ERROR);
    }
    return data.data;
  } catch (error: any) {
    console.error('Error initializing booking:', error);
    throw handleApiError(error);
  }
};

export const processCustomerPayment = async (
  bookingId: number,
  paymentDetails: {
    card_number: string;
    cvv: string;
    expiry_month: string;
    expiry_year: string;
    cardholder_name: string;
  },
  showToast?: Function
): Promise<any> => {
  try {
    const response = await fetch(API_ROUTES.PROCESS_PAYMENT.replace('{id}', bookingId.toString()), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ booking_id: bookingId, ...paymentDetails })
    });

    const data = await response.json();
    if (!response.ok || data.status === 'ERROR') {
      if (showToast) {
        showToast({
          type: 'error',
          title: 'Payment Error',
          description: data.message || ERROR_MESSAGES.GENERIC_ERROR,
        });
      }
      throw new Error(data.message || ERROR_MESSAGES.GENERIC_ERROR);
    }
    if (showToast) {
      showToast({
        type: 'success',
        title: 'Payment Successful',
        description: 'Your booking is now confirmed.',
      });
    }
    return data.data;
  } catch (error: any) {
    console.error('Error processing payment:', error);
    throw handleApiError(error);
  }
};

export const cancelCustomerBooking = async (
  bookingId: number,
  showToast?: Function
): Promise<void> => {
  try {
    const response = await fetch(API_ROUTES.CANCEL_BOOKING.replace('{id}', bookingId.toString()), {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' }
    });
    let data = {};
    try {
      data = await response.json();
    } catch {}
    if (!response.ok || (data && (data as any).status === 'ERROR')) {
      const msg = data && (data as any).message
        ? (data as any).message
        : ERROR_MESSAGES.GENERIC_ERROR;
      if (showToast) {
        showToast({
          type: 'error',
          title: 'Booking Cancel Failed',
          description: msg,
        });
      }
      throw new Error(msg);
    }
    if (showToast) {
      showToast({
        type: 'warning',
        title: 'Booking Cancelled',
        description: 'Your booking has been released.',
      });
    }
    return;
  } catch (error: any) {
    console.error('Error cancelling booking:', error);
    throw handleApiError(error);
  }
};

export const getQRCode = async (bookingId: number): Promise<string> => {
  try {
    const response = await fetch(API_ROUTES.GET_QR_CODE.replace('{id}', bookingId.toString()), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || ERROR_MESSAGES.GENERIC_ERROR);
    }

    const data = await response.json();
    return data.data.qr_code;
  } catch (error: any) {
    console.error('Error fetching QR code:', error);
    throw handleApiError(error);
  }
};

export const getPDFTicket = async (bookingId: number): Promise<string> => {
  try {
    const response = await fetch(API_ROUTES.GET_PDF_TICKET.replace('{id}', bookingId.toString()), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || ERROR_MESSAGES.GENERIC_ERROR);
    }

    const data = await response.json();
    return data.data.pdf;
  } catch (error: any) {
    console.error('Error fetching PDF ticket:', error);
    throw handleApiError(error);
  }
};
