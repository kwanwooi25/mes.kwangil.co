import { ReactElement, ReactNode, createContext, useContext } from 'react';
import { dialogActions, dialogSelector } from './dialogSlice';
import { useAppDispatch, useAppSelector } from 'app/store';

import { createPortal } from 'react-dom';

interface DialogContext {
  isOpen: boolean;
  openDialog: (dialog: ReactElement) => void;
  closeDialog: () => void;
  dialogs: ReactElement[];
}

export const dialogContext = createContext<DialogContext>({
  isOpen: false,
  openDialog: () => {},
  closeDialog: () => {},
  dialogs: [],
});

export const DialogProvider = ({ children }: { children: ReactNode }) => {
  const dialog = useDialogProvider();
  return (
    <dialogContext.Provider value={dialog}>
      {children}
      {dialog.isOpen && createPortal(dialog.dialogs[0], document.querySelector('#dialog-root') as Element)}
    </dialogContext.Provider>
  );
};

export const useDialog = () => useContext(dialogContext);

const useDialogProvider = (): DialogContext => {
  const { dialogs } = useAppSelector(dialogSelector);
  const dispatch = useAppDispatch();
  const { open, close } = dialogActions;

  const openDialog = (dialog: ReactElement) => {
    dispatch(open(dialog));
  };
  const closeDialog = () => {
    dispatch(close());
  };

  return { isOpen: !!dialogs.length, openDialog, closeDialog, dialogs };
};
