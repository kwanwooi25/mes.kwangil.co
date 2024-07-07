/* eslint-disable no-nested-ternary */
import { DEFAULT_WORK_ORDER_FILTER, ExcelVariant, WorkOrderListItemHeight } from 'const';
import { useAuth } from 'features/auth/authHook';
import { useDialog } from 'features/dialog/dialogHook';
import { CreateWorkOrdersDto, WorkOrderDto, WorkOrderFilter } from 'features/workOrder/interface';
import {
  useBulkCreateWorkOrderMutation,
  useDeleteWorkOrdersMutation,
  useDownloadWorkOrders,
  useInfiniteWorkOrders,
} from 'features/workOrder/useWorkOrders';
import { useScreenSize } from 'hooks/useScreenSize';
import { useSelection } from 'hooks/useSelection';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from 'react-query';
import { BulkCreationResponse } from 'types/api';
import AlertDialog from 'ui/dialog/Alert';
import ConfirmDialog from 'ui/dialog/Confirm';
import ExcelUploadDialog from 'ui/dialog/ExcelUpload';
import WorkOrderDialog from 'ui/dialog/WorkOrder';
import WorkOrdersCompleteDialog from 'ui/dialog/WorkOrdersComplete';
import EndOfListItem from 'ui/elements/EndOfListItem';
import ListEmpty from 'ui/elements/ListEmpty';
import Loading from 'ui/elements/Loading';
import Layout from 'ui/layouts/Layout';
import SubToolbar from 'ui/layouts/SubToolbar';
import VirtualInfiniteScroll from 'ui/modules/VirtualInfiniteScroll/VirtualInfiniteScroll';
import WorkOrderPDF from 'ui/pdf/WorkOrderPDF';
import { downloadWorkbook } from 'utils/excel';
import { formatDigit } from 'utils/string';

import { Add, DeleteOutline, Done, GetApp, Print, Publish, Refresh } from '@mui/icons-material';
import { IconButton, List, Tooltip } from '@mui/material';
import { BlobProvider } from '@react-pdf/renderer';

import WorkOrderListItem from './WorkOrderListItem';
import WorkOrderSearch from './WorkOrderSearch';

