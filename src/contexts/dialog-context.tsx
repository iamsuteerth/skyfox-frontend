import React, { createContext, useContext, useState, ReactNode } from 'react';

type DialogType = 'none' | 'adminBooking' | 'customerBooking' | 'payment' | 'scheduleShow' | 'changePassword' | 'updateProfile' | 'updateProfileImage';

interface DialogContextType {
  currentDialog: DialogType;
  dialogData: any;
  openDialog: (type: DialogType, data?: any) => void;
  closeDialog: () => void;
}

const DialogContext = createContext<DialogContextType | undefined>(undefined);

export const DialogProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [currentDialog, setCurrentDialog] = useState<DialogType>('none');
  const [dialogData, setDialogData] = useState<any>(null);

  const openDialog = (type: DialogType, data?: any) => {
    setCurrentDialog(type);
    setDialogData(data);
  };

  const closeDialog = () => {
    setCurrentDialog('none');
    setDialogData(null);
  };

  return (
    <DialogContext.Provider value={{ currentDialog, dialogData, openDialog, closeDialog }}>
      {children}
    </DialogContext.Provider>
  );
};

export const useDialog = () => {
  const context = useContext(DialogContext);
  if (context === undefined) {
    throw new Error('useDialog must be used within a DialogProvider');
  }
  return context;
};
