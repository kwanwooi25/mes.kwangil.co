import CreationFab from 'components/CreationFab';
import AccountDialog from 'components/dialog/Account';
import ConfirmDialog from 'components/dialog/Confirm';
import ExcelUploadDialog from 'components/dialog/ExcelUpload';
import EndOfListItem from 'components/EndOfListItem';
import ListEmpty from 'components/ListEmpty';
import Loading from 'components/Loading';
import SelectionPanel from 'components/SelectionPanel';
import SubToolbar from 'components/SubToolbar';
import VirtualInfiniteScroll from 'components/VirtualInfiniteScroll';
import { AccountListItemHeight, ExcelVariant } from 'const';
import { useDialog } from 'features/dialog/dialogHook';
import {
    useBulkCreateAccountMutation, useDeleteAccountsMutation, useDownloadAccounts,
    useInfiniteAccounts
} from 'hooks/useAccounts';
import { useScreenSize } from 'hooks/useScreenSize';
import { useSelection } from 'hooks/useSelection';
import Layout from 'layouts/Layout';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from 'react-query';
import { formatDigit } from 'utils/string';

import { IconButton, List, Tooltip } from '@material-ui/core';
import { Add, DeleteOutline, GetApp, Publish } from '@material-ui/icons';

import AccountListItem from './AccountListItem';
import AccountSearch from './AccountSearch';
import { AccountDto, AccountFilter } from './interface';

export interface AccountPageProps {}

const AccountPage = (props: AccountPageProps) => {
  const { t } = useTranslation('accounts');
  const [filter, setFilter] = useState<AccountFilter>({ accountName: '' });

  const { openDialog, closeDialog } = useDialog();
  const { isMobileLayout, isTabletLayout, isDesktopLayout } = useScreenSize();
  const { isFetching, data, fetchNextPage, hasNextPage } = useInfiniteAccounts(filter);
  const { isDownloading, download } = useDownloadAccounts(filter);

  const queryClient = useQueryClient();
  const { createAccounts, isCreating } = useBulkCreateAccountMutation({ queryClient });
  const { deleteAccounts, isDeleting } = useDeleteAccountsMutation({
    queryClient,
    onSuccess: () => {
      resetSelection();
    },
  });

  const accounts = data?.pages.reduce((accounts: AccountDto[], { rows }) => [...accounts, ...rows], []) || [];
  const accountIds = accounts.map(({ id }) => id);
  const {
    selectedIds,
    isSelectMode,
    isSelectedAll,
    isIndeterminate,
    toggleSelection,
    toggleSelectAll,
    resetSelection,
  } = useSelection(accountIds);

  const itemCount = accounts.length + 1;
  const itemHeight = isTabletLayout ? AccountListItemHeight.TABLET : AccountListItemHeight.MOBILE;
  const searchResult = t('common:searchResult', {
    count: formatDigit(data?.pages[data.pages.length - 1].count || 0),
  } as any);

  const loadMore = () => hasNextPage && !isFetching && fetchNextPage();

  const handleToggleSelection = (account: AccountDto) => toggleSelection(account.id);

  const handleClickDeleteAll = () => {
    openDialog(
      <ConfirmDialog
        title={t('accounts:deleteAccount')}
        message={t('accounts:deleteAccountsConfirm', { count: selectedIds.length })}
        onClose={(isConfirmed: boolean) => {
          isConfirmed && deleteAccounts(selectedIds as number[]);
          closeDialog();
        }}
      />
    );
  };

  const openAccountDialog = () => {
    openDialog(<AccountDialog onClose={closeDialog} />);
  };

  const openExcelUploadDialog = () => {
    openDialog(
      <ExcelUploadDialog
        variant={ExcelVariant.ACCOUNT}
        isUploading={isCreating}
        onSave={(data) => {
          createAccounts(data).then(() => closeDialog());
        }}
        onClose={closeDialog}
      />
    );
  };

  const downloadExcel = () => {
    download(t('accountList'));
  };

  const renderItem = (index: number) => {
    const account = accounts[index];

    return account ? (
      <AccountListItem
        key={account.id}
        account={account}
        itemHeight={itemHeight}
        toggleSelection={handleToggleSelection}
        isSelected={selectedIds.includes(account.id)}
        filter={filter}
      />
    ) : (
      <EndOfListItem key="end-of-list" height={itemHeight} isLoading={isFetching} message={searchResult} />
    );
  };

  const selectModeButtons = [
    <Tooltip key="delete-all" title={t('common:deleteAll') as string} placement="top">
      <IconButton onClick={handleClickDeleteAll} disabled={isDeleting}>
        {isDeleting && <Loading />}
        <DeleteOutline />
      </IconButton>
    </Tooltip>,
  ];

  const toolBarButtons = [
    <Tooltip key="add-account" title={t('addAccount') as string} placement="top">
      <IconButton onClick={openAccountDialog}>
        <Add />
      </IconButton>
    </Tooltip>,
    <Tooltip key="add-account-bulk" title={t('common:createBulk') as string} placement="top">
      <IconButton onClick={openExcelUploadDialog}>
        <Publish />
      </IconButton>
    </Tooltip>,
    <Tooltip key="download-accounts" title={t('common:downloadExcel') as string} placement="top">
      <span>
        <IconButton onClick={downloadExcel} disabled={isDownloading}>
          {isDownloading && <Loading />}
          <GetApp />
        </IconButton>
      </span>
    </Tooltip>,
  ];

  useEffect(() => {
    resetSelection();
  }, [filter]);

  return (
    <Layout
      pageTitle={t('pageTitle')}
      SearchPanelContent={<AccountSearch filter={filter} onChange={setFilter} />}
      searchPanelTitle={`${t('common:account')} ${t('common:search')}`}
    >
      {(isTabletLayout || isDesktopLayout) && (
        <SubToolbar
          isSelectedAll={isSelectedAll}
          isIndeterminate={isIndeterminate}
          onToggleSelectAll={toggleSelectAll}
          onResetSelection={resetSelection}
          selectedCount={selectedIds.length}
          buttons={isSelectMode ? selectModeButtons : toolBarButtons}
        />
      )}
      <List style={{ height: isMobileLayout ? '100%' : 'calc(100% - 65px)' }} disablePadding>
        {!isFetching && !accounts.length ? (
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
      {isMobileLayout && (
        <>
          <SelectionPanel isOpen={isSelectMode} selectedCount={selectedIds.length} onClose={resetSelection}>
            <IconButton onClick={handleClickDeleteAll}>
              <DeleteOutline />
            </IconButton>
          </SelectionPanel>
          <CreationFab show={!isSelectMode} onClick={openAccountDialog} />
        </>
      )}
    </Layout>
  );
};

export default AccountPage;
