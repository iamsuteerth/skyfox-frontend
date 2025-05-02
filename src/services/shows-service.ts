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

interface FetchShowsResult {
  success: boolean;
  data?: Show[];
  error?: string;
  resetToToday?: boolean;
}

interface FetchShowResult {
  success: boolean;
  data?: Show;
  error?: string;
}

interface FetchMoviesResult {
  success: boolean;
  data?: Movie[];
  error?: string;
}

interface FetchSlotsResult {
  success: boolean;
  data?: Slot[];
  error?: string;
}

interface CreateShowData {
  movieId: string;
  date: string;
  slotId: number;
  cost: number;
}

interface CreateShowResult {
  success: boolean;
  data?: any;
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
        const today = new Date();
        const todayFormatted = formatDateForAPI(today);
        const currentUrl = new URL(window.location.href);
        currentUrl.searchParams.set('date', todayFormatted);
        window.history.replaceState({}, '', currentUrl.toString());
        return {
          success: false,
          error: data.message,
          resetToToday: true,
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

export const fetchShowById = async (
  id: number,
  showToast?: Function
): Promise<FetchShowResult> => {
  try {
    const url = `${API_ROUTES.SHOW}?id=${id}`;

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
      throw new Error(data.message || 'An error occurred while fetching show');
    }

    throw new Error('Unexpected response from server');

  } catch (error: any) {
    console.error('Error fetching shows:', error);

    if (showToast) {
      showToast({
        type: 'error',
        title: 'Failed to Load Show',
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

export const fetchMovies = async (showToast?: Function): Promise<FetchMoviesResult> => {
  try {
    const response = await fetch(API_ROUTES.MOVIES, {
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

    throw new Error(data.message || 'An error occurred while fetching movies');

  } catch (error: any) {
    console.error('Error fetching movies:', error);

    if (showToast) {
      showToast({
        type: 'error',
        title: 'Failed to Load Movies',
        description: error.message || handleApiError(error),
      });
    }

    return {
      success: false,
      error: error.message || handleApiError(error)
    };
  }
};

export const fetchSlots = async (date: Date, showToast?: Function): Promise<FetchSlotsResult> => {
  try {
    const formattedDate = formatDateForAPI(date);
    const url = `${API_ROUTES.SLOTS}?date=${formattedDate}`;

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

    throw new Error(data.message || 'An error occurred while fetching slots');

  } catch (error: any) {
    console.error('Error fetching slots:', error);

    if (showToast) {
      showToast({
        type: 'error',
        title: 'Failed to Load Slots',
        description: error.message || handleApiError(error),
      });
    }

    return {
      success: false,
      error: error.message || handleApiError(error)
    };
  }
};

export const createShow = async (showData: CreateShowData, showToast?: Function): Promise<CreateShowResult> => {
  try {
    const response = await fetch(API_ROUTES.SHOW, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(showData),
    });

    const data = await response.json();

    if (data.status === 'SUCCESS') {
      if (showToast) {
        showToast({
          type: 'success',
          title: 'Success',
          description: 'Show created successfully!',
        });
      }
      return {
        success: true,
        data: data.data
      };
    }

    throw new Error(data.message || 'An error occurred while creating the show');

  } catch (error: any) {
    console.error('Error creating show:', error);

    if (showToast) {
      showToast({
        type: 'error',
        title: 'Failed to Create Show!',
        description: error.message || handleApiError(error),
      });
    }

    return {
      success: false,
      error: error.message || handleApiError(error)
    };
  }
};

export type { Show, Movie, Slot, CreateShowData, CreateShowResult };
