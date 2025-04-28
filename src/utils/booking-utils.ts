import { Booking } from '@/services/booking-service';
import { safeParseDateString, getCurrentTimeString } from '@/utils/date-utils';

export function getBookingDerivedStatus(booking: Booking): 'UPCOMING' | 'COMPLETED' {
  const showDate = safeParseDateString(booking.show_date);
  if (!showDate) return 'COMPLETED';
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  if (showDate > today) return 'UPCOMING';
  if (showDate < today) return 'COMPLETED';
  return booking.show_time > getCurrentTimeString() ? 'UPCOMING' : 'COMPLETED';
}