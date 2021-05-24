import { useAppDispatch, useAppSelector } from 'app/store';
import AccountDialog from 'components/dialog/Account';
import ConfirmDialog from 'components/dialog/Confirm';
import ExcelUploadDialog from 'components/dialog/ExcelUpload';
import ListEmpty from 'components/ListEmpty';
import Loading from 'components/Loading';
import SubToolbar from 'components/SubToolbar';
import { AccountListItemHeight, DEFAULT_LIST_LIMIT, ExcelVariant, LoadingKeys } from 'const';
import { useDialog } from 'features/dialog/dialogHook';
import { useLoading } from 'features/loading/loadingHook';
import { useScreenSize } from 'hooks/useScreenSize';
import PaginatedList from 'layouts/PaginatedList';
import React, { ChangeEvent, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { downloadWorkbook } from 'utils/excel';

import { IconButton, Tooltip } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import GetAppIcon from '@material-ui/icons/GetApp';
import PublishIcon from '@material-ui/icons/Publish';

import { accountApi } from './accountApi';
import AccountListItem, { AccountListItemSkeleton } from './AccountListItem';
import { accountActions, accountSelectors } from './accountSlice';
import { CreateAccountDto } from './interface';

export interface PaginatedAccountListProps {}

const PaginatedAccountList = (props: PaginatedAccountListProps) => {
  const { t } = useTranslation('accounts');

  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const { windowHeight } = useScreenSize();
  const { openDialog, closeDialog } = useDialog();
  const { [LoadingKeys.GET_ACCOUNTS]: isLoading } = useLoading();

  const dispatch = useAppDispatch();
  const query = useAppSelector(accountSelectors.query);
  const { ids, currentPage, totalPages } = useAppSelector(accountSelectors.pagination);
  const accounts = useAppSelector(accountSelectors.paginatedAccounts);
  const isSelectMode = useAppSelector(accountSelectors.isSelectMode);
  const selectedIds = useAppSelector(accountSelectors.selectedIds);
  const {
    getList,
    resetList,
    resetListOnPage,
    resetSelection,
    deleteAccounts,
    selectAll,
    unselectAll,
    createAccounts,
  } = accountActions;

  const itemHeight = AccountListItemHeight.TABLET;
  const isSelectedAll = !!ids.length && !!selectedIds.length && ids.every((id) => selectedIds.includes(id));
  const isIndeterminate = !isSelectedAll && ids.some((id) => selectedIds.includes(id));

  const handleToggleSelectAll = (checked: boolean) => {
    dispatch(checked ? selectAll(ids) : unselectAll(ids));
  };

  const handleResetSelection = () => {
    dispatch(resetSelection());
  };

  const handleChangePage = (e: ChangeEvent<unknown>, value: number) => {
    const limit = query?.limit || DEFAULT_LIST_LIMIT;
    dispatch(resetListOnPage());
    dispatch(getList({ ...query, offset: limit * value - limit }));
  };

  const handleClickCreate = () => {
    openDialog(<AccountDialog onClose={closeDialog} />);
  };

  const handleClickCreateBulk = () => {
    openDialog(
      <ExcelUploadDialog
        variant={ExcelVariant.ACCOUNT}
        onSave={(accounts: CreateAccountDto[]) => dispatch(createAccounts(accounts))}
        onClose={closeDialog}
      />
    );
  };

  const handleClickDownload = async () => {
    setIsDownloading(true);
    const { rows } = await accountApi.getAllAccounts(query.searchText);
    downloadWorkbook[ExcelVariant.ACCOUNT](rows, t('accountList'));
    setIsDownloading(false);
  };

  const handleClickDeleteAll = () => {
    openDialog(
      <ConfirmDialog
        title={t('deleteAccount')}
        message={t('deleteAccountsConfirm', { count: selectedIds.length })}
        onClose={(isConfirmed: boolean) => {
          isConfirmed && dispatch(deleteAccounts(selectedIds as number[]));
          closeDialog();
        }}
      />
    );
  };

  useEffect(() => {
    const containerMaxHeight = windowHeight - (64 * 2 + 56);
    const limit = Math.floor(containerMaxHeight / itemHeight);
    dispatch(getList({ offset: 0, limit }));

    return () => {
      dispatch(resetList());
    };
  }, [windowHeight, itemHeight]);

  return (
    <>
      <SubToolbar
        isSelectedAll={isSelectedAll}
        isIndeterminate={isIndeterminate}
        onToggleSelectAll={handleToggleSelectAll}
        onResetSelection={handleResetSelection}
        selectedCount={selectedIds.length}
        buttons={
          isSelectMode ? (
            <Tooltip title={t('common:deleteAll') as string} placement="top">
              <IconButton onClick={handleClickDeleteAll}>
                <DeleteOutlineIcon />
              </IconButton>
            </Tooltip>
          ) : (
            [
              <Tooltip key="add-account" title={t('addAccount') as string} placement="top">
                <IconButton onClick={handleClickCreate}>
                  <AddIcon />
                </IconButton>
              </Tooltip>,
              <Tooltip key="add-account-bulk" title={t('common:createBulk') as string} placement="top">
                <IconButton onClick={handleClickCreateBulk}>
                  <PublishIcon />
                </IconButton>
              </Tooltip>,
              <Tooltip key="download-accounts" title={t('common:downloadExcel') as string} placement="top">
                <IconButton onClick={handleClickDownload} disabled={isDownloading}>
                  {isDownloading && <Loading />}
                  <GetAppIcon />
                </IconButton>
              </Tooltip>,
            ]
          )
        }
      />
      <PaginatedList
        height={(query.limit || DEFAULT_LIST_LIMIT) * itemHeight}
        showPagination={!!accounts.length}
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={handleChangePage}
      >
        {isLoading ? (
          Array(query.limit)
            .fill('')
            .map((_, index) => <AccountListItemSkeleton key={index} itemHeight={itemHeight} />)
        ) : !accounts.length ? (
          <ListEmpty />
        ) : (
          accounts.map((account) => (
            <AccountListItem
              key={account.id}
              account={account}
              itemHeight={itemHeight}
              isSelected={selectedIds.includes(account.id)}
            />
          ))
        )}
      </PaginatedList>
    </>
  );
};

export default PaginatedAccountList;
