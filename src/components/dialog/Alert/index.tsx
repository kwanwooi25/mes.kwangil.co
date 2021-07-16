import RoundedButton from 'components/RoundedButton';
import Dialog from 'features/dialog/Dialog';
import React from 'react';
import { useTranslation } from 'react-i18next';

import {
    createStyles, DialogActions, DialogContent, makeStyles, Theme, Typography
} from '@material-ui/core';
import DoneIcon from '@material-ui/icons/Done';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    buttons: {
      padding: theme.spacing(2, 3),
    },
  })
);

export interface AlertDialogProps {
  title: string;
  message: string;
  onClose: () => void;
}

const AlertDialog = ({ title, message, onClose }: AlertDialogProps) => {
  const { t } = useTranslation('common');
  const classes = useStyles();

  return (
    <Dialog open onClose={onClose} title={title} disableFullscreen>
      <DialogContent>
        <Typography dangerouslySetInnerHTML={{ __html: message }} />
      </DialogContent>
      <DialogActions className={classes.buttons}>
        <RoundedButton onClick={onClose} color="primary" startIcon={<DoneIcon />}>
          {t('common:confirm')}
        </RoundedButton>
      </DialogActions>
    </Dialog>
  );
};

export default AlertDialog;
