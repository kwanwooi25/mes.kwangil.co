import { AccountListItemHeight, DEFAULT_LIST_LIMIT } from 'const';
import { List, Theme, createStyles, makeStyles } from '@material-ui/core';
import React, { useEffect } from 'react';

import AccountListItem from './AccountListItem';
import EndOfListItem from 'components/EndOfListItem';
import VirtualInfiniteScroll from 'components/VirtualInfiniteScroll';
import { formatDigit } from 'utils/string';
import { useAccounts } from './accountHook';
import { useAppDispatch } from 'app/store';
import { useTranslation } from 'react-i18next';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    mobileAccountList: {
      height: '100%',
    },
  })
);

export interface MobileAccountListProps {}

const MobileAccountList = (props: MobileAccountListProps) => {
  const { t } = useTranslation('common');
  const classes = useStyles();
  const dispatch = useAppDispatch();
  const { query, isLoading, hasMore, totalCount, accounts, getAccounts, resetAccounts, selectedIds } = useAccounts();

  const itemCount = accounts.length + 1;
  const itemHeight = AccountListItemHeight.XS;

  const searchResult = t('searchResult', { count: formatDigit(totalCount) } as any);

  const loadMore = () => {
    if (hasMore) {
      dispatch(
        getAccounts({
          ...query,
          offset: (query.offset || 0) + (query.limit || DEFAULT_LIST_LIMIT),
        })
      );
    }
  };

  const renderItem = (index: number) => {
    const account = accounts[index];

    return account ? (
      <AccountListItem
        key={account.id}
        account={account}
        itemHeight={itemHeight}
        isSelected={selectedIds.includes(account.id)}
      />
    ) : (
      <EndOfListItem key="end-of-list" height={itemHeight} isLoading={isLoading} message={searchResult} />
    );
  };

  useEffect(() => {
    dispatch(getAccounts({ limit: DEFAULT_LIST_LIMIT }));

    return () => {
      dispatch(resetAccounts());
    };
  }, []);

  return (
    <List className={classes.mobileAccountList} disablePadding>
      <VirtualInfiniteScroll
        itemCount={itemCount}
        itemHeight={itemHeight}
        renderItem={renderItem}
        onLoadMore={loadMore}
      />
      ;
    </List>
  );
};

export default MobileAccountList;
