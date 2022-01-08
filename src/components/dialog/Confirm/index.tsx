import {
  DialogActions,
  DialogContent,
  Theme,
  Typography,
  createStyles,
  makeStyles,
} from '@material-ui/core';

import CloseIcon from '@material-ui/icons/Close';
import Dialog from 'features/dialog/Dialog';
import DoneIcon from '@material-ui/icons/Done';
import React from 'react';
import RoundedButton from 'components/RoundedButton';
import { useTranslation } from 'react-i18next';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    buttons: {
      padding: theme.spacing(2, 3),
    },
  }),
);

export interface ConfirmDialogProps {
  title: string;
  message: string;
  onClose: (isConfirmed: boolean) => void;
}

function ConfirmDialog({ title, message, onClose }: ConfirmDialogProps) {
  const { t } = useTranslation('accounts');
  const classes = useStyles();

  const handleClose = (isConfirmed: boolean) => () => onClose(isConfirmed);

  return (
    <Dialog open onClose={handleClose(false)} title={title} disableFullscreen>
      <DialogContent>
        <Typography dangerouslySetInnerHTML={{ __html: message }} />
      </DialogContent>
      <DialogActions className={classes.buttons}>
        <RoundedButton onClick={handleClose(false)} variant="outlined" startIcon={<CloseIcon />}>
          {t('common:cancel')}
        </RoundedButton>
        <RoundedButton onClick={handleClose(true)} color="primary" startIcon={<DoneIcon />}>
          {t('common:confirm')}
        </RoundedButton>
      </DialogActions>
    </Dialog>
  );
}

export default ConfirmDialog;
