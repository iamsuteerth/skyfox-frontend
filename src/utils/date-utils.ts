export const formatDateForAPI = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

export const formatDateForDisplay = (dateStr: string): string => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

export const formatTimeForDisplay = (timeStr: string): string => {
  const [hours, minutes] = timeStr.split(':');
  const hour = parseInt(hours, 10);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 || 12;

  return `${hour12}:${minutes} ${ampm}`;
};

export const isValidDateString = (dateString: string): boolean => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    return false;
  }

  const [year, month, day] = dateString.split('-').map(Number);

  const date = new Date(year, month - 1, day);

  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  );
};

export const safeParseDateString = (dateString: string): Date | null => {
  if (!isValidDateString(dateString)) {
    return null;
  }

  const [year, month, day] = dateString.split('-').map(Number);
  return new Date(year, month - 1, day, 12, 0, 0, 0);
};

export const formatDuration = (duration: string): string => {
  let formatted = duration.replace('H', 'h');

  formatted = formatted.replace('M', 'm');

  formatted = formatted.replace(/s/g, '');

  const mIndex = formatted.indexOf('m');
  if (mIndex !== -1) {
    formatted = formatted.substring(0, mIndex + 1);
  }

  return formatted;
};

export const getCurrentTimeString = () : string => {
  const now = new Date();
  
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const seconds = now.getSeconds().toString().padStart(2, '0');
  
  return `${hours}:${minutes}:${seconds}`;
}

/**
 * Formats a timestamp into a date with ordinal day format (e.g., "15th April, 2025")
 * @param timestamp - Timestamp string in format like "2025-04-15 06:00:06.14253+00"
 * @returns Formatted date string or empty string if invalid input
 */
export const formatTimestampToOrdinalDate = (timestamp: string | null | undefined): string => {
  if (!timestamp) return '';
  
  try {
    const date = new Date(timestamp);
    
    if (isNaN(date.getTime())) return '';
    
    const day = date.getDate();
    const month = date.toLocaleString('en-US', { month: 'long' });
    const year = date.getFullYear();
    
    const ordinalSuffix = getOrdinalSuffix(day);
    
    return `${day}${ordinalSuffix} ${month}, ${year}`;
  } catch (error) {
    console.error('Error formatting date:', error);
    return '';
  }
};

/**
 * Returns the ordinal suffix for a number (1st, 2nd, 3rd, 4th, etc.)
 * @param day - The day number
 * @returns The appropriate ordinal suffix
 */
const getOrdinalSuffix = (day: number): string => {
  if (day > 3 && day < 21) return 'th';
  
  switch (day % 10) {
    case 1: return 'st';
    case 2: return 'nd';
    case 3: return 'rd';
    default: return 'th';
  }
};