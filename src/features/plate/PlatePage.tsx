import CreationFab from 'components/CreationFab';
import ConfirmDialog from 'components/dialog/Confirm';
import PlateDialog from 'components/dialog/Plate';
import EndOfListItem from 'components/EndOfListItem';
import ListEmpty from 'components/ListEmpty';
import Loading from 'components/Loading';
import SelectionPanel from 'components/SelectionPanel';
import SubToolbar from 'components/SubToolbar';
import VirtualInfiniteScroll from 'components/VirtualInfiniteScroll';
import { DEFAULT_PLATE_FILTER, PlateListItemHeight } from 'const';
import { useAuth } from 'features/auth/authHook';
import { useDialog } from 'features/dialog/dialogHook';
import { useScreenSize } from 'hooks/useScreenSize';
import { useSelection } from 'hooks/useSelection';
import Layout from 'layouts/Layout';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from 'react-query';
import { formatDigit } from 'utils/string';

import { IconButton, List, Tooltip } from '@material-ui/core';
import { Add, DeleteOutline, Refresh } from '@material-ui/icons';

import { PlateDto, PlateFilter } from './interface';
import PlateListItem from './PlateListItem';
import PlateSearch from './PlateSearch';
import { useDeletePlatesMutation, useInfinitePlates } from './usePlates';

function PlatePage() {
  const { t } = useTranslation('plates');
  const [filter, setFilter] = useState<PlateFilter>(DEFAULT_PLATE_FILTER);

  const { openDialog, closeDialog } = useDialog();
  const { isMobileLayout, isTabletLayout, isDesktopLayout } = useScreenSize();
  const { canCreatePlates, canDeletePlates } = useAuth();
  const { isFetching, data, loadMore } = useInfinitePlates(filter);

  const plates = data?.pages.reduce((p: PlateDto[], { rows }) => [...p, ...rows], []) || [];
  const plateIds = plates.map(({ id }) => id);
  const {
    selectedIds,
    isSelectMode,
    isSelectedAll,
    isIndeterminate,
    toggleSelection,
    toggleSelectAll,
    resetSelection,
  } = useSelection(plateIds);

  const queryClient = useQueryClient();
  const { deletePlates, isDeleting } = useDeletePlatesMutation({
    queryClient,
    onSuccess: () => resetSelection(),
  });

  const itemCount = plates.length + 1;
  // eslint-disable-next-line no-nested-ternary
  const itemHeight = isDesktopLayout
    ? PlateListItemHeight.DESKTOP
    : isTabletLayout
    ? PlateListItemHeight.TABLET
    : PlateListItemHeight.MOBILE;
  const searchResult = t('common:searchResult', {
    count: formatDigit(data?.pages[data.pages.length - 1].count || 0),
  } as any);

  const handleClickRefresh = () => queryClient.invalidateQueries('plates');

  const handleClickDeleteAll = () => {
    openDialog(
      <ConfirmDialog
        title={t('deletePlate')}
        message={t('deletePlatesConfirm', { count: selectedIds.length })}
        onClose={(isConfirmed: boolean) => {
          if (isConfirmed) deletePlates(selectedIds as number[]);
          closeDialog();
        }}
      />,
    );
  };

  const handleToggleSelection = (plate: PlateDto) => toggleSelection(plate.id);

  const openPlateDialog = () => openDialog(<PlateDialog onClose={closeDialog} />);

  const selectModeButtons: JSX.Element[] = [];
  if (canDeletePlates) {
    selectModeButtons.push(
      <Tooltip key="delete-all" title={t('common:deleteAll') as string} placement="top">
        <IconButton onClick={handleClickDeleteAll} disabled={isDeleting}>
          {isDeleting && <Loading />}
          <DeleteOutline />
        </IconButton>
      </Tooltip>,
    );
  }

  const renderItem = (index: number) => {
    const plate = plates[index];

    return plate ? (
      <PlateListItem
        key={plate.id}
        plate={plate}
        itemHeight={itemHeight}
        isSelected={selectedIds.includes(plate.id)}
        productCountToDisplay={isMobileLayout ? 1 : 2}
        filter={filter}
        toggleSelection={handleToggleSelection}
        isSelectable={!!selectModeButtons.length}
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

  let toolBarButtons: JSX.Element[] = [
    <Tooltip key="refresh" title={t('common:refresh') as string} placement="top">
      <IconButton onClick={handleClickRefresh}>
        <Refresh />
      </IconButton>
    </Tooltip>,
  ];
  if (canCreatePlates) {
    toolBarButtons = [
      ...toolBarButtons,
      <Tooltip key="add-plate" title={t('addPlate') as string} placement="top">
        <IconButton onClick={openPlateDialog}>
          <Add />
        </IconButton>
      </Tooltip>,
    ];
  }

  useEffect(() => {
    resetSelection();
  }, [filter]);

  return (
    <Layout
      pageTitle={t('pageTitle')}
      SearchPanelContent={<PlateSearch filter={filter} onChange={setFilter} />}
      searchPanelTitle={`${t('common:plate')} ${t('common:search')}`}
    >
      {(isTabletLayout || isDesktopLayout) && (
        <SubToolbar
          isSelectAllDisabled={!selectModeButtons.length}
          isSelectedAll={isSelectedAll}
          isIndeterminate={isIndeterminate}
          onToggleSelectAll={toggleSelectAll}
          onResetSelection={resetSelection}
          selectedCount={selectedIds.length}
          buttons={isSelectMode ? selectModeButtons : toolBarButtons}
        />
      )}
      <List style={{ height: isMobileLayout ? '100%' : 'calc(100% - 65px)' }} disablePadding>
        {!isFetching && !plates.length ? (
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
          {canDeletePlates && (
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
          {canCreatePlates && <CreationFab show={!isSelectMode} onClick={openPlateDialog} />}
        </>
      )}
    </Layout>
  );
}

export default PlatePage;
