import classNames from 'classnames';
import { useScreenSize } from 'hooks/useScreenSize';
import React from 'react';

import CloseIcon from '@mui/icons-material/Close';
import {
  Dialog as MuiDialog,
  DialogActions as MuiDialogActions,
  DialogActionsProps,
  DialogContent as MuiDialogContent,
  DialogContentProps,
  DialogProps as MuiDialogProps,
  DialogTitle,
  IconButton,
} from '@mui/material';

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
          <h6 className="text-2xl">{title}</h6>
          {subTitle && <span className="text-xs">{subTitle}</span>}
        </div>
        <IconButton aria-label="close" onClick={handleClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      {props.children}
    </MuiDialog>
  );
}

function DialogContent({ children, className, ...props }: DialogContentProps) {
  return (
    <MuiDialogContent className={classNames('!px-6 !py-4', className)} {...props}>
      {children}
    </MuiDialogContent>
  );
}

function DialogActions({ children, className, ...props }: DialogActionsProps) {
  return (
    <MuiDialogActions className={classNames('!px-6 !py-4', className)} {...props}>
      {children}
    </MuiDialogActions>
  );
}

Dialog.Content = DialogContent;
Dialog.Actions = DialogActions;

export default Dialog;
