export interface Movie {
  movieId: string;
  name: string;
}

export interface Slot {
  id: number;
  name: string;
  startTime: string;
  endTime: string;
}

export interface ScheduleShowFormData {
  selectedDate: Date | null;
  selectedMovie: string;
  selectedSlot: number | null;
  ticketPrice: number;
}

export interface ScheduleShowErrors {
  movie?: string;
  slot?: string;
  price?: string;
  date?: string;
}
