import React from 'react';
import { useDialog } from '@/contexts/dialog-context';
import ScheduleShowDialog from './schedule-show/schedule-show-dialog';

// import AdminBookingDialog from './dialogs/admin-booking-dialog';
// import CustomerBookingDialog from './dialogs/customer-booking-dialog';
// import PaymentDialog from './dialogs/payment-dialog';

export const DialogManager: React.FC = () => {
  const { currentDialog } = useDialog();

  if (currentDialog === 'none') return null;

  switch (currentDialog) {
    case 'scheduleShow':
      return <ScheduleShowDialog />;
    // Add other cases
    // case 'adminBooking':
    //   return <AdminBookingDialog />;
    // case 'customerBooking':
    //   return <CustomerBookingDialog />;
    // case 'payment':
    //   return <PaymentDialog />;
    default:
      return null;
  }
};

export default DialogManager;
