import CreationFab from 'ui/elements/CreationFab';
import AccountDialog from 'ui/dialog/Account';
import AlertDialog from 'ui/dialog/Alert';
import ConfirmDialog from 'ui/dialog/Confirm';
import ExcelUploadDialog from 'ui/dialog/ExcelUpload';
import EndOfListItem from 'ui/elements/EndOfListItem';
import ListEmpty from 'ui/elements/ListEmpty';
import Loading from 'ui/elements/Loading';
import SelectionPanel from 'ui/elements/SelectionPanel';
import SubToolbar from 'ui/layouts/SubToolbar';
import VirtualInfiniteScroll from 'ui/modules/VirtualInfiniteScroll/VirtualInfiniteScroll';
import { AccountListItemHeight, ExcelVariant } from 'const';
import { useAuth } from 'features/auth/authHook';
import { useDialog } from 'features/dialog/dialogHook';
import { useScreenSize } from 'hooks/useScreenSize';
import { useSelection } from 'hooks/useSelection';
import Layout from 'ui/layouts/Layout';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from 'react-query';
import { BulkCreationResponse } from 'types/api';
import { downloadWorkbook } from 'utils/excel';
import { formatDigit } from 'utils/string';

import { IconButton, List, Tooltip } from '@mui/material';
import { Add, DeleteOutline, GetApp, Publish, Refresh } from '@mui/icons-material';

import { AccountDto, AccountFilter, CreateAccountDto } from 'features/account/interface';
import {
  useBulkCreateAccountMutation,
  useDeleteAccountsMutation,
  useDownloadAccounts,
  useInfiniteAccounts,
} from 'features/account/useAccounts';
import AccountListItem from './AccountListItem';
import AccountSearch from './AccountSearch';

function AccountPage() {
  const { t } = useTranslation('accounts');
  const [filter, setFilter] = useState<AccountFilter>({ accountName: '' });

  const { openDialog, closeDialog } = useDialog();
  const { isMobileLayout, isTabletLayout } = useScreenSize();
  const { canCreateAccounts, canDeleteAccounts } = useAuth();
  const { isFetching, data, loadMore } = useInfiniteAccounts(filter);
  const { isDownloading, download } = useDownloadAccounts(filter);

  const accounts =
    data?.pages.reduce((accs: AccountDto[], { rows }) => [...accs, ...rows], []) || [];
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

  const queryClient = useQueryClient();
  const { createAccounts } = useBulkCreateAccountMutation({
    queryClient,
    onSettled: ({ createdCount, failedList }: BulkCreationResponse<CreateAccountDto>) => {
      closeDialog();
      openDialog(
        <AlertDialog
          title={t('common:bulkCreationResult')}
          message={`${t('common:success')}: ${createdCount}<br>${t('common:fail')}: ${
            failedList.length
          }`}
          onClose={closeDialog}
        />,
      );
      if (failedList.length) {
        downloadWorkbook[ExcelVariant.ACCOUNT](failedList, t('common:bulkCreationResult'));
      }
    },
  });
  const { deleteAccounts, isDeleting } = useDeleteAccountsMutation({
    queryClient,
    onSuccess: () => {
      resetSelection();
    },
  });

  const itemCount = accounts.length + 1;
  const itemHeight =
    isMobileLayout || isTabletLayout ? AccountListItemHeight.MOBILE : AccountListItemHeight.LAPTOP;
  const searchResult = t('common:searchResult', {
    count: formatDigit(data?.pages[data.pages.length - 1].count || 0),
  } as any);

  const handleClickRefresh = () => queryClient.invalidateQueries('accounts');

  const handleToggleSelection = (account: AccountDto) => toggleSelection(account.id);

  const handleClickDeleteAll = () => {
    openDialog(
      <ConfirmDialog
        title={t('accounts:deleteAccount')}
        message={t('accounts:deleteAccountsConfirm', { count: selectedIds.length })}
        onClose={(isConfirmed: boolean) => {
          if (isConfirmed) deleteAccounts(selectedIds as number[]);
          closeDialog();
        }}
      />,
    );
  };

  const openAccountDialog = () => {
    openDialog(<AccountDialog onClose={closeDialog} />);
  };

  const openExcelUploadDialog = () => {
    openDialog(
      <ExcelUploadDialog
        variant={ExcelVariant.ACCOUNT}
        onSave={createAccounts}
        onClose={closeDialog}
      />,
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
      <EndOfListItem
        key="end-of-list"
        height={itemHeight}
        isLoading={isFetching}
        message={searchResult}
      />
    );
  };

  const selectModeButtons: JSX.Element[] = [];
  if (canDeleteAccounts) {
    selectModeButtons.push(
      <Tooltip key="delete-all" title={t('common:deleteAll') as string} placement="top">
        <IconButton onClick={handleClickDeleteAll} disabled={isDeleting}>
          {isDeleting && <Loading />}
          <DeleteOutline />
        </IconButton>
      </Tooltip>,
    );
  }

  let toolBarButtons: JSX.Element[] = [
    <Tooltip key="refresh" title={t('common:refresh') as string} placement="top">
      <IconButton onClick={handleClickRefresh}>
        <Refresh />
      </IconButton>
    </Tooltip>,
  ];
  if (canCreateAccounts) {
    toolBarButtons = [
      ...toolBarButtons,
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
    ];
  }
  toolBarButtons = [
    ...toolBarButtons,
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
      {!isMobileLayout && (
        <SubToolbar
          isSelectedAll={isSelectedAll}
          isIndeterminate={isIndeterminate}
          onToggleSelectAll={toggleSelectAll}
          onResetSelection={resetSelection}
          selectedCount={selectedIds.length}
          buttons={isSelectMode ? selectModeButtons : toolBarButtons}
        />
      )}
      <List style={{ height: isMobileLayout ? '100%' : 'calc(100% - 49px)' }} disablePadding>
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
          {canDeleteAccounts && (
            <SelectionPanel
              isOpen={isSelectMode}
              selectedCount={selectedIds.length}
              onClose={resetSelection}
            >
              <IconButton onClick={handleClickDeleteAll}>
                <DeleteOutline />
              </IconButton>
            </SelectionPanel>
          )}
          {canCreateAccounts && <CreationFab show={!isSelectMode} onClick={openAccountDialog} />}
        </>
      )}
    </Layout>
  );
}

export default AccountPage;
