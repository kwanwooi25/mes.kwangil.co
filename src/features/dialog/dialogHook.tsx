import { ReactElement, ReactNode, createContext, useContext, useState } from 'react';

import { createPortal } from 'react-dom';

interface DialogContext {
  isOpen: boolean;
  openDialog: (dialog: ReactElement) => void;
  closeDialog: () => void;
  dialog?: ReactElement | null;
}

export const dialogContext = createContext<DialogContext>({
  isOpen: false,
  openDialog: () => {},
  closeDialog: () => {},
  dialog: null,
});

export const DialogProvider = ({ children }: { children: ReactNode }) => {
  const dialog = useDialogProvider();
  return (
    <dialogContext.Provider value={dialog}>
      {children}
      {dialog.isOpen && createPortal(dialog.dialog, document.querySelector('#dialog-root') as Element)}
    </dialogContext.Provider>
  );
};

export const useDialog = () => useContext(dialogContext);

const useDialogProvider = (): DialogContext => {
  const [dialog, setDialog] = useState<ReactElement | undefined | null>(undefined);

  const openDialog = (dialog: ReactElement) => {
    setDialog(dialog);
  };
  const closeDialog = () => {
    setDialog(null);
  };

  return { isOpen: !!dialog, openDialog, closeDialog, dialog };
};
