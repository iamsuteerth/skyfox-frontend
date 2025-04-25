import React from 'react';
import { useDialog } from '@/contexts/dialog-context';
import ScheduleShowDialog from './schedule-show/schedule-show-dialog';
import AdminBookingDialog from './booking/admin-booking/admin-booking-dialog';
import CustomerBookingDialog from './booking/customer-booking/customer-booking-dialog';

export const DialogManager: React.FC = () => {
  const { currentDialog } = useDialog();

  if (currentDialog === 'none') return null;

  switch (currentDialog) {
    case 'scheduleShow':
      return <ScheduleShowDialog />;
    case 'adminBooking':
      return <AdminBookingDialog />;
    case 'customerBooking':
      return <CustomerBookingDialog />;
    default:
      return null;
  }
};

export default DialogManager;
