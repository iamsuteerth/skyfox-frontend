import React from 'react';
import { useDialog } from '@/contexts/dialog-context';
import ChangePasswordDialog from './change-password/change-password-dialog';
import UpdateProfileDialog from './update-profile/update-profile-dialog';

export const DialogManager: React.FC = () => {
  const { currentDialog } = useDialog();

  if (currentDialog === 'none') return null;

  switch (currentDialog) {
    case 'changePassword':
      return <ChangePasswordDialog />;
    case 'updateProfile':
      return <UpdateProfileDialog />;
    default:
      return null;
  }
};

export default DialogManager;
