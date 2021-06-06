import { useAppDispatch, useAppSelector } from 'app/store';
import CreationFab from 'components/CreationFab';
import ConfirmDialog from 'components/dialog/Confirm';
import EndOfListItem from 'components/EndOfListItem';
import ListEmpty from 'components/ListEmpty';
import SelectionPanel from 'components/SelectionPanel';
import VirtualInfiniteScroll from 'components/VirtualInfiniteScroll';
import { DEFAULT_LIST_LIMIT, DeliveryListItemHeight, LoadingKeys } from 'const';
import { useAuth } from 'features/auth/authHook';
import { useDialog } from 'features/dialog/dialogHook';
import { useLoading } from 'features/loading/loadingHook';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { formatDigit } from 'utils/string';

import { createStyles, IconButton, List, makeStyles, Theme } from '@material-ui/core';
import { DeleteOutline } from '@material-ui/icons';

import DeliveryListItem from './DeliveryListItem';
import { deliveryActions, deliverySelector } from './deliverySlice';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    mobileDeliveryList: {
      height: '100%',
    },
  })
);

export interface MobileDeliveryListProps {}

const MobileDeliveryList = (props: MobileDeliveryListProps) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const query = useAppSelector(deliverySelector.query);
  const hasMore = useAppSelector(deliverySelector.hasMore);
  const totalCount = useAppSelector(deliverySelector.totalCount);
  const deliveries = useAppSelector(deliverySelector.deliveries);
  const isSelectMode = useAppSelector(deliverySelector.isSelectMode);
  const selectedIds = useAppSelector(deliverySelector.selectedIds);
  const { getList, resetList, resetSelection } = deliveryActions;
  const dispatch = useAppDispatch();
  const { openDialog, closeDialog } = useDialog();
  const { [LoadingKeys.GET_DELIVERIES]: isLoading } = useLoading();
  const { isUser } = useAuth();

  const itemCount = deliveries.length + 1;
  const itemHeight = DeliveryListItemHeight.MOBILE;

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
        title={t('delivery:deleteDelivery')}
        message={t('delivery:deleteDeliveriesConfirm', { count: selectedIds.length })}
        onClose={(isConfirmed: boolean) => {
          // TODO: delete deliveries
          // isConfirmed && dispatch(deleteDeliveries(selectedIds as string[]));
          closeDialog();
        }}
      />
    );
  };

  const openDeliveryDialog = () => {
    // TODO: open delivery dialog
    // openDialog();
  };

  const renderItem = (index: number) => {
    const delivery = deliveries[index];

    return delivery ? (
      <DeliveryListItem
        key={delivery.id}
        delivery={delivery}
        itemHeight={itemHeight}
        isSelected={selectedIds.includes(delivery.id)}
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
      <List className={classes.mobileDeliveryList} disablePadding>
        {!isLoading && !deliveries.length ? (
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
      {!isUser && (
        <>
          <SelectionPanel isOpen={isSelectMode} selectedCount={selectedIds.length} onClose={handleCloseSelectionPanel}>
            <IconButton onClick={handleClickDeleteAll}>
              <DeleteOutline />
            </IconButton>
          </SelectionPanel>
          <CreationFab show={!isSelectMode} onClick={openDeliveryDialog} />
        </>
      )}
    </>
  );
};

export default MobileDeliveryList;
