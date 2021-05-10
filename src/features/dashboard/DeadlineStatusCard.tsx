import AccountName from 'components/AccountName';
import DashboardCard from 'components/DashboardCard';
import CustomToggleButton, { ToggleButtonOption } from 'components/form/CustomToggleButton';
import ProductName from 'components/ProductName';
import { DeadlineStatus } from 'const';
import { WorkOrderDto, WorkOrdersByDeadline } from 'features/workOrder/interface';
import { workOrderApi } from 'features/workOrder/workOrderApi';
import { useWorkOrderDisplay } from 'hooks/useWorkOrderDisplay';
import React, { ChangeEvent, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { formatDate } from 'utils/date';

import {
    Chip, createStyles, List, ListItem, makeStyles, Theme, Typography
} from '@material-ui/core';
import InsertEmoticonIcon from '@material-ui/icons/InsertEmoticon';
import { Pagination, Skeleton } from '@material-ui/lab';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    deadlineStatusCard: {
      gridRowEnd: 'span 2',
    },
    deadlineStatusButtons: {},
    workOrderListItem: {
      display: 'grid',
      gridTemplateColumns: '1fr auto',
      gridTemplateAreas: `
        "accountName deliverBy"
        "productName workOrderStatus"
        "productSize orderQuantity"
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
      '& .deliverBy': {
        gridArea: 'deliverBy',
        justifySelf: 'end',
        alignSelf: 'start',
      },
      '& .workOrderStatus': {
        gridArea: 'workOrderStatus',
        justifySelf: 'end',
        alignSelf: 'center',
      },
      '& .orderQuantity': {
        gridArea: 'orderQuantity',
        fontSize: 20,
        placeSelf: 'end',
      },
      '& .accountNameText': {
        fontSize: 12,
        fontWeight: 'normal',
      },
    },
    pagination: {
      paddingTop: theme.spacing(2),
      display: 'flex',
      justifyContent: 'center',
    },
    noWorkOrders: {
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

const WorkOrderListItem = ({ workOrder }: { workOrder: WorkOrderDto }) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const {
    productSize,
    orderQuantity,
    deliverBy,
    deliverByStyle,
    workOrderStatus,
    workOrderStatusStyle,
  } = useWorkOrderDisplay(workOrder, t);

  return (
    <ListItem className={classes.workOrderListItem} divider>
      <AccountName className="accountName" linkClassName="accountNameText" account={workOrder.product.account} />
      <ProductName className="productName" product={workOrder.product} />
      <Typography className="productSize">{productSize}</Typography>
      <Typography className="deliverBy" style={deliverByStyle}>
        {deliverBy}
      </Typography>
      <Chip className="workOrderStatus" size="small" label={workOrderStatus} style={workOrderStatusStyle} />
      <Typography className="orderQuantity">{orderQuantity}</Typography>
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
      <Skeleton className="deliverBy" width={85} height={24} />
      <Skeleton className="workOrderStatus" width={50} height={24} />
      <Skeleton className="orderQuantity" width={85} height={30} />
    </ListItem>
  );
};

const NoWorkOrders = ({ deadlineStatus }: { deadlineStatus: DeadlineStatus }) => {
  const { t } = useTranslation();
  const classes = useStyles();

  return (
    <ListItem className={classes.noWorkOrders}>
      <InsertEmoticonIcon className="icon" />
      <Typography color="primary">{t(`dashboard:noWorkOrders:${deadlineStatus}`)}</Typography>
    </ListItem>
  );
};

export interface DeadlineStatusCardProps {}

const DeadlineStatusCard = (props: DeadlineStatusCardProps) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [deadlineStatus, setDeadlineStatus] = useState<DeadlineStatus>(DeadlineStatus.IMMINENT);
  const [workOrdersByDeadline, setWorkOrdersByDeadline] = useState<WorkOrdersByDeadline>({ overdue: [], imminent: [] });
  const [workOrdersToShow, setWorkOrdersToShow] = useState<WorkOrderDto[]>([]);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  const workOrderCountToDisplay = 4;

  const deadlineStatusOptions: ToggleButtonOption<DeadlineStatus>[] = [
    {
      value: DeadlineStatus.OVERDUE,
      label: `${t('common:overdue')} (${workOrdersByDeadline[DeadlineStatus.OVERDUE].length})`,
    },
    {
      value: DeadlineStatus.IMMINENT,
      label: `${t('common:imminent')} (${workOrdersByDeadline[DeadlineStatus.IMMINENT].length})`,
    },
  ];

  const handleChangeDeadlineStatus = (deadlineStatus: DeadlineStatus) => setDeadlineStatus(deadlineStatus);
  const handlePageChange = (e: ChangeEvent<unknown>, page: number) => setPage(page);

  const getWorkOrdersByDeadline = async () => {
    setIsLoading(true);
    setWorkOrdersByDeadline({ overdue: [], imminent: [] });
    const deadline = formatDate(new Date());
    const workOrdersByDeadline: WorkOrdersByDeadline = await workOrderApi.getWorkOrdersByDeadline({ deadline });
    setWorkOrdersByDeadline(workOrdersByDeadline);
    setIsLoading(false);
  };

  const renderSkeletons = () =>
    Array(workOrderCountToDisplay)
      .fill('')
      .map((_, index) => <WorkOrderListItemSkeleton key={index} />);

  const renderWorkOrders = () =>
    workOrdersToShow.map((workOrder) => <WorkOrderListItem key={workOrder.id} workOrder={workOrder} />);

  useEffect(() => {
    getWorkOrdersByDeadline();
  }, []);

  useEffect(() => {
    const workOrders = [...workOrdersByDeadline[deadlineStatus]];
    setWorkOrdersToShow(workOrders.slice(0, workOrderCountToDisplay));
    setPage(1);
    setTotalPages(Math.ceil(workOrders.length / workOrderCountToDisplay));
  }, [workOrdersByDeadline, deadlineStatus]);

  useEffect(() => {
    const workOrders = [...workOrdersByDeadline[deadlineStatus]];
    const offset = (page - 1) * workOrderCountToDisplay;
    setWorkOrdersToShow(workOrders.slice(offset, offset + workOrderCountToDisplay));
  }, [page]);

  return (
    <DashboardCard
      title={t('dashboard:deadlineStatus')}
      onRefresh={getWorkOrdersByDeadline}
      className={classes.deadlineStatusCard}
    >
      <CustomToggleButton
        className={classes.deadlineStatusButtons}
        value={deadlineStatus}
        options={deadlineStatusOptions}
        onChange={handleChangeDeadlineStatus}
      />
      <List disablePadding style={{ height: 111 * workOrderCountToDisplay }}>
        {isLoading ? (
          renderSkeletons()
        ) : !workOrdersToShow.length ? (
          <NoWorkOrders deadlineStatus={deadlineStatus} />
        ) : (
          renderWorkOrders()
        )}
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

export default DeadlineStatusCard;
