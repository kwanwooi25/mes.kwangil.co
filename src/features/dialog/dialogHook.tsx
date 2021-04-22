import { useAppDispatch, useAppSelector } from 'app/store';
import { ReactElement, ReactNode, createContext, useContext } from 'react';

import { createPortal } from 'react-dom';
import { dialogActions, dialogSelector } from './dialogSlice';

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
  const { dialog } = useAppSelector(dialogSelector);
  const dispatch = useAppDispatch();
  const { open, close } = dialogActions;

  const openDialog = (dialog: ReactElement) => {
    dispatch(open(dialog));
  };
  const closeDialog = () => {
    dispatch(close());
  };

  return { isOpen: !!dialog, openDialog, closeDialog, dialog };
};
