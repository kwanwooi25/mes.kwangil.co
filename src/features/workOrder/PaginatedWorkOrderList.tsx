import { DEFAULT_LIST_LIMIT, ExcelVariant, LoadingKeys, WorkOrderListItemHeight, WorkOrderStatus } from 'const';
import { IconButton, Tooltip } from '@material-ui/core';
import React, { ChangeEvent, useEffect, useState } from 'react';
import WorkOrderListItem, { WorkOrderListItemSkeleton } from './WorkOrderListItem';
import { useAppDispatch, useAppSelector } from 'app/store';
import { workOrderActions, workOrderSelectors } from './workOrderSlice';

import AddIcon from '@material-ui/icons/Add';
import { BlobProvider } from '@react-pdf/renderer';
import ConfirmDialog from 'components/dialog/Confirm';
import { CreateWorkOrdersDto } from './interface';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import DoneIcon from '@material-ui/icons/Done';
import ExcelUploadDialog from 'components/dialog/ExcelUpload';
import GetAppIcon from '@material-ui/icons/GetApp';
import ListEmpty from 'components/ListEmpty';
import Loading from 'components/Loading';
import PaginatedList from 'layouts/PaginatedList';
import PrintIcon from '@material-ui/icons/Print';
import PublishIcon from '@material-ui/icons/Publish';
import SubToolbar from 'components/SubToolbar';
import WorkOrderDialog from 'components/dialog/WorkOrder';
import WorkOrderPDF from 'components/WorkOrderPDF';
import WorkOrdersCompleteDialog from 'components/dialog/WorkOrdersComplete';
import { downloadWorkbook } from 'utils/excel';
import { useDialog } from 'features/dialog/dialogHook';
import { useLoading } from 'features/loading/loadingHook';
import { useScreenSize } from 'hooks/useScreenSize';
import { useTranslation } from 'react-i18next';
import { workOrderApi } from './workOrderApi';

export interface PaginatedWorkOrderListProps {}

