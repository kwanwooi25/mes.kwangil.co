import { CircularProgress } from '@mui/material';
import React, { memo } from 'react';

export interface EndOfListItemProps {
  height?: 'auto' | number;
  isLoading?: boolean;
  message?: string;
}

function EndOfListItem({
  height = 'auto',
  isLoading = false,
  message = 'End of list',
}: EndOfListItemProps) {
  return (
    <div className="flex justify-center items-center" style={{ height }}>
      {isLoading ? (
        <CircularProgress color="primary" />
      ) : (
        <p dangerouslySetInnerHTML={{ __html: message }} />
      )}
    </div>
  );
}

export default memo(EndOfListItem);
