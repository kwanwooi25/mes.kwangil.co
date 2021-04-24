import { DEFAULT_LIST_LIMIT, LoadingKeys, PlateListItemHeight } from 'const';
import { IconButton, List, Theme, Tooltip, createStyles, makeStyles } from '@material-ui/core';
import PlateListItem, { PlateListItemSkeleton } from './PlateListItem';
import React, { ChangeEvent, useEffect, useState } from 'react';
import { plateActions, plateSelectors } from './plateSlice';
import { useAppDispatch, useAppSelector } from 'app/store';

import AddIcon from '@material-ui/icons/Add';
import ConfirmDialog from 'components/dialog/Confirm';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import GetAppIcon from '@material-ui/icons/GetApp';
import ListEmpty from 'components/ListEmpty';
import Loading from 'components/Loading';
import { Pagination } from '@material-ui/lab';
import SubToolbar from 'components/SubToolbar';
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

export interface PaginatedPlateListProps {}

const PaginatedPlateList = (props: PaginatedPlateListProps) => {
  const { t } = useTranslation('plates');
  const classes = useStyles();

  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const { [LoadingKeys.GET_PLATES]: isLoading } = useLoading();
  const { windowHeight, isDesktopLayout } = useScreenSize();
  const { openDialog, closeDialog } = useDialog();
  const dispatch = useAppDispatch();
  const query = useAppSelector(plateSelectors.query);
  const currentPage = useAppSelector(plateSelectors.currentPage);
  const totalPages = useAppSelector(plateSelectors.totalPages);
  const ids = useAppSelector(plateSelectors.ids);
  const plates = useAppSelector(plateSelectors.plates);
  const isSelectMode = useAppSelector(plateSelectors.isSelectMode);
  const selectedIds = useAppSelector(plateSelectors.selectedIds);
  const {
    getList: getPlates,
    resetList: resetPlates,
    resetSelection,
    deletePlates,
    selectAll,
    unselectAll,
  } = plateActions;

  const itemHeight = isDesktopLayout ? PlateListItemHeight.DESKTOP : PlateListItemHeight.TABLET;
  const isSelectedAll = !!ids.length && !!selectedIds.length && ids.every((id) => selectedIds.includes(id as number));
  const isIndeterminate = !isSelectedAll && ids.some((id) => selectedIds.includes(id as number));

  const handleToggleSelectAll = (checked: boolean) => {
    dispatch(checked ? selectAll(ids as number[]) : unselectAll(ids as number[]));
  };

  const handleResetSelection = () => {
    dispatch(resetSelection());
  };

  const handleChangePage = (e: ChangeEvent<unknown>, value: number) => {
    const limit = query?.limit || DEFAULT_LIST_LIMIT;
    dispatch(resetPlates());
    dispatch(getPlates({ limit, offset: limit * value - limit }));
  };

  const handleClickCreate = () => {
    // TODO: open create dialog
    // openDialog();
  };

  const handleClickDownload = async () => {
    setIsDownloading(true);
    // const { rows } = await plateApi.getAllPlates(query);
    // downloadWorkbook[ExcelVariant.PLATE](rows, t('plateList'));
    setIsDownloading(false);
  };

  const handleClickDeleteAll = () => {
    openDialog(
      <ConfirmDialog
        title={t('deletePlate')}
        message={t('deletePlatesConfirm', { count: selectedIds.length })}
        onClose={(isConfirmed: boolean) => {
          isConfirmed && dispatch(deletePlates(selectedIds));
          closeDialog();
        }}
      />
    );
  };

  useEffect(() => {
    const containerMaxHeight = windowHeight - (64 * 2 + 56);
    const limit = Math.floor(containerMaxHeight / itemHeight);
    dispatch(getPlates({ offset: 0, limit }));

    return () => {
      dispatch(resetPlates());
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
              <Tooltip key="add-plate" title={t('addPlate') as string} placement="top">
                <IconButton onClick={handleClickCreate}>
                  <AddIcon />
                </IconButton>
              </Tooltip>,
              <Tooltip key="download-plates" title={t('common:downloadExcel') as string} placement="top">
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
              .map((_, index) => <PlateListItemSkeleton key={index} itemHeight={itemHeight} />)
          ) : !plates.length ? (
            <ListEmpty />
          ) : (
            plates.map((plate) => (
              <PlateListItem
                key={plate.id}
                plate={plate}
                itemHeight={itemHeight}
                isSelected={selectedIds.includes(plate.id)}
                productCountToDisplay={2}
              />
            ))
          )}
        </List>
      </div>
      <div className={classes.paginationContainer}>
        {!!plates.length && (
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

export default PaginatedPlateList;
