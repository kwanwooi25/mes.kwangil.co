import classNames from 'classnames';
import { DeadlineStatus } from 'const';
import { WorkOrderDto, WorkOrdersByDeadline } from 'features/workOrder/interface';
import { workOrderApi } from 'features/workOrder/workOrderApi';
import { useWorkOrderDisplay } from 'hooks/useWorkOrderDisplay';
import React, { ChangeEvent, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';
import CustomToggleButton, { ToggleButtonOption } from 'ui/elements/CustomToggleButton';
import DashboardCard from 'ui/elements/DashboardCard';
import ProductName from 'ui/elements/ProductName';
import WorkOrderId from 'ui/elements/WorkOrderId';
import { formatDate } from 'utils/date';

import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon';
import { Chip, List, ListItem, Pagination, Skeleton } from '@mui/material';

const LIST_ITEM_HEIGHT = 121;

function WorkOrderListItem({ workOrder }: { workOrder: WorkOrderDto }) {
  const { t } = useTranslation();
  const {
    productSize,
    orderQuantity,
    deliverBy,
    deliverByClassName,
    workOrderStatus,
    workOrderStatusClassName,
  } = useWorkOrderDisplay(workOrder, t);

  return (
    <ListItem className="!grid grid-cols-[1fr_auto] gap-x-2 gap-y-1" divider>
      <WorkOrderId workOrder={workOrder} />
      <span className={classNames('justify-self-end', deliverByClassName)}>{deliverBy}</span>
      <ProductName product={workOrder.product} />
      <Chip
        className={classNames('justify-self-end', workOrderStatusClassName)}
        size="small"
        label={workOrderStatus}
      />
      <span className="px-2">{productSize}</span>
      <span className="justify-self-end">{orderQuantity}</span>
    </ListItem>
  );
}

function WorkOrderListItemSkeleton() {
  return (
    <ListItem className="!grid grid-cols-[1fr_auto] gap-x-2 gap-y-1" divider>
      <Skeleton width="50%" height={36} />
      <Skeleton className="justify-self-end" width={85} height={24} />
      <Skeleton width="80%" height={36} />
      <Skeleton className="justify-self-end" width={50} height={24} />
      <Skeleton width="50%" height={24} />
      <Skeleton className="justify-self-end" width={85} height={24} />
    </ListItem>
  );
}

function NoWorkOrders({ deadlineStatus }: { deadlineStatus: DeadlineStatus }) {
  const { t } = useTranslation();

  return (
    <ListItem className="flex flex-col">
      <InsertEmoticonIcon className="m-4 !text-6xl text-primary" />
      <p className="text-primary">{t(`dashboard:noWorkOrders:${deadlineStatus}`)}</p>
    </ListItem>
  );
}

function DeadlineStatusCard() {
  const { t } = useTranslation();
  const {
    isLoading,
    data: workOrdersByDeadline = { overdue: [], imminent: [] },
    refetch,
  } = useQuery(
    'workOrdersByDeadline',
    async (): Promise<WorkOrdersByDeadline> =>
      workOrderApi.getWorkOrdersByDeadline({ deadline: formatDate(new Date()) }),
  );
  const [deadlineStatus, setDeadlineStatus] = useState<DeadlineStatus>(DeadlineStatus.IMMINENT);
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

  const handleChangeDeadlineStatus = (status: DeadlineStatus) => setDeadlineStatus(status);
  const handlePageChange = (e: ChangeEvent<unknown>, p: number) => setPage(p);

  const renderSkeletons = () =>
    Array(workOrderCountToDisplay)
      .fill('')
      // eslint-disable-next-line react/no-array-index-key
      .map((_, index) => <WorkOrderListItemSkeleton key={index} />);

  const renderWorkOrders = () =>
    workOrdersToShow.map((workOrder) => (
      <WorkOrderListItem key={workOrder.id} workOrder={workOrder} />
    ));

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
      className="row-[span_2]"
      title={t('dashboard:deadlineStatus')}
      onRefresh={refetch}
    >
      <CustomToggleButton
        value={deadlineStatus}
        options={deadlineStatusOptions}
        onChange={handleChangeDeadlineStatus}
      />
      <List disablePadding style={{ height: LIST_ITEM_HEIGHT * workOrderCountToDisplay }}>
        {isLoading && renderSkeletons()}
        {!isLoading && !workOrdersToShow.length && <NoWorkOrders deadlineStatus={deadlineStatus} />}
        {!isLoading && !!workOrdersToShow.length && renderWorkOrders()}
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

export default DeadlineStatusCard;
