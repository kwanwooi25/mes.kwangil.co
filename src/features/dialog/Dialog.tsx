import {
  DialogTitle,
  IconButton,
  Dialog as MuiDialog,
  DialogProps as MuiDialogProps,
  Theme,
  Typography,
  createStyles,
  makeStyles,
} from '@material-ui/core';

import CloseIcon from '@material-ui/icons/Close';
import React from 'react';
import classnames from 'classnames';
import { useScreenSize } from 'hooks/useScreenSize';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    dialogPaper: {
      borderRadius: theme.spacing(2),
    },
    fullHeight: {
      height: '100%',
    },
    dialogHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    dialogTitle: {
      display: 'flex',
      flexDirection: 'column',
    },
  }),
);

export interface DialogProps extends MuiDialogProps {
  title: string;
  subTitle?: string;
  disableFullscreen?: boolean;
  onClose?: () => void;
  fullHeight?: boolean;
}

function Dialog({
  title,
  subTitle,
  disableFullscreen = false,
  onClose,
  fullHeight,
  ...props
}: DialogProps) {
  const classes = useStyles();
  const { isMobileLayout } = useScreenSize();
  const isFullscreen = !disableFullscreen && isMobileLayout;

  const handleClose = () => onClose && onClose();

  return (
    <MuiDialog
      fullWidth
      fullScreen={isFullscreen}
      {...props}
      classes={{
        paper: classnames([classes.dialogPaper, fullHeight ? classes.fullHeight : undefined]),
      }}
    >
      <DialogTitle disableTypography className={classes.dialogHeader}>
        <div className={classes.dialogTitle}>
          <Typography variant="h6">{title}</Typography>
          {subTitle && <Typography variant="caption">{subTitle}</Typography>}
        </div>
        <IconButton aria-label="close" onClick={handleClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      {props.children}
    </MuiDialog>
  );
}

export default Dialog;
