import RoundedButton from 'components/RoundedButton';
import Dialog from 'features/dialog/Dialog';
import React from 'react';
import { useTranslation } from 'react-i18next';
import DoneIcon from '@mui/icons-material/Done';

export interface AlertDialogProps {
  title: string;
  message: string;
  onClose: () => void;
}

function AlertDialog({ title, message, onClose }: AlertDialogProps) {
  const { t } = useTranslation('common');

  return (
    <Dialog open onClose={onClose} title={title} disableFullscreen>
      <Dialog.Content>
        <p dangerouslySetInnerHTML={{ __html: message }} />
      </Dialog.Content>
      <Dialog.Actions>
        <RoundedButton onClick={onClose} color="primary" startIcon={<DoneIcon />}>
          {t('common:confirm')}
        </RoundedButton>
      </Dialog.Actions>
    </Dialog>
  );
}

export default AlertDialog;
