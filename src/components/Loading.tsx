import { CircularProgress, CircularProgressProps } from '@mui/material';

import React from 'react';

export interface LoadingProps extends CircularProgressProps {}

function Loading(props: LoadingProps) {
  return (
    <div className="flex absolute inset-0 z-[9999] justify-center items-center bg-white/40">
      <CircularProgress color="primary" {...props} />
    </div>
  );
}

export default Loading;
