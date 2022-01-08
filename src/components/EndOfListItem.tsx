import { CircularProgress, createStyles, makeStyles } from '@material-ui/core';
import React, { memo } from 'react';

const useStyles = makeStyles(() =>
  createStyles({
    endOfListItem: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
  }),
);

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
  const classes = useStyles();

  return (
    <div className={classes.endOfListItem} style={{ height }}>
      {isLoading ? (
        <CircularProgress color="primary" />
      ) : (
        <p dangerouslySetInnerHTML={{ __html: message }} />
      )}
    </div>
  );
}

export default memo(EndOfListItem);
