import AlertDialog from 'components/dialog/Alert';
import ConfirmDialog from 'components/dialog/Confirm';
import ExcelUploadDialog from 'components/dialog/ExcelUpload';
import WorkOrderDialog from 'components/dialog/WorkOrder';
import WorkOrdersCompleteDialog from 'components/dialog/WorkOrdersComplete';
import EndOfListItem from 'components/EndOfListItem';
import ListEmpty from 'components/ListEmpty';
import Loading from 'components/Loading';
import SubToolbar from 'components/SubToolbar';
import VirtualInfiniteScroll from 'components/VirtualInfiniteScroll';
import WorkOrderPDF from 'components/WorkOrderPDF';
import { DATE_FORMAT, ExcelVariant, WorkOrderListItemHeight, WorkOrderStatus } from 'const';
import { format, subDays } from 'date-fns';
import { useAuth } from 'features/auth/authHook';
import { useDialog } from 'features/dialog/dialogHook';
import { useScreenSize } from 'hooks/useScreenSize';
import { useSelection } from 'hooks/useSelection';
import Layout from 'layouts/Layout';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from 'react-query';
import { BulkCreationResponse } from 'types/api';
import { downloadWorkbook } from 'utils/excel';
import { formatDigit } from 'utils/string';

import { IconButton, List, Tooltip } from '@material-ui/core';
import { Add, DeleteOutline, Done, GetApp, Print, Publish, Refresh } from '@material-ui/icons';
import { usePDF } from '@react-pdf/renderer';

import { CreateWorkOrdersDto, WorkOrderDto, WorkOrderFilter } from './interface';
import {
  useBulkCreateWorkOrderMutation,
  useDeleteWorkOrdersMutation,
  useDownloadWorkOrders,
  useInfiniteWorkOrders,
} from './useWorkOrders';
import WorkOrderListItem from './WorkOrderListItem';
import WorkOrderSearch from './WorkOrderSearch';

export interface WorkOrderPageProps {}

export const DEFAULT_WORK_ORDER_FILTER: WorkOrderFilter = {
  orderedAt: [format(subDays(new Date(), 14), DATE_FORMAT), format(new Date(), DATE_FORMAT)],
  accountName: '',
  productName: '',
  thickness: '',
  length: '',
  width: '',
  includeCompleted: false,
};

const WorkOrderPage = (props: WorkOrderPageProps) => {
  const { t } = useTranslation('workOrders');
  const [filter, setFilter] = useState<WorkOrderFilter>(DEFAULT_WORK_ORDER_FILTER);

  const { openDialog, closeDialog } = useDialog();
  const { isMobileLayout, isTabletLayout, isDesktopLayout } = useScreenSize();
  const { canCreateWorkOrders, canUpdateWorkOrders, canDeleteWorkOrders } = useAuth();
  const { isFetching, data, loadMore } = useInfiniteWorkOrders(filter);
  const { isDownloading, download } = useDownloadWorkOrders(filter);

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

  const workOrders =
    data?.pages.reduce((workOrders: WorkOrderDto[], { rows }) => [...workOrders, ...rows], []) ||
    [];
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

  const itemCount = workOrders.length + 1;
  const itemHeight = isDesktopLayout
    ? WorkOrderListItemHeight.DESKTOP
    : isTabletLayout
    ? WorkOrderListItemHeight.TABLET
    : WorkOrderListItemHeight.MOBILE;
  const searchResult = t('common:searchResult', {
    count: formatDigit(data?.pages[data.pages.length - 1].count || 0),
  } as any);

  const selectedWorkOrders = workOrders.filter(({ id }) => selectedIds.includes(id));
  const isAllCutting = selectedWorkOrders.every(
    ({ workOrderStatus }) => workOrderStatus === WorkOrderStatus.CUTTING,
  );

  const [instance, update] = usePDF({ document: <WorkOrderPDF workOrders={selectedWorkOrders} /> });

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

  const openWorkOrderPDF = () => update();

  const handleClickDeleteAll = () =>
    openDialog(
      <ConfirmDialog
        title={t('deleteWorkOrder')}
        message={t('deleteWorkOrdersConfirm', { count: selectedIds.length })}
        onClose={(isConfirmed: boolean) => {
          isConfirmed && deleteWorkOrders(selectedIds as string[]);
          closeDialogAndResetSelection();
        }}
      />,
    );

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

  let selectModeButtons: JSX.Element[] = [];

  if (isTabletLayout || isDesktopLayout) {
    if (isAllCutting && canUpdateWorkOrders) {
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
          <IconButton onClick={openWorkOrderPDF} disabled={instance.loading}>
            {instance.loading && <Loading />}
            <Print />
          </IconButton>
        </span>
      </Tooltip>,
    ];
  }

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

  useEffect(() => {
    selectedWorkOrders.length && instance.url && window.open(instance.url);
  }, [instance.url]);

  return (
    <Layout
      pageTitle={t('pageTitle')}
      SearchPanelContent={<WorkOrderSearch filter={filter} onChange={setFilter} />}
      searchPanelTitle={`${t('common:workOrder')} ${t('common:search')}`}
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
};

export default WorkOrderPage;
