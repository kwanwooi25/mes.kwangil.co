import { AccountListItemHeight, DEFAULT_LIST_LIMIT } from 'const';
import { List, Theme, createStyles, makeStyles } from '@material-ui/core';
import React, { useEffect } from 'react';

import AccountListItem from './AccountListItem';
import EndOfListItem from 'components/EndOfListItem';
import VirtualScroll from 'components/VirtualScroll';
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
      <EndOfListItem
        key="end-of-list"
        height={itemHeight}
        isLoading={isLoading}
        hasMore={hasMore}
        onClickLoadMore={loadMore}
        message={searchResult}
      />
    );
  };

  useEffect(() => {
    const getAccountsPromise = dispatch(getAccounts());

    return () => {
      getAccountsPromise.abort();
      dispatch(resetAccounts());
    };
  }, []);

  return (
    <List className={classes.mobileAccountList} disablePadding>
      <VirtualScroll itemCount={itemCount} itemHeight={itemHeight} renderItem={renderItem} />;
    </List>
  );
};

export default MobileAccountList;
