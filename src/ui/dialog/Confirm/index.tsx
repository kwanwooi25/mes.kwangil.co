import CloseIcon from '@mui/icons-material/Close';
import Dialog from 'features/dialog/Dialog';
import DoneIcon from '@mui/icons-material/Done';
import React, { ReactNode } from 'react';
import RoundedButton from 'ui/elements/RoundedButton';
import { useTranslation } from 'react-i18next';

export interface ConfirmDialogProps {
  title: string;
  message: ReactNode;
  onClose: (isConfirmed: boolean) => void;
}

function ConfirmDialog({ title, message, onClose }: ConfirmDialogProps) {
  const { t } = useTranslation('accounts');

  const handleClose = (isConfirmed: boolean) => () => onClose(isConfirmed);

  return (
    <Dialog open onClose={handleClose(false)} title={title} disableFullscreen>
      <Dialog.Content>{typeof message === 'string' ? <p>{message}</p> : message}</Dialog.Content>
      <Dialog.Actions>
        <RoundedButton onClick={handleClose(false)} variant="outlined" startIcon={<CloseIcon />}>
          {t('common:cancel')}
        </RoundedButton>
        <RoundedButton onClick={handleClose(true)} color="primary" startIcon={<DoneIcon />}>
          {t('common:confirm')}
        </RoundedButton>
      </Dialog.Actions>
    </Dialog>
  );
}

export default ConfirmDialog;
