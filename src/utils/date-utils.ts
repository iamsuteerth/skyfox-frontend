// src/utils/date-utils.ts
/**
 * Formats a date object to YYYY-MM-DD string for API requests
 */
export const formatDateForAPI = (date: Date): string => {
    return date.toISOString().split('T')[0];
  };
  
  /**
   * Formats a date string to a more readable format
   */
  export const formatDateForDisplay = (dateStr: string): string => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };
  
  /**
   * Formats a time string (HH:MM:SS) to a more readable format (HH:MM AM/PM)
   */
  export const formatTimeForDisplay = (timeStr: string): string => {
    const [hours, minutes] = timeStr.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    
    return `${hour12}:${minutes} ${ampm}`;
  };
  