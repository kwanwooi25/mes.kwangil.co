import { Theme, createStyles, makeStyles } from '@material-ui/core';

import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import React from 'react';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    yes: {
      color: theme.palette.success.main,
    },
  }),
);

export interface BooleanIconProps {
  value: boolean;
  size?: 'default' | 'inherit' | 'large' | 'small';
}

function BooleanIcon({ value, size = 'default' }: BooleanIconProps) {
  const classes = useStyles();
  return value ? (
    <CheckCircleOutlineIcon className={classes.yes} fontSize={size} />
  ) : (
    <HighlightOffIcon color="error" fontSize={size} />
  );
}

export default BooleanIcon;
