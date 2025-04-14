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