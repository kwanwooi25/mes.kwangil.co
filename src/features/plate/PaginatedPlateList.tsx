import { useAppDispatch, useAppSelector } from 'app/store';
import ConfirmDialog from 'components/dialog/Confirm';
import PlateDialog from 'components/dialog/Plate';
import ListEmpty from 'components/ListEmpty';
import SubToolbar from 'components/SubToolbar';
import { DEFAULT_LIST_LIMIT, LoadingKeys, PlateListItemHeight } from 'const';
import { useAuth } from 'features/auth/authHook';
import { useDialog } from 'features/dialog/dialogHook';
import { useLoading } from 'features/loading/loadingHook';
import { useScreenSize } from 'hooks/useScreenSize';
import PaginatedList from 'layouts/PaginatedList';
import React, { ChangeEvent, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { IconButton, Tooltip } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';

import PlateListItem, { PlateListItemSkeleton } from './PlateListItem';
import { plateActions, plateSelectors } from './plateSlice';

export interface PaginatedPlateListProps {}

const PaginatedPlateList = (props: PaginatedPlateListProps) => {
  const { t } = useTranslation('plates');

  const { [LoadingKeys.GET_PLATES]: isLoading } = useLoading();
  const { windowHeight, isDesktopLayout } = useScreenSize();
  const { openDialog, closeDialog } = useDialog();
  const { isUser } = useAuth();
  const dispatch = useAppDispatch();
  const query = useAppSelector(plateSelectors.query);
  const { ids, currentPage, totalPages } = useAppSelector(plateSelectors.pagination);
  const plates = useAppSelector(plateSelectors.paginatedPlates);
  const isSelectMode = useAppSelector(plateSelectors.isSelectMode);
  const selectedIds = useAppSelector(plateSelectors.selectedIds);
  const { getList, resetList, resetListOnPage, resetSelection, deletePlates, selectAll, unselectAll } = plateActions;

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
    dispatch(resetListOnPage());
    dispatch(getList({ ...query, offset: limit * value - limit }));
  };

  const handleClickCreate = () => {
    openDialog(<PlateDialog onClose={closeDialog} />);
  };

  const handleClickDeleteAll = () => {
    openDialog(
      <ConfirmDialog
        title={t('deletePlate')}
        message={t('deletePlatesConfirm', { count: selectedIds.length })}
        onClose={(isConfirmed: boolean) => {
          isConfirmed && dispatch(deletePlates(selectedIds as number[]));
          closeDialog();
        }}
      />
    );
  };

  const selectModeButtons = [
    <Tooltip key="delete-all" title={t('common:deleteAll') as string} placement="top">
      <IconButton onClick={handleClickDeleteAll}>
        <DeleteOutlineIcon />
      </IconButton>
    </Tooltip>,
  ];

  const toolBarButtons = [
    <Tooltip key="add-plate" title={t('addPlate') as string} placement="top">
      <IconButton onClick={handleClickCreate}>
        <AddIcon />
      </IconButton>
    </Tooltip>,
  ];

  useEffect(() => {
    const toolBarCount = isUser ? 1 : 2;
    const containerMaxHeight = windowHeight - (64 * toolBarCount + 56);
    const limit = Math.floor(containerMaxHeight / itemHeight);
    dispatch(getList({ offset: 0, limit }));

    return () => {
      dispatch(resetList());
    };
  }, [windowHeight, itemHeight, isUser]);

  return (
    <>
      {!isUser && (
        <SubToolbar
          isSelectedAll={isSelectedAll}
          isIndeterminate={isIndeterminate}
          onToggleSelectAll={handleToggleSelectAll}
          onResetSelection={handleResetSelection}
          selectedCount={selectedIds.length}
          buttons={isSelectMode ? selectModeButtons : toolBarButtons}
        />
      )}
      <PaginatedList
        height={(query.limit || DEFAULT_LIST_LIMIT) * itemHeight}
        showPagination={!!plates.length}
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={handleChangePage}
      >
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
      </PaginatedList>
    </>
  );
};

export default PaginatedPlateList;
