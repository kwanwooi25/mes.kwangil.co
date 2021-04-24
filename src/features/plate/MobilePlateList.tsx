import { DEFAULT_LIST_LIMIT, LoadingKeys, PlateListItemHeight } from 'const';
import { IconButton, List, Theme, createStyles, makeStyles } from '@material-ui/core';
import React, { useEffect } from 'react';
import { plateActions, plateSelectors } from './plateSlice';
import { useAppDispatch, useAppSelector } from 'app/store';

import ConfirmDialog from 'components/dialog/Confirm';
import CreationFab from 'components/CreationFab';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import EndOfListItem from 'components/EndOfListItem';
import ListEmpty from 'components/ListEmpty';
import PlateListItem from './PlateListItem';
import SelectionPanel from 'components/SelectionPanel';
import VirtualInfiniteScroll from 'components/VirtualInfiniteScroll';
import { formatDigit } from 'utils/string';
import { useDialog } from 'features/dialog/dialogHook';
import { useLoading } from 'features/loading/loadingHook';
import { useTranslation } from 'react-i18next';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    mobilePlateList: {
      height: '100%',
    },
  })
);

export interface MobilePlateListProps {}

const MobilePlateList = (props: MobilePlateListProps) => {
  const { t } = useTranslation('common');
  const classes = useStyles();

  const dispatch = useAppDispatch();
  const { [LoadingKeys.GET_PLATES]: isLoading } = useLoading();
  const { openDialog, closeDialog } = useDialog();
  const query = useAppSelector(plateSelectors.query);
  const hasMore = useAppSelector(plateSelectors.hasMore);
  const totalCount = useAppSelector(plateSelectors.totalCount);
  const plates = useAppSelector(plateSelectors.plates);
  const isSelectMode = useAppSelector(plateSelectors.isSelectMode);
  const selectedIds = useAppSelector(plateSelectors.selectedIds);
  const { getList: getPlates, resetList: resetPlates, resetSelection, deletePlates } = plateActions;

  const itemCount = plates.length + 1;
  const itemHeight = PlateListItemHeight.MOBILE;

  const searchResult = t('searchResult', { count: formatDigit(totalCount) } as any);

  const loadMore = () => {
    if (hasMore) {
      const offset = (query.offset || 0) + (query.limit || DEFAULT_LIST_LIMIT);
      dispatch(getPlates({ ...query, offset }));
    }
  };

  const handleCloseSelectionPanel = () => {
    dispatch(resetSelection());
  };

  const handleClickDeleteAll = () => {
    openDialog(
      <ConfirmDialog
        title={t('plates:deletePlate')}
        message={t('plates:deletePlatesConfirm', { count: selectedIds.length })}
        onClose={(isConfirmed: boolean) => {
          isConfirmed && dispatch(deletePlates(selectedIds));
          closeDialog();
        }}
      />
    );
  };

  const openPlateDialog = () => {
    // TODO: openDialog();
  };

  const renderItem = (index: number) => {
    const plate = plates[index];

    return plate ? (
      <PlateListItem
        key={plate.id}
        plate={plate}
        itemHeight={itemHeight}
        isSelected={selectedIds.includes(plate.id)}
        productCountToDisplay={1}
      />
    ) : (
      <EndOfListItem key="end-of-list" height={itemHeight} isLoading={isLoading} message={searchResult} />
    );
  };

  useEffect(() => {
    dispatch(getPlates({ offset: 0, limit: DEFAULT_LIST_LIMIT }));

    return () => {
      dispatch(resetPlates());
    };
  }, []);

  return (
    <>
      <List className={classes.mobilePlateList} disablePadding>
        {!isLoading && !plates.length ? (
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
      <CreationFab show={!isSelectMode} onClick={openPlateDialog} />
    </>
  );
};

export default MobilePlateList;
