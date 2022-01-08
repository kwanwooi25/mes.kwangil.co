import { Fab, Slide, Theme, createStyles, makeStyles } from '@material-ui/core';

import AddIcon from '@material-ui/icons/Add';
import React from 'react';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    fab: {
      position: 'fixed',
      right: theme.spacing(2),
      bottom: theme.spacing(2),
      zIndex: theme.zIndex.speedDial,
    },
  }),
);

export interface CreationFabProps {
  show?: boolean;
  onClick: () => void;
}

function CreationFab({ show = true, onClick }: CreationFabProps) {
  const classes = useStyles();

  return (
    <Slide in={show} direction="up">
      <Fab className={classes.fab} color="primary" onClick={onClick}>
        <AddIcon />
      </Fab>
    </Slide>
  );
}

export default CreationFab;
