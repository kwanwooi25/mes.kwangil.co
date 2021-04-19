import { AccountListItemHeight, DEFAULT_LIST_LIMIT } from 'const';
import { IconButton, List, Theme, createStyles, makeStyles } from '@material-ui/core';
import React, { useEffect } from 'react';

import AccountDialog from 'components/dialog/Account';
import AccountListItem from './AccountListItem';
import ConfirmDialog from 'components/dialog/Confirm';
import CreationFab from 'components/CreationFab';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import EndOfListItem from 'components/EndOfListItem';
import ListEmpty from 'components/ListEmpty';
import SelectionPanel from 'components/SelectionPanel';
import VirtualInfiniteScroll from 'components/VirtualInfiniteScroll';
import { formatDigit } from 'utils/string';
import { useAccounts } from './accountHook';
import { useAppDispatch } from 'app/store';
import { useDialog } from 'features/dialog/dialogHook';
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
  const {
    query,
    isLoading,
    hasMore,
    totalCount,
    accounts,
    getAccounts,
    resetAccounts,
    isSelectMode,
    selectedIds,
    resetSelection,
    deleteAccounts,
  } = useAccounts();
  const { openDialog, closeDialog } = useDialog();

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
    dispatch(getAccounts({ limit: DEFAULT_LIST_LIMIT }));

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
