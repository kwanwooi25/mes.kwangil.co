import AccountListItem, { AccountListItemSkeleton } from './AccountListItem';
import { AccountListItemHeight, DEFAULT_LIST_LIMIT, ExcelVariant } from 'const';
import { IconButton, List, Theme, Tooltip, createStyles, makeStyles } from '@material-ui/core';
import React, { ChangeEvent, useEffect, useState } from 'react';

import AccountDialog from 'components/dialog/Account';
import AddIcon from '@material-ui/icons/Add';
import ConfirmDialog from 'components/dialog/Confirm';
import { CreateAccountDto } from './interface';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import ExcelUploadDialog from 'components/dialog/ExcelUpload';
import GetAppIcon from '@material-ui/icons/GetApp';
import Loading from 'components/Loading';
import { Pagination } from '@material-ui/lab';
import PublishIcon from '@material-ui/icons/Publish';
import SubToolbar from 'components/SubToolbar';
import { accountApi } from './accountApi';
import { downloadWorkbook } from 'utils/excel';
import { useAccounts } from './accountHook';
import { useAppDispatch } from 'app/store';
import { useDialog } from 'features/dialog/dialogHook';
import { useScreenSize } from 'hooks/useScreenSize';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation('accounts');
  const classes = useStyles();

  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const { windowHeight } = useScreenSize();
  const { openDialog, closeDialog } = useDialog();
  const dispatch = useAppDispatch();
  const {
    isLoading,
    query,
    currentPage,
    totalPages,
    accounts,
    resetAccounts,
    getAccounts,
    selectedIds,
    selectAll,
    unselectAll,
    resetSelection,
    isSelectMode,
    deleteAccounts,
  } = useAccounts();

  const itemHeight = AccountListItemHeight.MD;
  const accountIds = accounts.map(({ id }) => id);
  const isSelectedAll =
    !!accountIds.length && !!selectedIds.length && accountIds.every((id) => selectedIds.includes(id));
  const isIndeterminate = !isSelectedAll && accountIds.some((id) => selectedIds.includes(id));

  const handleToggleSelectAll = (checked: boolean) => {
    dispatch(checked ? selectAll(accountIds) : unselectAll(accountIds));
  };

  const handleResetSelection = () => {
    dispatch(resetSelection());
  };

  const handleChangePage = (e: ChangeEvent<unknown>, value: number) => {
    const limit = query?.limit || DEFAULT_LIST_LIMIT;
    dispatch(resetAccounts());
    dispatch(getAccounts({ limit, offset: limit * value - limit }));
  };

  const handleClickCreate = () => {
    openDialog(<AccountDialog onClose={closeDialog} />);
  };

  const handleClickCreateBulk = () => {
    openDialog(
      <ExcelUploadDialog
        variant={ExcelVariant.ACCOUNT}
        onSave={async (dataToCreate: CreateAccountDto[]) => {
          try {
            await accountApi.createAccounts(dataToCreate);
            const limit = query?.limit || DEFAULT_LIST_LIMIT;
            dispatch(resetAccounts());
            dispatch(getAccounts({ limit, offset: 0 }));
            return true;
          } catch (error) {
            return false;
          }
        }}
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
          isConfirmed && dispatch(deleteAccounts(selectedIds));
          closeDialog();
        }}
      />
    );
  };

  useEffect(() => {
    const containerMaxHeight = windowHeight - (64 * 2 + 56);
    const limit = Math.floor(containerMaxHeight / itemHeight);
    dispatch(getAccounts({ offset: 0, limit }));

    return () => {
      dispatch(resetAccounts());
    };
  }, [windowHeight]);

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
