import { useAppDispatch } from 'app/store';
import classNames from 'classnames';
import { routerActions } from 'connected-react-router';
import { Path, PrintSide, WorkOrderStatus } from 'const';
import { endOfMonth, endOfYear, startOfMonth, startOfYear, subMonths, subYears } from 'date-fns';
import { useAuth } from 'features/auth/authHook';
import { WorkOrderCount } from 'features/workOrder/interface';
import { workOrderApi } from 'features/workOrder/workOrderApi';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';
import CustomToggleButton, { ToggleButtonOption } from 'ui/elements/CustomToggleButton';
import DashboardCard from 'ui/elements/DashboardCard';
import { formatDate } from 'utils/date';
import { formatDigit } from 'utils/string';

import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { Button, Skeleton } from '@mui/material';

enum OrderedAtRange {
  LAST_MONTH = 'lastMonth',
  THIS_MONTH = 'thisMonth',
  LAST_YEAR = 'lastYear',
  THIS_YEAR = 'thisYear',
}

function WorkOrderSummaryCard() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { canViewWorkOrders } = useAuth();
  const [orderedAtRange, setOrderedAtRange] = useState<OrderedAtRange>(OrderedAtRange.THIS_MONTH);

  const getOrderedAt = (range: OrderedAtRange) => {
    let from = '';
    let to = '';
    switch (range) {
      case OrderedAtRange.LAST_MONTH:
        from = formatDate(startOfMonth(subMonths(new Date(), 1)));
        to = formatDate(endOfMonth(subMonths(new Date(), 1)));
        break;
      case OrderedAtRange.THIS_MONTH:
        from = formatDate(startOfMonth(new Date()));
        to = formatDate(endOfMonth(new Date()));
        break;
      case OrderedAtRange.LAST_YEAR:
        from = formatDate(startOfYear(subYears(new Date(), 1)));
        to = formatDate(endOfYear(subYears(new Date(), 1)));
        break;
      case OrderedAtRange.THIS_YEAR:
        from = formatDate(startOfYear(new Date()));
        to = formatDate(endOfYear(new Date()));
        break;
      default:
        break;
    }
    return [from, to];
  };

  const {
    isLoading,
    data: workOrderCount = {
      byStatus: {
        [WorkOrderStatus.NOT_STARTED]: 0,
        [WorkOrderStatus.EXTRUDING]: 0,
        [WorkOrderStatus.PRINTING]: 0,
        [WorkOrderStatus.CUTTING]: 0,
        [WorkOrderStatus.COMPLETED]: 0,
      },
      byPrintSide: {
        [PrintSide.NONE]: 0,
        [PrintSide.SINGLE]: 0,
        [PrintSide.DOUBLE]: 0,
      },
    },
    refetch,
  } = useQuery(
    'workOrderCount',
    async (): Promise<WorkOrderCount> =>
      workOrderApi.getWorkOrderCount({ orderedAt: getOrderedAt(orderedAtRange) }),
  );

  const { NONE, SINGLE, DOUBLE } = workOrderCount.byPrintSide;
  const printNoneCount = NONE;
  const printCount = SINGLE + DOUBLE;
  const totalCount = printNoneCount + printCount;
  const printNoneRatio = (printNoneCount / totalCount) * 100 || 50;
  const printRatio = (printCount / totalCount) * 100 || 50;

  const orderedAtRangeOptions: ToggleButtonOption<OrderedAtRange>[] = [
    { value: OrderedAtRange.LAST_MONTH, label: t('common:lastMonth') },
    { value: OrderedAtRange.THIS_MONTH, label: t('common:thisMonth') },
    { value: OrderedAtRange.LAST_YEAR, label: t('common:lastYear') },
    { value: OrderedAtRange.THIS_YEAR, label: t('common:thisYear') },
  ];

  const handleChangeOrderedAtRange = (value: OrderedAtRange) => setOrderedAtRange(value);

  const moveToWorkOrderPage = () => dispatch(routerActions.push(Path.WORK_ORDERS));

  useEffect(() => {
    refetch();
  }, [orderedAtRange]);

  return (
    <DashboardCard
      title={t('dashboard:workOrderCount')}
      onRefresh={refetch}
      headerButton={
        canViewWorkOrders ? (
          <Button
            color="primary"
            size="small"
            onClick={moveToWorkOrderPage}
            endIcon={<ChevronRightIcon />}
          >
            {t('common:showAll')}
          </Button>
        ) : undefined
      }
    >
      <div className="pb-4">
        <CustomToggleButton
          value={orderedAtRange}
          options={orderedAtRangeOptions}
          onChange={handleChangeOrderedAtRange}
        />
      </div>
      <div className="flex pb-4">
        <div style={{ width: `${printNoneRatio}%` }}>
          <div className="py-2 px-3 font-bold text-green-700">{t('products:printNone')}</div>
          <div className="py-2 px-3 text-xl font-bold text-white bg-green-500 rounded-l-md">
            <span>{formatDigit(printNoneCount)}</span>
            <span className="ml-2 text-xs">({printNoneRatio.toFixed(1)}%)</span>
          </div>
        </div>
        <div className="text-right" style={{ width: `${printRatio}%` }}>
          <div className="py-2 px-3 font-bold text-orange-700">{t('products:print')}</div>
          <div className="py-2 px-3 text-xl font-bold text-white bg-orange-500 rounded-r-md">
            <span className="mr-2 text-xs">({printRatio.toFixed(1)}%)</span>
            <span>{formatDigit(printCount)}</span>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-5 gap-2">
        {Object.entries(workOrderCount.byStatus).map(([status, count]) => (
          <div
            key={status}
            className={classNames('flex flex-col justify-between rounded-md border', {
              'border-red-800/10': status === WorkOrderStatus.NOT_STARTED,
              'border-orange-800/10': status === WorkOrderStatus.EXTRUDING,
              'border-yellow-800/10': status === WorkOrderStatus.PRINTING,
              'border-emerald-800/10': status === WorkOrderStatus.CUTTING,
              'border-gray-800/10': status === WorkOrderStatus.COMPLETED,
            })}
          >
            <div
              className={classNames(
                'flex justify-center p-2 text-sm border-b rounded-t-md',
                {
                  'bg-red-300/20': status === WorkOrderStatus.NOT_STARTED,
                  'bg-orange-300/20': status === WorkOrderStatus.EXTRUDING,
                  'bg-yellow-300/20': status === WorkOrderStatus.PRINTING,
                  'bg-emerald-300/20': status === WorkOrderStatus.CUTTING,
                  'bg-gray-300/20': status === WorkOrderStatus.COMPLETED,
                },
                {
                  'border-red-800/10': status === WorkOrderStatus.NOT_STARTED,
                  'border-orange-800/10': status === WorkOrderStatus.EXTRUDING,
                  'border-yellow-800/10': status === WorkOrderStatus.PRINTING,
                  'border-emerald-800/10': status === WorkOrderStatus.CUTTING,
                  'border-gray-800/10': status === WorkOrderStatus.COMPLETED,
                },
                {
                  'text-red-700': status === WorkOrderStatus.NOT_STARTED,
                  'text-orange-700': status === WorkOrderStatus.EXTRUDING,
                  'text-yellow-700': status === WorkOrderStatus.PRINTING,
                  'text-emerald-700': status === WorkOrderStatus.CUTTING,
                  'text-gray-700': status === WorkOrderStatus.COMPLETED,
                },
              )}
            >
              {t(`workOrders:workOrderStatus:${status}`)}
            </div>
            <div
              className={classNames('flex justify-center p-2 text-xl font-bold bg-transparent', {
                'text-red-700': status === WorkOrderStatus.NOT_STARTED,
                'text-orange-700': status === WorkOrderStatus.EXTRUDING,
                'text-yellow-700': status === WorkOrderStatus.PRINTING,
                'text-emerald-700': status === WorkOrderStatus.CUTTING,
                'text-gray-700': status === WorkOrderStatus.COMPLETED,
              })}
            >
              {isLoading ? <Skeleton height="100%" width={30} /> : formatDigit(count)}
            </div>
          </div>
        ))}
      </div>
    </DashboardCard>
  );
}

export default WorkOrderSummaryCard;
