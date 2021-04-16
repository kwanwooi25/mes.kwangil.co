import { Button, CircularProgress, Theme, createStyles, makeStyles } from '@material-ui/core';
import React, { memo } from 'react';

import { useTranslation } from 'react-i18next';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    endOfListItem: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
  })
);

export interface EndOfListItemProps {
  height?: 'auto' | number;
  isLoading?: boolean;
  hasMore?: boolean;
  onClickLoadMore?: () => void;
  message?: string;
}

const EndOfListItem = ({
  height = 'auto',
  isLoading = false,
  hasMore = false,
  onClickLoadMore = () => {},
  message = 'End of list',
}: EndOfListItemProps) => {
  const { t } = useTranslation('common');
  const classes = useStyles();

  return (
    <div className={classes.endOfListItem} style={{ height }}>
      {isLoading ? (
        <CircularProgress color="primary" />
      ) : hasMore ? (
        <Button disableElevation onClick={onClickLoadMore}>
          {t('loadMore')}
        </Button>
      ) : (
        <p dangerouslySetInnerHTML={{ __html: message }} />
      )}
    </div>
  );
};

export default memo(EndOfListItem);
