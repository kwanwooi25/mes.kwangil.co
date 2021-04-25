import { DEFAULT_LIST_LIMIT, LoadingKeys, WorkOrderListItemHeight } from 'const';
import { IconButton, List, Theme, createStyles, makeStyles } from '@material-ui/core';
import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from 'app/store';
import { workOrderActions, workOrderSelectors } from './workOrderSlice';

import ConfirmDialog from 'components/dialog/Confirm';
import CreationFab from 'components/CreationFab';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import EndOfListItem from 'components/EndOfListItem';
import ListEmpty from 'components/ListEmpty';
import SelectionPanel from 'components/SelectionPanel';
import VirtualInfiniteScroll from 'components/VirtualInfiniteScroll';
import WorkOrderListItem from './WorkOrderListItem';
import { formatDigit } from 'utils/string';
import { useDialog } from 'features/dialog/dialogHook';
import { useLoading } from 'features/loading/loadingHook';
import { useTranslation } from 'react-i18next';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    mobileWorkOrderList: {
      height: '100%',
    },
  })
);

export interface MobileWorkOrderListProps {}

const MobileWorkOrderList = (props: MobileWorkOrderListProps) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const query = useAppSelector(workOrderSelectors.query);
  const hasMore = useAppSelector(workOrderSelectors.hasMore);
  const totalCount = useAppSelector(workOrderSelectors.totalCount);
  const workOrders = useAppSelector(workOrderSelectors.workOrders);
  const isSelectMode = useAppSelector(workOrderSelectors.isSelectMode);
  const selectedIds = useAppSelector(workOrderSelectors.selectedIds);
  const { getList, resetList, resetSelection, deleteWorkOrders } = workOrderActions;
  const dispatch = useAppDispatch();
  const { openDialog, closeDialog } = useDialog();
  const { [LoadingKeys.GET_WORK_ORDERS]: isLoading } = useLoading();

  const itemCount = workOrders.length + 1;
  const itemHeight = WorkOrderListItemHeight.MOBILE;

  const searchResult = t('common:searchResult', { count: formatDigit(totalCount) } as any);

  const loadMore = () => {
    if (hasMore) {
      const offset = (query.offset || 0) + (query.limit || DEFAULT_LIST_LIMIT);
      dispatch(getList({ ...query, offset }));
    }
  };

  const handleCloseSelectionPanel = () => {
    dispatch(resetSelection());
  };

  const handleClickDeleteAll = () => {
    openDialog(
      <ConfirmDialog
        title={t('workOrders:deleteWorkOrder')}
        message={t('workOrders:deleteWorkOrdersConfirm', { count: selectedIds.length })}
        onClose={(isConfirmed: boolean) => {
          isConfirmed && dispatch(deleteWorkOrders(selectedIds as string[]));
          closeDialog();
        }}
      />
    );
  };

  const openWorkOrderDialog = () => {
    // TODO: open create workOrder
    // openDialog();
  };

  const renderItem = (index: number) => {
    const workOrder = workOrders[index];

    return workOrder ? (
      <WorkOrderListItem
        key={workOrder.id}
        workOrder={workOrder}
        itemHeight={itemHeight}
        isSelected={selectedIds.includes(workOrder.id)}
      />
    ) : (
      <EndOfListItem key="end-of-list" height={itemHeight} isLoading={isLoading} message={searchResult} />
    );
  };

  useEffect(() => {
    dispatch(getList({ ...query, offset: 0, limit: DEFAULT_LIST_LIMIT }));

    return () => {
      dispatch(resetList());
    };
  }, []);

  return (
    <>
      <List className={classes.mobileWorkOrderList} disablePadding>
        {!isLoading && !workOrders.length ? (
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
      <CreationFab show={!isSelectMode} onClick={openWorkOrderDialog} />
    </>
  );
};

export default MobileWorkOrderList;
