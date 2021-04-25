import { DEFAULT_LIST_LIMIT, ExcelVariant, LoadingKeys, WorkOrderListItemHeight } from 'const';
import { IconButton, Tooltip } from '@material-ui/core';
import React, { ChangeEvent, useEffect, useState } from 'react';
import WorkOrderListItem, { WorkOrderListItemSkeleton } from './WorkOrderListItem';
import { useAppDispatch, useAppSelector } from 'app/store';
import { workOrderActions, workOrderSelectors } from './workOrderSlice';

import AddIcon from '@material-ui/icons/Add';
import ConfirmDialog from 'components/dialog/Confirm';
import { CreateWorkOrdersDto } from './interface';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import ExcelUploadDialog from 'components/dialog/ExcelUpload';
import GetAppIcon from '@material-ui/icons/GetApp';
import ListEmpty from 'components/ListEmpty';
import Loading from 'components/Loading';
import PaginatedList from 'layouts/PaginatedList';
import PublishIcon from '@material-ui/icons/Publish';
import SubToolbar from 'components/SubToolbar';
import WorkOrderDialog from 'components/dialog/WorkOrder';
import { useDialog } from 'features/dialog/dialogHook';
import { useLoading } from 'features/loading/loadingHook';
import { useScreenSize } from 'hooks/useScreenSize';
import { useTranslation } from 'react-i18next';

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
    // TODO: download excel
    // const { rows } = await productApi.getAllProducts(query);
    // downloadWorkbook[ExcelVariant.PRODUCT](rows, t('productList'));
    setIsDownloading(false);
  };

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
        buttons={
          isSelectMode ? (
            <Tooltip title={t('common:deleteAll') as string} placement="top">
              <IconButton onClick={handleClickDeleteAll}>
                <DeleteOutlineIcon />
              </IconButton>
            </Tooltip>
          ) : (
            [
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
            ]
          )
        }
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
