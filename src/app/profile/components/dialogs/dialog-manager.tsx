import React from 'react';
import { useDialog } from '@/contexts/dialog-context';
import ChangePasswordDialog from './change-password/change-password-dialog';
import UpdateProfileDialog from './update-profile/update-profile-dialog';
import UpdateProfileImageDialog from './update-profile-image/update-profile-image-dialog';

export const DialogManager: React.FC = () => {
  const { currentDialog } = useDialog();

  if (currentDialog === 'none') return null;

  switch (currentDialog) {
    case 'changePassword':
      return <ChangePasswordDialog />;
    case 'updateProfile':
      return <UpdateProfileDialog />;
    case 'updateProfileImage':
      return <UpdateProfileImageDialog/>;
    default:
      return null;
  }
};

export default DialogManager;
