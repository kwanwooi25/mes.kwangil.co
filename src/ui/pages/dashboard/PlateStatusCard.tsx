import { PLATE_STATUS_COLORS, PlateStatus } from 'const';
import { useAuth } from 'features/auth/authHook';
import { useDialog } from 'features/dialog/dialogHook';
import { WorkOrderDto } from 'features/workOrder/interface';
import { workOrderApi } from 'features/workOrder/workOrderApi';
import { useWorkOrderDisplay } from 'hooks/useWorkOrderDisplay';
import React, { ChangeEvent, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';
import ConfirmDialog from 'ui/dialog/Confirm';
import PlateDialog from 'ui/dialog/Plate';
import DashboardCard from 'ui/elements/DashboardCard';
import Loading from 'ui/elements/Loading';
import ProductName from 'ui/elements/ProductName';
import WorkOrderId from 'ui/elements/WorkOrderId';
import NeedPlatePDF from 'ui/pdf/NeedPlatePDF';
import { getProductTitle } from 'utils/product';
import { getWorkOrderToUpdate } from 'utils/workOrder';

import { Done, InsertEmoticon, Print } from '@mui/icons-material';
import { Chip, IconButton, List, ListItem, Pagination, Skeleton, Tooltip } from '@mui/material';
import { BlobProvider } from '@react-pdf/renderer';

const LIST_ITEM_HEIGHT = 121;

function WorkOrderListItem({
  workOrder,
  onComplete,
}: {
  workOrder: WorkOrderDto;
  onComplete: () => void;
}) {
  const { t } = useTranslation();
  const { productSize, plateStatus } = useWorkOrderDisplay(workOrder, t);
  const { openDialog, closeDialog } = useDialog();
  const { canUpdateWorkOrders } = useAuth();
  const backgroundColor = PLATE_STATUS_COLORS[workOrder.plateStatus];

  const updatePlateStatus = async (wo: WorkOrderDto) => {
    const { id } = wo;
    await workOrderApi.updateWorkOrder({
      ...getWorkOrderToUpdate(wo),
      id,
      isPlateReady: true,
    });
    onComplete();
  };

  const openPlateDialog = ({ product }: WorkOrderDto) => {
    openDialog(<PlateDialog products={[product]} onClose={closeDialog} />);
  };

  const openConfirmAddPlateDialog = () => {
    openDialog(
      <ConfirmDialog
        title={t('plates:complete')}
        message={t('plates:shouldAddPlate')}
        onClose={async (isConfirmed: boolean) => {
          closeDialog();
          if (isConfirmed) openPlateDialog(workOrder);
        }}
      />,
    );
  };

  const handleClickComplete = () => {
    openDialog(
      <ConfirmDialog
        title={t('plates:complete')}
        message={t('plates:confirmComplete', { productTitle: getProductTitle(workOrder.product) })}
        onClose={async (isConfirmed: boolean) => {
          closeDialog();
          if (isConfirmed) {
            updatePlateStatus(workOrder);
            if (workOrder.plateStatus === PlateStatus.NEW) {
              openConfirmAddPlateDialog();
            }
          }
        }}
      />,
    );
  };

  return (
    <ListItem className="!grid grid-cols-[1fr_auto_auto] gap-x-2 gap-y-1" divider>
      <WorkOrderId workOrder={workOrder} />
      <Chip className="row-span-3" label={plateStatus} style={{ backgroundColor }} />
      <span className="row-span-3">
        {canUpdateWorkOrders && (
          <Tooltip title={t('common:complete') as string}>
            <IconButton color="primary" onClick={handleClickComplete}>
              <Done />
            </IconButton>
          </Tooltip>
        )}
      </span>
      <ProductName product={workOrder.product} />
      <span className="px-2">{productSize}</span>
    </ListItem>
  );
}

function WorkOrderListItemSkeleton() {
  return (
    <ListItem className="!grid grid-cols-[1fr_auto_auto] gap-x-2 gap-y-1" divider>
      <Skeleton width="60%" height={36} />
      <Skeleton className="row-span-3" width={75} height={32} />
      <Skeleton className="row-span-3" width={48} height={48} variant="circular" />
      <Skeleton width="80%" height={36} />
      <Skeleton width="50%" height={24} />
    </ListItem>
  );
}

function NoPlatesToProduce() {
  const { t } = useTranslation();

  return (
    <ListItem className="flex flex-col">
      <InsertEmoticon className="m-4 !text-6xl text-primary" />
      <p className="text-primary">{t('dashboard:noPlatesToProduce')}</p>
    </ListItem>
  );
}

function PlateStatusCard() {
  const { t } = useTranslation();
  const {
    isLoading,
    data: workOrders = [],
    refetch,
  } = useQuery(
    'workOrdersNeedPlate',
    async (): Promise<WorkOrderDto[]> => workOrderApi.getWorkOrdersNeedPlate(),
  );
  const [workOrdersToShow, setWorkOrdersToShow] = useState<WorkOrderDto[]>([]);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const { canViewWorkOrders } = useAuth();

  const workOrderCountToDisplay = 4;

  const handlePageChange = (e: ChangeEvent<unknown>, p: number) => setPage(p);

  const openWorkOrderPDF = (url: string) => () => window.open(url);

  const renderSkeletons = () =>
    Array(workOrderCountToDisplay)
      .fill('')
      // eslint-disable-next-line react/no-array-index-key
      .map((_, index) => <WorkOrderListItemSkeleton key={index} />);

  const renderWorkOrders = () =>
    workOrdersToShow.map((workOrder) => (
      <WorkOrderListItem key={workOrder.id} workOrder={workOrder} onComplete={refetch} />
    ));

  useEffect(() => {
    setWorkOrdersToShow(workOrders.slice(0, workOrderCountToDisplay));
    setPage(1);
    setTotalPages(Math.ceil(workOrders.length / workOrderCountToDisplay));
  }, [workOrders]);

  useEffect(() => {
    const offset = (page - 1) * workOrderCountToDisplay;
    setWorkOrdersToShow(workOrders.slice(offset, offset + workOrderCountToDisplay));
  }, [page]);

  return (
    <DashboardCard
      title={t('dashboard:plateStatus')}
      onRefresh={refetch}
      headerButton={
        canViewWorkOrders ? (
          <BlobProvider document={<NeedPlatePDF workOrders={workOrders} />}>
            {({ url, loading }) =>
              loading ? (
                <IconButton disabled size="small">
                  <Loading size="2rem" />
                  <Print />
                </IconButton>
              ) : (
                <Tooltip key="print-all" title={t('common:print') as string} placement="top">
                  <IconButton onClick={openWorkOrderPDF(url as string)} size="small">
                    <Print />
                  </IconButton>
                </Tooltip>
              )
            }
          </BlobProvider>
        ) : undefined
      }
    >
      <List disablePadding style={{ height: LIST_ITEM_HEIGHT * workOrderCountToDisplay }}>
        {isLoading && renderSkeletons()}
        {!isLoading && !workOrders.length && <NoPlatesToProduce />}
        {!isLoading && workOrders.length && renderWorkOrders()}
      </List>
      <Pagination
        className="flex justify-center pt-4"
        size="small"
        count={totalPages}
        page={page}
        onChange={handlePageChange}
        showFirstButton
        showLastButton
      />
    </DashboardCard>
  );
}

export default PlateStatusCard;
