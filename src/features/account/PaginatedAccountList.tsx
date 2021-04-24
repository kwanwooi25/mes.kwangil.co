import AccountListItem, { AccountListItemSkeleton } from './AccountListItem';
import { AccountListItemHeight, DEFAULT_LIST_LIMIT, ExcelVariant, LoadingKeys } from 'const';
import { IconButton, List, Theme, Tooltip, createStyles, makeStyles } from '@material-ui/core';
import React, { ChangeEvent, useEffect, useState } from 'react';
import { accountActions, accountSelectors } from './accountSlice';
import { useAppDispatch, useAppSelector } from 'app/store';

import AccountDialog from 'components/dialog/Account';
import AddIcon from '@material-ui/icons/Add';
import ConfirmDialog from 'components/dialog/Confirm';
import { CreateAccountDto } from './interface';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import ExcelUploadDialog from 'components/dialog/ExcelUpload';
import GetAppIcon from '@material-ui/icons/GetApp';
import ListEmpty from 'components/ListEmpty';
import Loading from 'components/Loading';
import { Pagination } from '@material-ui/lab';
import PublishIcon from '@material-ui/icons/Publish';
import SubToolbar from 'components/SubToolbar';
import { accountApi } from './accountApi';
import { downloadWorkbook } from 'utils/excel';
import { useDialog } from 'features/dialog/dialogHook';
import { useLoading } from 'features/loading/loadingHook';
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
  const { [LoadingKeys.GET_ACCOUNTS]: isLoading } = useLoading();

  const dispatch = useAppDispatch();
  const query = useAppSelector(accountSelectors.query);
  const ids = useAppSelector(accountSelectors.ids);
  const accounts = useAppSelector(accountSelectors.accounts);
  const currentPage = useAppSelector(accountSelectors.currentPage);
  const totalPages = useAppSelector(accountSelectors.totalPages);
  const isSelectMode = useAppSelector(accountSelectors.isSelectMode);
  const selectedIds = useAppSelector(accountSelectors.selectedIds);
  const {
    getList: getAccounts,
    resetList: resetAccounts,
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
      <div className={classes.listContainer} style={{ height: (query.limit || DEFAULT_LIST_LIMIT) * itemHeight }}>
        <List disablePadding>
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
        </List>
      </div>
      <div className={classes.paginationContainer}>
        {!!accounts.length && (
          <Pagination
            size="large"
            count={totalPages}
            page={currentPage}
            onChange={handleChangePage}
            showFirstButton
            showLastButton
          />
        )}
      </div>
    </>
  );
};

export default PaginatedAccountList;
