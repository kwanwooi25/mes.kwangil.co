import AccountName from 'components/AccountName';
import DashboardCard from 'components/DashboardCard';
import PlateDialog from 'components/dialog/Plate';
import ProductName from 'components/ProductName';
import { PlateStatus } from 'const';
import { useAuth } from 'features/auth/authHook';
import { useDialog } from 'features/dialog/dialogHook';
import { WorkOrderDto } from 'features/workOrder/interface';
import { workOrderApi } from 'features/workOrder/workOrderApi';
import { useWorkOrderDisplay } from 'hooks/useWorkOrderDisplay';
import React, { ChangeEvent, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getWorkOrderToUpdate } from 'utils/workOrder';

import {
    Chip, createStyles, IconButton, List, ListItem, makeStyles, Theme, Tooltip, Typography
} from '@material-ui/core';
import { grey, red, yellow } from '@material-ui/core/colors';
import DoneIcon from '@material-ui/icons/Done';
import InsertEmoticonIcon from '@material-ui/icons/InsertEmoticon';
import { Pagination, Skeleton } from '@material-ui/lab';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    workOrderListItem: {
      display: 'grid',
      gridTemplateColumns: '2fr auto auto',
      gridTemplateAreas: `
        "accountName plateStatus completeButton"
        "productName plateStatus completeButton"
        "productSize plateStatus completeButton"
      `,
      gridGap: theme.spacing(0.5),

      '& .accountName': {
        gridArea: 'accountName',
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
      '& .accountNameText': {
        fontSize: 12,
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
  })
);

const LIST_ITEM_HEIGHT = 100;

const COLORS: { [key in PlateStatus]: string } = {
  [PlateStatus.NEW]: red[700],
  [PlateStatus.UPDATE]: yellow[700],
  [PlateStatus.CONFIRM]: grey[700],
};

const WorkOrderListItem = ({ workOrder, onComplete }: { workOrder: WorkOrderDto; onComplete: () => void }) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const { productSize, plateStatus } = useWorkOrderDisplay(workOrder, t);
  const { openDialog, closeDialog } = useDialog();
  const { isUser } = useAuth();
  const backgroundColor = COLORS[workOrder.plateStatus];

  const handleClickComplete = () => {
    openDialog(
      <PlateDialog
        products={[workOrder.product]}
        onClose={async (result?: boolean) => {
          if (result) {
            const { id } = workOrder;
            await workOrderApi.updateWorkOrder({ ...getWorkOrderToUpdate(workOrder), id, isPlateReady: true });
            onComplete();
          }
          closeDialog();
        }}
      />
    );
  };

  return (
    <ListItem className={classes.workOrderListItem} divider style={{ height: LIST_ITEM_HEIGHT }}>
      <AccountName className="accountName" linkClassName="accountNameText" account={workOrder.product.account} />
      <ProductName className="productName" product={workOrder.product} />
      <Typography className="productSize">{productSize}</Typography>
      <Chip className="plateStatus" label={plateStatus} style={{ backgroundColor }} />
      {!isUser && (
        <Tooltip title={t('common:complete') as string}>
          <IconButton className="completeButton" color="primary" onClick={handleClickComplete}>
            <DoneIcon />
          </IconButton>
        </Tooltip>
      )}
    </ListItem>
  );
};

const WorkOrderListItemSkeleton = () => {
  const classes = useStyles();

  return (
    <ListItem className={classes.workOrderListItem} divider>
      <Skeleton className="accountName" width="60%" height={21} />
      <Skeleton className="productName" width="80%" height={32} />
      <Skeleton className="productSize" width="50%" height={21} />
      <Skeleton className="plateStatus" width={75} height={32} />
      <Skeleton className="completeButton" width={48} height={48} variant="circle" />
    </ListItem>
  );
};

const NoPlatesToProduce = () => {
  const { t } = useTranslation();
  const classes = useStyles();

  return (
    <ListItem className={classes.noPlatesToProduce}>
      <InsertEmoticonIcon className="icon" />
      <Typography color="primary">{t('dashboard:noPlatesToProduce')}</Typography>
    </ListItem>
  );
};

export interface PlateStatusCardProps {}

const PlateStatusCard = (props: PlateStatusCardProps) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [workOrders, setWorkOrders] = useState<WorkOrderDto[]>([]);
  const [workOrdersToShow, setWorkOrdersToShow] = useState<WorkOrderDto[]>([]);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  const workOrderCountToDisplay = 4;

  const handlePageChange = (e: ChangeEvent<unknown>, page: number) => setPage(page);

  const getWorkOrdersNeedPlate = async () => {
    setIsLoading(true);
    const workOrders = await workOrderApi.getWorkOrdersNeedPlate();
    setWorkOrders(workOrders);
    setIsLoading(false);
  };

  const renderSkeletons = () =>
    Array(workOrderCountToDisplay)
      .fill('')
      .map((_, index) => <WorkOrderListItemSkeleton key={index} />);

  const renderWorkOrders = () =>
    workOrdersToShow.map((workOrder) => (
      <WorkOrderListItem key={workOrder.id} workOrder={workOrder} onComplete={getWorkOrdersNeedPlate} />
    ));

  useEffect(() => {
    getWorkOrdersNeedPlate();
  }, []);

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
    <DashboardCard title={t('dashboard:plateStatus')} onRefresh={getWorkOrdersNeedPlate}>
      <List disablePadding style={{ height: LIST_ITEM_HEIGHT * workOrderCountToDisplay }}>
        {isLoading ? renderSkeletons() : !workOrders.length ? <NoPlatesToProduce /> : renderWorkOrders()}
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
};

export default PlateStatusCard;
