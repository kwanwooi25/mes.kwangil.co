import { useAppDispatch, useAppSelector } from 'app/store';
import ConfirmDialog from 'components/dialog/Confirm';
import ListEmpty from 'components/ListEmpty';
import Loading from 'components/Loading';
import SubToolbar from 'components/SubToolbar';
import { DEFAULT_LIST_LIMIT, DeliveryListItemHeight, LoadingKeys } from 'const';
import { useAuth } from 'features/auth/authHook';
import { useDialog } from 'features/dialog/dialogHook';
import { useLoading } from 'features/loading/loadingHook';
import { useScreenSize } from 'hooks/useScreenSize';
import PaginatedList from 'layouts/PaginatedList';
import React, { ChangeEvent, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { IconButton, Tooltip } from '@material-ui/core';
import { Add, DeleteOutline, Done, GetApp } from '@material-ui/icons';

import DeliveryListItem, { DeliveryListItemSkeleton } from './DeliveryListItem';
import { deliveryActions, deliverySelector } from './deliverySlice';

export interface PaginatedDeliveryListProps {}

const PaginatedDeliveryList = (props: PaginatedDeliveryListProps) => {
  const { t } = useTranslation('delivery');

  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const { [LoadingKeys.GET_DELIVERIES]: isLoading } = useLoading();
  const dispatch = useAppDispatch();
  const { isUser } = useAuth();
  const { windowHeight, isDesktopLayout } = useScreenSize();
  const { openDialog, closeDialog } = useDialog();
  const query = useAppSelector(deliverySelector.query);
  const { ids, currentPage, totalPages } = useAppSelector(deliverySelector.pagination);
  const deliveries = useAppSelector(deliverySelector.deliveries);
  const isSelectMode = useAppSelector(deliverySelector.isSelectMode);
  const selectedIds = useAppSelector(deliverySelector.selectedIds);
  const { getList, resetList, selectAll, unselectAll, resetSelection, resetListOnPage } = deliveryActions;

  const itemHeight = isDesktopLayout ? DeliveryListItemHeight.DESKTOP : DeliveryListItemHeight.TABLET;
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
    // TODO: open delivery dialog
  };

  const handleClickDownload = async () => {
    setIsDownloading(true);
    // TODO: download delivery excel file
    setIsDownloading(false);
  };

  const handleClickConfirmAll = () => {
    // TODO: confirm all deliveries
  };

  const handleClickDeleteAll = () => {
    openDialog(
      <ConfirmDialog
        title={t('deleteDelivery')}
        message={t('deleteDeliveriesConfirm', { count: selectedIds.length })}
        onClose={(isConfirmed: boolean) => {
          // TODO: delete deliveries
          // isConfirmed && dispatch(deleteDeliveries(selectedIds as number[]));
          closeDialog();
        }}
      />
    );
  };

  const selectModeButtons = [
    <Tooltip key="confirm-all" title={t('deliveryConfirm') as string} placement="top">
      <IconButton onClick={handleClickConfirmAll}>
        <Done />
      </IconButton>
    </Tooltip>,
    <Tooltip key="delete-all" title={t('common:deleteAll') as string} placement="top">
      <IconButton onClick={handleClickDeleteAll}>
        <DeleteOutline />
      </IconButton>
    </Tooltip>,
  ];

  const toolBarButtons = [
    <Tooltip key="add-delivery" title={t('addDelivery') as string} placement="top">
      <IconButton onClick={handleClickCreate}>
        <Add />
      </IconButton>
    </Tooltip>,
    <Tooltip key="download-deliveries" title={t('common:downloadExcel') as string} placement="top">
      <IconButton onClick={handleClickDownload} disabled={isDownloading}>
        {isDownloading && <Loading />}
        <GetApp />
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
        showPagination={!!deliveries.length}
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={handleChangePage}
      >
        {isLoading ? (
          Array(query.limit)
            .fill('')
            .map((_, index) => <DeliveryListItemSkeleton key={index} itemHeight={itemHeight} />)
        ) : !deliveries.length ? (
          <ListEmpty />
        ) : (
          deliveries.map((delivery) => (
            <DeliveryListItem
              key={delivery.id}
              delivery={delivery}
              itemHeight={itemHeight}
              isSelected={selectedIds.includes(delivery.id)}
            />
          ))
        )}
      </PaginatedList>
    </>
  );
};

export default PaginatedDeliveryList;
