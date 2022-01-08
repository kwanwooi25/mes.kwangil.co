import DashboardCard from 'components/DashboardCard';
import ConfirmDialog from 'components/dialog/Confirm';
import PlateDialog from 'components/dialog/Plate';
import Loading from 'components/Loading';
import NeedPlatePDF from 'components/NeedPlatePDF';
import ProductName from 'components/ProductName';
import WorkOrderId from 'components/WorkOrderId';
import { PLATE_STATUS_COLORS, PlateStatus } from 'const';
import { useAuth } from 'features/auth/authHook';
import { useDialog } from 'features/dialog/dialogHook';
import { WorkOrderDto } from 'features/workOrder/interface';
import { workOrderApi } from 'features/workOrder/workOrderApi';
import { useWorkOrderDisplay } from 'hooks/useWorkOrderDisplay';
import React, { ChangeEvent, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';
import { getProductTitle } from 'utils/product';
import { getWorkOrderToUpdate } from 'utils/workOrder';

import {
  Chip,
  createStyles,
  IconButton,
  List,
  ListItem,
  makeStyles,
  Theme,
  Tooltip,
  Typography,
} from '@material-ui/core';
import { Done, InsertEmoticon, Print } from '@material-ui/icons';
import { Pagination, Skeleton } from '@material-ui/lab';
import { BlobProvider } from '@react-pdf/renderer';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    workOrderListItem: {
      display: 'grid',
      gridTemplateColumns: '2fr auto auto',
      gridTemplateAreas: `
        "workOrderId plateStatus completeButton"
        "productName plateStatus completeButton"
        "productSize plateStatus completeButton"
      `,
      gridGap: theme.spacing(0.5),

      '& .workOrderId': {
        gridArea: 'workOrderId',
      },
      '& .productName': {
        gridArea: 'productName',
      },
      '& .productSize': {
        gridArea: 'productSize',
        fontSize: 14,
      },
      '& .plateStatus': {
        gridArea: 'plateStatus',
        color: theme.palette.common.white,
      },
      '& .completeButton': {
        gridArea: 'completeButton',
      },
    },
    pagination: {
      paddingTop: theme.spacing(2),
      display: 'flex',
      justifyContent: 'center',
    },
    noPlatesToProduce: {
      display: 'flex',
      flexDirection: 'column',
      '& .icon': {
        color: theme.palette.primary.main,
        fontSize: 64,
        margin: theme.spacing(2),
      },
    },
  }),
);

const LIST_ITEM_HEIGHT = 100;

function WorkOrderListItem({
  workOrder,
  onComplete,
}: {
  workOrder: WorkOrderDto;
  onComplete: () => void;
}) {
  const { t } = useTranslation();
  const classes = useStyles();
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
    <ListItem className={classes.workOrderListItem} divider style={{ height: LIST_ITEM_HEIGHT }}>
      <WorkOrderId className="workOrderId" workOrder={workOrder} />
      <ProductName className="productName" product={workOrder.product} />
      <Typography className="productSize">{productSize}</Typography>
      <Chip className="plateStatus" label={plateStatus} style={{ backgroundColor }} />
      {canUpdateWorkOrders && (
        <Tooltip title={t('common:complete') as string}>
          <IconButton className="completeButton" color="primary" onClick={handleClickComplete}>
            <Done />
          </IconButton>
        </Tooltip>
      )}
    </ListItem>
  );
}

function WorkOrderListItemSkeleton() {
  const classes = useStyles();

  return (
    <ListItem className={classes.workOrderListItem} divider>
      <Skeleton className="workOrderId" width="60%" height={24} />
      <Skeleton className="productName" width="80%" height={32} />
      <Skeleton className="productSize" width="50%" height={21} />
      <Skeleton className="plateStatus" width={75} height={32} />
      <Skeleton className="completeButton" width={48} height={48} variant="circle" />
    </ListItem>
  );
}

function NoPlatesToProduce() {
  const { t } = useTranslation();
  const classes = useStyles();

  return (
    <ListItem className={classes.noPlatesToProduce}>
      <InsertEmoticon className="icon" />
      <Typography color="primary">{t('dashboard:noPlatesToProduce')}</Typography>
    </ListItem>
  );
}

function PlateStatusCard() {
  const { t } = useTranslation();
  const classes = useStyles();
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
        className={classes.pagination}
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
