import { API_ROUTES } from "@/constants";
import { handleApiError } from "@/utils/error-utils";
import { formatDateForAPI } from "@/utils/date-utils";

interface Movie {
  movieId: string;
  name: string;
  duration: string;
  plot: string;
  imdbRating: string;
  moviePoster: string;
  genre: string;
}

interface Slot {
  id: number;
  name: string;
  startTime: string;
  endTime: string;
}

interface Show {
  movie: Movie;
  slot: Slot;
  id: number;
  date: string;
  cost: number;
  availableseats: number;
}

interface ShowsResponse {
  message: string;
  request_id: string;
  status: string;
  data: Show[];
}

interface ShowsErrorResponse {
  status: string;
  code: string;
  message: string;
  request_id: string;
}

interface FetchShowsResult {
  success: boolean;
  data?: Show[];
  error?: string;
}

export const fetchShows = async (
  date?: Date,
  showToast?: Function
): Promise<FetchShowsResult> => {
  try {
    const formattedDate = date ? formatDateForAPI(date) : formatDateForAPI(new Date());
    
    const url = `${API_ROUTES.SHOWS}?date=${formattedDate}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (data.status === 'SUCCESS') {
      return {
        success: true,
        data: data.data
      };
    }

    if (data.status === 'ERROR') {
      if (data.code === 'DATE_OUT_OF_RANGE') {
        if (showToast) {
          showToast({
            type: 'error',
            title: 'Date Error',
            description: data.message || 'Customers can only view shows from today to the next 6 days',
          });
        } 
        
        return {
          success: false,
          error: data.message
        };
      }
      
      throw new Error(data.message || 'An error occurred while fetching shows');
    }

    throw new Error('Unexpected response from server');

  } catch (error: any) {
    console.error('Error fetching shows:', error);
    
    if (showToast) {
      showToast({
        type: 'error',
        title: 'Failed to Load Shows',
        description: error.message || handleApiError(error),
      });
    }
    
    return {
      success: false,
      error: error.message || handleApiError(error)
    };
  }
};


export const isDateWithinAllowedRange = (date: Date): boolean => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const maxDate = new Date(today);
  maxDate.setDate(today.getDate() + 6);
  
  date.setHours(0, 0, 0, 0); 
  
  return date >= today && date <= maxDate;
};

export type { Show, Movie, Slot };
