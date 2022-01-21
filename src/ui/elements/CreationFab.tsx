import { Fab, Slide } from '@mui/material';

import AddIcon from '@mui/icons-material/Add';
import React from 'react';

export interface CreationFabProps {
  show?: boolean;
  onClick: () => void;
}

function CreationFab({ show = true, onClick }: CreationFabProps) {
  return (
    <Slide in={show} direction="up">
      <Fab className="!fixed right-10 bottom-10" color="primary" onClick={onClick}>
        <AddIcon />
      </Fab>
    </Slide>
  );
}

export default CreationFab;
