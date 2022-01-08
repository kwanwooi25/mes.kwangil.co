import { List, Theme, createStyles, makeStyles } from '@material-ui/core';
import React, { ChangeEvent, ReactElement } from 'react';

import { Pagination } from '@material-ui/lab';
import classNames from 'classnames';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    listContainer: {
      // MainHeader + SubToolbar + Pagination + Pagination margins (top/bottom)
      height: `calc(100vh - ${64 + 64 + 40 + 12 + 12}px)`,
      marginBottom: theme.spacing(3),
      position: 'relative',
    },
    pagination: {
      display: 'flex',
      justifyContent: 'center',
    },
  }),
);

export interface PaginatedListProps {
  children: ReactElement | ReactElement[];
  className?: string;
  height?: number;
  showPagination?: boolean;
  totalPages: number;
  currentPage: number;
  onPageChange: (e: ChangeEvent<unknown>, value: number) => void;
}

function PaginatedList({
  children,
  className,
  height,
  showPagination = false,
  totalPages,
  currentPage,
  onPageChange,
}: PaginatedListProps) {
  const classes = useStyles();

  return (
    <>
      <div className={classNames([classes.listContainer, className])} style={{ height }}>
        <List disablePadding>{children}</List>
      </div>
      <div className={classes.pagination}>
        {showPagination && (
          <Pagination
            size="large"
            count={totalPages}
            page={currentPage}
            onChange={onPageChange}
            showFirstButton
            showLastButton
          />
        )}
      </div>
    </>
  );
}

export default PaginatedList;
