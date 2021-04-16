import AccountListItem, { AccountListItemSkeleton } from './AccountListItem';
import { AccountListItemHeight, DEFAULT_LIST_LIMIT } from 'const';
import { List, Theme, createStyles, makeStyles } from '@material-ui/core';
import React, { ChangeEvent, useEffect } from 'react';

import { Pagination } from '@material-ui/lab';
import SubToolbar from 'components/SubToolbar';
import { useAccounts } from 'features/account/accountHook';
import { useScreenSize } from 'hooks/useScreenSize';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    listContainer: {
      height: `calc(100vh - ${64 * 2 + 56}px)`,
      marginBottom: 8,
      position: 'relative',
    },
    paginationContainer: {
      display: 'flex',
      justifyContent: 'center',
    },
  })
);

export interface PaginatedAccountListProps {}

const PaginatedAccountList = (props: PaginatedAccountListProps) => {
  const classes = useStyles();
  const { windowHeight } = useScreenSize();

  const {
    isLoading,
    query,
    currentPage,
    totalPages,
    accounts,
    resetAccounts,
    getAccounts,
    selectedIds,
  } = useAccounts();

  const itemHeight = AccountListItemHeight.MD;

  const handleChangePage = (e: ChangeEvent<unknown>, value: number) => {
    const limit = query?.limit || DEFAULT_LIST_LIMIT;
    resetAccounts();
    getAccounts({ limit, offset: limit * value - limit });
  };

  useEffect(() => {
    resetAccounts();
    const containerMaxHeight = windowHeight - (64 * 2 + 56);
    const limit = Math.floor(containerMaxHeight / itemHeight);
    getAccounts({ limit });
  }, []);

  return (
    <>
      <SubToolbar />
      <div className={classes.listContainer} style={{ height: (query.limit || DEFAULT_LIST_LIMIT) * itemHeight }}>
        <List disablePadding>
          {isLoading
            ? Array(query.limit)
                .fill('')
                .map((_, index) => <AccountListItemSkeleton key={index} itemHeight={itemHeight} />)
            : accounts.map((account) => (
                <AccountListItem
                  key={account.id}
                  account={account}
                  itemHeight={itemHeight}
                  isSelected={selectedIds.includes(account.id)}
                />
              ))}
        </List>
      </div>
      <div className={classes.paginationContainer}>
        <Pagination
          size="large"
          count={totalPages}
          page={currentPage}
          onChange={handleChangePage}
          showFirstButton
          showLastButton
        />
      </div>
    </>
  );
};

export default PaginatedAccountList;
