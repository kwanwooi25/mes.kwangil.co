import { Backdrop, CircularProgress, Theme, createStyles, makeStyles } from '@material-ui/core';

import React from 'react';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    backdrop: {
      position: 'absolute',
      zIndex: theme.zIndex.drawer + 1,
      color: theme.palette.primary.main,
      background: `${theme.palette.background.default}77`,
    },
  })
);

export interface LoadingProps {}

const Loading = (props: LoadingProps) => {
  const classes = useStyles();

  return (
    <Backdrop className={classes.backdrop} open>
      <CircularProgress color="inherit" />
    </Backdrop>
  );
};

export default Loading;