const PaginatedWorkOrderList = (props: PaginatedWorkOrderListProps) => {
  const { t } = useTranslation('workOrders');

  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const { [LoadingKeys.GET_WORK_ORDERS]: isLoading } = useLoading();
  const { windowHeight, isDesktopLayout } = useScreenSize();
  const { openDialog, closeDialog } = useDialog();
  const dispatch = useAppDispatch();
  const query = useAppSelector(workOrderSelectors.query);
  const currentPage = useAppSelector(workOrderSelectors.currentPage);
  const totalPages = useAppSelector(workOrderSelectors.totalPages);
  const ids = useAppSelector(workOrderSelectors.ids);
  const workOrders = useAppSelector(workOrderSelectors.workOrders);
  const isSelectMode = useAppSelector(workOrderSelectors.isSelectMode);
  const selectedIds = useAppSelector(workOrderSelectors.selectedIds);
  const selectedWorkOrders = useAppSelector(workOrderSelectors.selectedWorkOrders);
  const {
    getList,
    resetList,
    resetSelection,
    deleteWorkOrders,
    selectAll,
    unselectAll,
    createWorkOrders,
  } = workOrderActions;

  const itemHeight = isDesktopLayout ? WorkOrderListItemHeight.DESKTOP : WorkOrderListItemHeight.TABLET;
  const isSelectedAll = !!ids.length && !!selectedIds.length && ids.every((id) => selectedIds.includes(id as string));
  const isIndeterminate = !isSelectedAll && ids.some((id) => selectedIds.includes(id as string));
  const isAllCutting = selectedWorkOrders.every(({ workOrderStatus }) => workOrderStatus === WorkOrderStatus.CUTTING);

  const handleToggleSelectAll = (checked: boolean) => {
    dispatch(checked ? selectAll(ids as string[]) : unselectAll(ids as string[]));
  };

  const handleResetSelection = () => {
    dispatch(resetSelection());
  };

  const handleChangePage = (e: ChangeEvent<unknown>, value: number) => {
    const limit = query?.limit || DEFAULT_LIST_LIMIT;
    dispatch(resetList());
    dispatch(getList({ ...query, limit, offset: limit * value - limit }));
  };

  const handleClickCreate = () => {
    openDialog(<WorkOrderDialog onClose={closeDialog} />);
  };

  const handleClickCreateBulk = () => {
    openDialog(
      <ExcelUploadDialog
        variant={ExcelVariant.WORK_ORDER}
        onSave={(workOrders: CreateWorkOrdersDto[]) => dispatch(createWorkOrders(workOrders))}
        onClose={closeDialog}
      />
    );
  };

  const handleClickDownload = async () => {
    setIsDownloading(true);
    const { rows } = await workOrderApi.getAllWorkOrders(query);
    downloadWorkbook[ExcelVariant.WORK_ORDER](rows, t('workOrderList'));
    setIsDownloading(false);
  };

  const handleClickCompleteAll = () => {
    openDialog(<WorkOrdersCompleteDialog workOrders={selectedWorkOrders} onClose={closeDialog} />);
  };

  const handleClickPrint = (url: string) => () => window.open(url);

  const handleClickDeleteAll = () => {
    openDialog(
      <ConfirmDialog
        title={t('deleteWorkOrder')}
        message={t('deleteWorkOrdersConfirm', { count: selectedIds.length })}
        onClose={(isConfirmed: boolean) => {
          isConfirmed && dispatch(deleteWorkOrders(selectedIds as string[]));
          closeDialog();
        }}
      />
    );
  };

  let selectModeButtons = [];
  if (isAllCutting) {
    selectModeButtons.push(
      <Tooltip key="complete-all" title={t('common:complete') as string} placement="top">
        <IconButton onClick={handleClickCompleteAll}>
          <DoneIcon />
        </IconButton>
      </Tooltip>
    );
  }
  selectModeButtons = [
    ...selectModeButtons,
    <BlobProvider key="print-all" document={<WorkOrderPDF workOrders={selectedWorkOrders} />}>
      {({ url, loading }) =>
        loading ? (
          <IconButton disabled>
            <Loading />
            <PrintIcon />
          </IconButton>
        ) : (
          <Tooltip key="print-all" title={t('common:print') as string} placement="top">
            <IconButton onClick={handleClickPrint(url as string)}>
              <PrintIcon />
            </IconButton>
          </Tooltip>
        )
      }
    </BlobProvider>,
    <Tooltip key="delete-all" title={t('common:deleteAll') as string} placement="top">
      <IconButton onClick={handleClickDeleteAll}>
        <DeleteOutlineIcon />
      </IconButton>
    </Tooltip>,
  ];

  const toolbarButtons = [
    <Tooltip key="add-work-order" title={t('addWorkOrder') as string} placement="top">
      <IconButton onClick={handleClickCreate}>
        <AddIcon />
      </IconButton>
    </Tooltip>,
    <Tooltip key="add-work-order-bulk" title={t('common:createBulk') as string} placement="top">
      <IconButton onClick={handleClickCreateBulk}>
        <PublishIcon />
      </IconButton>
    </Tooltip>,
    <Tooltip key="download-work-orders" title={t('common:downloadExcel') as string} placement="top">
      <IconButton onClick={handleClickDownload} disabled={isDownloading}>
        {isDownloading && <Loading />}
        <GetAppIcon />
      </IconButton>
    </Tooltip>,
  ];

  useEffect(() => {
    const containerMaxHeight = windowHeight - (64 * 2 + 56);
    const limit = Math.floor(containerMaxHeight / itemHeight);
    dispatch(getList({ ...query, offset: 0, limit }));

    return () => {
      dispatch(resetList());
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
        buttons={isSelectMode ? selectModeButtons : toolbarButtons}
      />
      <PaginatedList
        height={(query.limit || DEFAULT_LIST_LIMIT) * itemHeight}
        showPagination={!!workOrders.length}
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={handleChangePage}
      >
        {isLoading ? (
          Array(query.limit)
            .fill('')
            .map((_, index) => <WorkOrderListItemSkeleton key={index} itemHeight={itemHeight} />)
        ) : !workOrders.length ? (
          <ListEmpty />
        ) : (
          workOrders.map((workOrder) => (
            <WorkOrderListItem
              key={workOrder.id}
              workOrder={workOrder}
              itemHeight={itemHeight}
              isSelected={selectedIds.includes(workOrder.id)}
            />
          ))
        )}
      </PaginatedList>
    </>
  );
};

export default PaginatedWorkOrderList;
