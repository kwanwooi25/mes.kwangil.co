import { AccountListItemHeight, DEFAULT_LIST_LIMIT, LoadingKeys } from 'const';
import { IconButton, List, Theme, createStyles, makeStyles } from '@material-ui/core';
import React, { useEffect } from 'react';
import { accountActions, accountSelectors } from './accountSlice';
import { useAppDispatch, useAppSelector } from 'app/store';

import AccountDialog from 'components/dialog/Account';
import AccountListItem from './AccountListItem';
import ConfirmDialog from 'components/dialog/Confirm';
import CreationFab from 'components/CreationFab';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import EndOfListItem from 'components/EndOfListItem';
import { GetAccountsQuery } from './interface';
import ListEmpty from 'components/ListEmpty';
import SelectionPanel from 'components/SelectionPanel';
import VirtualInfiniteScroll from 'components/VirtualInfiniteScroll';
import { formatDigit } from 'utils/string';
import { useDialog } from 'features/dialog/dialogHook';
import { useLoading } from 'features/loading/loadingHook';
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
  const { [LoadingKeys.GET_ACCOUNTS]: isLoading } = useLoading();
  const { openDialog, closeDialog } = useDialog();
  const query = useAppSelector(accountSelectors.query);
  const hasMore = useAppSelector(accountSelectors.hasMore);
  const totalCount = useAppSelector(accountSelectors.totalCount);
  const accounts = useAppSelector(accountSelectors.accounts);
  const isSelectMode = useAppSelector(accountSelectors.isSelectMode);
  const selectedIds = useAppSelector(accountSelectors.selectedIds);
  const { getList: getAccounts, resetList: resetAccounts, resetSelection, deleteAccounts } = accountActions;

  const itemCount = accounts.length + 1;
  const itemHeight = AccountListItemHeight.XS;

  const searchResult = t('searchResult', { count: formatDigit(totalCount) } as any);

  const loadMore = () => {
    if (hasMore) {
      const offset = (query.offset || 0) + (query.limit || DEFAULT_LIST_LIMIT);
      dispatch(getAccounts({ ...query, offset }));
    }
  };

  const handleCloseSelectionPanel = () => {
    dispatch(resetSelection());
  };

  const handleClickDeleteAll = () => {
    openDialog(
      <ConfirmDialog
        title={t('accounts:deleteAccount')}
        message={t('accounts:deleteAccountsConfirm', { count: selectedIds.length })}
        onClose={(isConfirmed: boolean) => {
          isConfirmed && dispatch(deleteAccounts(selectedIds));
          closeDialog();
        }}
      />
    );
  };

  const openAccountDialog = () => {
    openDialog(<AccountDialog onClose={closeDialog} />);
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
    dispatch(getAccounts({ limit: DEFAULT_LIST_LIMIT } as GetAccountsQuery));

    return () => {
      dispatch(resetAccounts());
    };
  }, []);

  return (
    <>
      <List className={classes.mobileAccountList} disablePadding>
        {!isLoading && !accounts.length ? (
          <ListEmpty />
        ) : (
          <VirtualInfiniteScroll
            itemCount={itemCount}
            itemHeight={itemHeight}
            renderItem={renderItem}
            onLoadMore={loadMore}
          />
        )}
      </List>
      <SelectionPanel isOpen={isSelectMode} selectedCount={selectedIds.length} onClose={handleCloseSelectionPanel}>
        <IconButton onClick={handleClickDeleteAll}>
          <DeleteOutlineIcon />
        </IconButton>
      </SelectionPanel>
      <CreationFab show={!isSelectMode} onClick={openAccountDialog} />
    </>
  );
};

export default MobileAccountList;
