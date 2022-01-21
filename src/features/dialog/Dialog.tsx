import {
  DialogTitle,
  IconButton,
  Dialog as MuiDialog,
  DialogProps as MuiDialogProps,
  DialogContent,
  DialogContentProps,
  DialogActions,
  DialogActionsProps,
  Typography,
} from '@mui/material';

import CloseIcon from '@mui/icons-material/Close';
import React from 'react';
import classNames from 'classnames';
import { useScreenSize } from 'hooks/useScreenSize';

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
  const { isMobileLayout } = useScreenSize();
  const isFullscreen = !disableFullscreen && isMobileLayout;

  const handleClose = () => onClose && onClose();

  return (
    <MuiDialog
      fullWidth
      fullScreen={isFullscreen}
      {...props}
      classes={{
        paper: classNames('!rounded-xl', fullHeight && 'h-full'),
      }}
      onClose={handleClose}
    >
      <DialogTitle className="flex justify-between items-center">
        <div className="flex flex-col">
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

Dialog.Content = function ({ children, className, ...props }: DialogContentProps) {
  return (
    <DialogContent className={classNames('!px-6 !py-4', className)} {...props}>
      {children}
    </DialogContent>
  );
};

Dialog.Actions = function ({ children, className, ...props }: DialogActionsProps) {
  return (
    <DialogActions className={classNames('!px-6 !py-4', className)} {...props}>
      {children}
    </DialogActions>
  );
};

export default Dialog;