function WorkOrderPage() {
  const { t } = useTranslation('workOrders');
  const [filter, setFilter] = useState<WorkOrderFilter>(DEFAULT_WORK_ORDER_FILTER);

  const { openDialog, closeDialog } = useDialog();
  const { isMobileLayout, isTabletLayout, isLaptopLayout, isLargerDesktopLayout } = useScreenSize();
  const { canCreateWorkOrders, canUpdateWorkOrders, canDeleteWorkOrders } = useAuth();
  const { isFetching, data, loadMore } = useInfiniteWorkOrders(filter);
  const { isDownloading, download } = useDownloadWorkOrders(filter);

  const workOrders =
    data?.pages.reduce((wo: WorkOrderDto[], { rows }) => [...wo, ...rows], []) || [];
  const workOrderIds = workOrders.map(({ id }) => id);
  const {
    selectedIds,
    isSelectMode,
    isSelectedAll,
    isIndeterminate,
    toggleSelection,
    toggleSelectAll,
    resetSelection,
  } = useSelection(workOrderIds);

  const queryClient = useQueryClient();
  const { createWorkOrders } = useBulkCreateWorkOrderMutation({
    queryClient,
    onSettled: ({ createdCount, failedList }: BulkCreationResponse<CreateWorkOrdersDto>) => {
      closeDialog();
      openDialog(
        <AlertDialog
          title={t('common:bulkCreationResult')}
          message={`${t('common:success')}: ${createdCount}<br>${t('common:fail')}: ${
            failedList.length
          }`}
          onClose={closeDialog}
        />,
      );
      if (failedList.length) {
        downloadWorkbook[ExcelVariant.WORK_ORDER](failedList, t('common:bulkCreationResult'));
      }
    },
  });
  const { deleteWorkOrders, isDeleting } = useDeleteWorkOrdersMutation({
    queryClient,
    onSuccess: () => resetSelection(),
  });

  const itemCount = workOrders.length + 1;
  const itemHeight = isMobileLayout
    ? WorkOrderListItemHeight.MOBILE
    : isTabletLayout
    ? WorkOrderListItemHeight.TABLET
    : isLaptopLayout
    ? WorkOrderListItemHeight.LAPTOP
    : isLargerDesktopLayout
    ? WorkOrderListItemHeight.LARGER_DESKTOP
    : WorkOrderListItemHeight.DESKTOP;
  const searchResult = t('common:searchResult', {
    count: formatDigit(data?.pages[data.pages.length - 1].count || 0),
  } as any);

  const selectedWorkOrders = workOrders.filter(({ id }) => selectedIds.includes(id));

  const handleClickRefresh = () => queryClient.invalidateQueries('workOrders');

  const handleToggleSelection = (workOrder: WorkOrderDto) => toggleSelection(workOrder.id);

  const closeDialogAndResetSelection = () => {
    closeDialog();
    resetSelection();
  };

  const openWorkOrderDialog = () => openDialog(<WorkOrderDialog onClose={closeDialog} />);

  const openExcelUploadDialog = () =>
    openDialog(
      <ExcelUploadDialog
        variant={ExcelVariant.WORK_ORDER}
        onSave={createWorkOrders}
        onClose={closeDialog}
      />,
    );

  const downloadExcel = () => download(t('workOrderList'));

  const openWorkOrdersCompleteDialog = () =>
    openDialog(
      <WorkOrdersCompleteDialog
        workOrders={selectedWorkOrders}
        onClose={closeDialogAndResetSelection}
      />,
    );

  const openWorkOrderPDF = (url: string) => () => window.open(url);

  const handleClickDeleteAll = () =>
    openDialog(
      <ConfirmDialog
        title={t('deleteWorkOrder')}
        message={t('deleteWorkOrdersConfirm', { count: selectedIds.length })}
        onClose={(isConfirmed: boolean) => {
          if (isConfirmed) deleteWorkOrders(selectedIds as string[]);
          closeDialogAndResetSelection();
        }}
      />,
    );

  let selectModeButtons: JSX.Element[] = [];

  if (!isMobileLayout) {
    if (canUpdateWorkOrders) {
      selectModeButtons.push(
        <Tooltip key="complete-all" title={t('common:complete') as string} placement="top">
          <IconButton onClick={openWorkOrdersCompleteDialog}>
            <Done />
          </IconButton>
        </Tooltip>,
      );
    }
    selectModeButtons = [
      ...selectModeButtons,
      <Tooltip key="print-all" title={t('common:print') as string} placement="top">
        <span>
          <BlobProvider document={<WorkOrderPDF workOrders={selectedWorkOrders} />}>
            {({ url, loading }) => (
              <IconButton onClick={openWorkOrderPDF(url as string)} disabled={loading}>
                {loading && <Loading />}
                <Print />
              </IconButton>
            )}
          </BlobProvider>
        </span>
      </Tooltip>,
    ];
  }

  const renderItem = (index: number) => {
    const workOrder = workOrders[index];

    return workOrder ? (
      <WorkOrderListItem
        key={workOrder.id}
        workOrder={workOrder}
        itemHeight={itemHeight}
        isSelected={selectedIds.includes(workOrder.id)}
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

  if (canDeleteWorkOrders) {
    selectModeButtons = [
      ...selectModeButtons,
      <Tooltip key="delete-all" title={t('common:deleteAll') as string} placement="top">
        <span>
          <IconButton onClick={handleClickDeleteAll} disabled={isDeleting}>
            {isDeleting && <Loading />}
            <DeleteOutline />
          </IconButton>
        </span>
      </Tooltip>,
    ];
  }

  let toolBarButtons: JSX.Element[] = [
    <Tooltip key="refresh" title={t('common:refresh') as string} placement="top">
      <IconButton onClick={handleClickRefresh}>
        <Refresh />
      </IconButton>
    </Tooltip>,
  ];
  if (canCreateWorkOrders) {
    toolBarButtons = [
      ...toolBarButtons,
      <Tooltip key="add-work-order" title={t('addWorkOrder') as string} placement="top">
        <IconButton onClick={openWorkOrderDialog}>
          <Add />
        </IconButton>
      </Tooltip>,
      <Tooltip key="add-work-order-bulk" title={t('common:createBulk') as string} placement="top">
        <IconButton onClick={openExcelUploadDialog}>
          <Publish />
        </IconButton>
      </Tooltip>,
    ];
  }
  toolBarButtons = [
    ...toolBarButtons,
    <Tooltip key="download-work-orders" title={t('common:downloadExcel') as string} placement="top">
      <span>
        <IconButton onClick={downloadExcel} disabled={isDownloading}>
          {isDownloading && <Loading />}
          <GetApp />
        </IconButton>
      </span>
    </Tooltip>,
  ];

  return (
    <Layout
      pageTitle={t('pageTitle')}
      SearchPanelContent={<WorkOrderSearch filter={filter} onChange={setFilter} />}
      searchPanelTitle={`${t('common:workOrder')} ${t('common:search')}`}
    >
      {!isMobileLayout && (
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
      <List style={{ height: isMobileLayout ? '100%' : 'calc(100% - 49px)' }} disablePadding>
        {!isFetching && !workOrders.length ? (
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
    </Layout>
  );
}

export default WorkOrderPage;
