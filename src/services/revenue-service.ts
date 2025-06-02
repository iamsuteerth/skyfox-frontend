import { ERROR_MESSAGES } from '@/constants';

export interface RevenueParams {
  timeframe?: 'daily' | 'weekly' | 'monthly' | 'yearly';
  month?: number;
  year?: number;
  movie_id?: string;
  slot_id?: string;
  genre?: string;
}

export interface RevenueData {
  label: string;
  total_revenue: number;
  mean_revenue: number;
  median_revenue: number;
  total_bookings: number;
  total_seats_booked: number;
}

export interface RevenueSummary {
  currentMonthRevenue: number;
  previousMonthRevenue: number;
  percentageDifference: number;
  bookings: number;
  previousMonthBookings: number;
  bookingPercentageDifference: number;
  seatsBooked: number;
  previousMonthSeatsBooked: number;
  seatsPercentageDifference: number;
  totalRevenue: number;
}

const validateParameters = (params: RevenueParams): boolean => {
  if (Object.keys(params).length === 0) return true;
  
  if (params.timeframe && (params.month || params.year)) {
    return false;
  }
  
  if (params.month && (params.month < 1 || params.month > 12)) {
    return false;
  }
  
  return true;
};

export const fetchRevenue = async (
    params: RevenueParams, 
    showToast?: (config: any) => void
  ): Promise<RevenueData[]> => {
    try {
      if (!validateParameters(params)) {
        const errorMsg = 'Invalid parameter combination';
        if (showToast) {
          showToast({
            type: 'error',
            title: 'Invalid Parameters',
            description: 'Timeframe cannot be combined with month/year filters'
          });
        }
        throw new Error(errorMsg);
      }
      
      const queryParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, value.toString());
        }
      });
      
      const response = await fetch(`/api/revenue?${queryParams.toString()}`);
      
      if (!response.ok) {
        let errorMessage = "Unable to fetch revenue data";
        
        if (response.status === 400) {
          errorMessage = "Invalid query parameters. Please check your filters and try again.";
        } else if (response.status === 401) {
          errorMessage = "Authentication error. Please log in again.";
        } else if (response.status === 404) {
          errorMessage = "Revenue data not available for the selected criteria.";
        } else if (response.status >= 500) {
          errorMessage = "Server error. Please try again later.";
        }
        
        if (showToast) {
          showToast({
            type: 'error',
            title: 'Data Fetch Error',
            description: errorMessage
          });
        }
        
        throw new Error(errorMessage);
      }
      
      const responseData = await response.json();
      
      if (responseData.status === 'ERROR') {
        const errorMsg = responseData.message || ERROR_MESSAGES.GENERIC_ERROR;
        if (showToast) {
          showToast({
            type: 'error', 
            title: 'Data Error',
            description: errorMsg
          });
        }
        throw new Error(errorMsg);
      }
      
      return responseData.data?.groups || [];
    } catch (error: any) {
      console.error('Error fetching revenue data:', error);
      return [];
    }
  };
  

export const fetchRevenueSummary = async (
  showToast?: (config: any) => void
): Promise<RevenueSummary> => {
  try {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();
    
    const previousMonth = currentMonth === 1 ? 12 : currentMonth - 1;
    const previousMonthYear = currentMonth === 1 ? currentYear - 1 : currentYear;
    
    let currentMonthData: RevenueData[] = [];
    try {
      currentMonthData = await fetchRevenue({ month: currentMonth, year: currentYear });
    } catch (error) {
      console.error('Error fetching current month data:', error);
    }
    
    let previousMonthData: RevenueData[] = [];
    try {
      previousMonthData = await fetchRevenue({ month: previousMonth, year: previousMonthYear });
    } catch (error) {
      console.error('Error fetching previous month data:', error);
    }
    
    let allTimeData: RevenueData[] = [];
    try {
      allTimeData = await fetchRevenue({ timeframe: 'yearly' });
    } catch (error) {
      console.error('Error fetching all-time data:', error);
    }
    
    const currentMonthRevenue = currentMonthData.reduce((sum, item) => sum + item.total_revenue, 0);
    const previousMonthRevenue = previousMonthData.reduce((sum, item) => sum + item.total_revenue, 0);

    const currentMonthBookings = currentMonthData.reduce((sum, item) => sum + item.total_bookings, 0);
    const previousMonthBookings = previousMonthData.reduce((sum, item) => sum + item.total_bookings, 0);
    
    const currentMonthSeats = currentMonthData.reduce((sum, item) => sum + item.total_seats_booked, 0);
    const previousMonthSeats = previousMonthData.reduce((sum, item) => sum + item.total_seats_booked, 0);
    
    const totalRevenue = allTimeData.reduce((sum, item) => sum + item.total_revenue, 0);
    
    const percentageDifference = previousMonthRevenue === 0 
      ? (currentMonthRevenue > 0 ? 100 : 0)
      : ((currentMonthRevenue - previousMonthRevenue) / previousMonthRevenue) * 100;

    const bookingPercentageDifference = previousMonthBookings === 0 
      ? (currentMonthBookings > 0 ? 100 : 0)
      : ((currentMonthBookings - previousMonthBookings) / previousMonthBookings) * 100;
    
    const seatsPercentageDifference = previousMonthSeats === 0 
      ? (currentMonthSeats > 0 ? 100 : 0)
      : ((currentMonthSeats - previousMonthSeats) / previousMonthSeats) * 100;
    
    return {
      currentMonthRevenue,
      previousMonthRevenue,
      percentageDifference,
      bookings: currentMonthBookings,
      previousMonthBookings: previousMonthBookings,
      bookingPercentageDifference,
      seatsBooked: currentMonthSeats,
      previousMonthSeatsBooked: previousMonthSeats,
      seatsPercentageDifference,
      totalRevenue
    };
  } catch (error: any) {
    console.error('Error fetching revenue summary:', error);
    if (showToast) {
      showToast({
        type: 'error',
        title: 'Summary Error',
        description: error.message || ERROR_MESSAGES.GENERIC_ERROR
      });
    }
    return {
      currentMonthRevenue: 0,
      previousMonthRevenue: 0,
      percentageDifference: 0,
      bookings: 0,
      previousMonthBookings: 0,
      bookingPercentageDifference: 0,
      seatsBooked: 0,
      previousMonthSeatsBooked: 0,
      seatsPercentageDifference: 0,
      totalRevenue: 0
    };
  }
};
