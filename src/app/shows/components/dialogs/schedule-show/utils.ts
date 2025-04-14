import { ScheduleShowFormData, ScheduleShowErrors } from './types';

export const validateForm = (formData: ScheduleShowFormData): ScheduleShowErrors => {
  const errors: ScheduleShowErrors = {};
  
  if (!formData.selectedMovie) {
    errors.movie = 'Please select a movie';
  }
  
  if (!formData.selectedSlot) {
    errors.slot = 'Please select a time slot';
  }
  
  if (!formData.selectedDate) {
    errors.date = 'Please select a date';
  } else {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (formData.selectedDate < today) {
      errors.date = 'Cannot schedule shows for past dates';
    }
  }
  
  if (formData.ticketPrice <= 0) {
    errors.price = 'Price must be greater than zero';
  } else if (formData.ticketPrice < 50 || formData.ticketPrice > 3000) {
    errors.price = 'Price must be between ₹50 and ₹3,000';
  }
  
  return errors;
};
