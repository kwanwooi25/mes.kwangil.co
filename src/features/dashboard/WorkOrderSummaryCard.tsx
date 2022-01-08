import { useAppDispatch } from 'app/store';
import classNames from 'classnames';
import DashboardCard from 'components/DashboardCard';
import CustomToggleButton, { ToggleButtonOption } from 'components/form/CustomToggleButton';
import { routerActions } from 'connected-react-router';
import { Path, PrintSide, WorkOrderStatus } from 'const';
import { endOfMonth, endOfYear, startOfMonth, startOfYear, subMonths, subYears } from 'date-fns';
import { useAuth } from 'features/auth/authHook';
import { WorkOrderCount } from 'features/workOrder/interface';
import { workOrderApi } from 'features/workOrder/workOrderApi';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';
import { formatDate } from 'utils/date';
import { formatDigit } from 'utils/string';

import { Button, createStyles, lighten, makeStyles, Theme } from '@material-ui/core';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import { Skeleton } from '@material-ui/lab';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    orderedAtRangeButtons: {
      paddingBottom: theme.spacing(2),
    },
    workOrderCountByPrintSide: {
      paddingBottom: theme.spacing(2),
      display: 'flex',
      '& > div > div': {
        padding: theme.spacing(1, 1.5),
      },
      '& .printNone': {
        color: theme.palette.success.dark,
        '& .bar': {
          fontSize: 20,
          fontWeight: 'bold',
          color: theme.palette.common.white,
          backgroundColor: theme.palette.success.main,
          borderTopLeftRadius: theme.spacing(1),
          borderBottomLeftRadius: theme.spacing(1),
          '& .percent': {
            fontSize: 12,
            fontWeight: 'normal',
            marginLeft: theme.spacing(1),
          },
        },
      },
      '& .print': {
        color: theme.palette.warning.dark,
        textAlign: 'right',
        '& .bar': {
          fontSize: 20,
          fontWeight: 'bold',
          color: theme.palette.common.white,
          backgroundColor: theme.palette.warning.main,
          borderTopRightRadius: theme.spacing(1),
          borderBottomRightRadius: theme.spacing(1),
          '& .percent': {
            fontSize: 12,
            fontWeight: 'normal',
            marginRight: theme.spacing(1),
          },
        },
      },
    },
    workOrderCountByStatus: {
      display: 'grid',
      gridTemplateColumns: 'repeat(5, 1fr)',
      gridGap: theme.spacing(1),
    },
    item: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      borderRadius: theme.spacing(1),
      border: `1px solid ${lighten(theme.palette.primary.dark, 0.85)}`,
    },
    status: {
      display: 'flex',
      justifyContent: 'center',
      padding: theme.spacing(1),
      fontSize: 14,
      borderBottom: `1px solid ${lighten(theme.palette.primary.dark, 0.9)}`,
      borderTopLeftRadius: theme.spacing(1),
      borderTopRightRadius: theme.spacing(1),
    },
    count: {
      display: 'flex',
      justifyContent: 'center',
      padding: theme.spacing(1),
      fontSize: 22,
      fontWeight: 'bold',
      backgroundColor: 'transparent',
    },
    [WorkOrderStatus.NOT_STARTED]: {
      color: theme.palette.NOT_STARTED.dark,
      '& .status': {
        backgroundColor: theme.palette.NOT_STARTED.light,
      },
    },
    [WorkOrderStatus.EXTRUDING]: {
      color: theme.palette.EXTRUDING.dark,
      '& .status': {
        backgroundColor: theme.palette.EXTRUDING.light,
      },
    },
    [WorkOrderStatus.PRINTING]: {
      color: theme.palette.PRINTING.dark,
      '& .status': {
        backgroundColor: theme.palette.PRINTING.light,
      },
    },
    [WorkOrderStatus.CUTTING]: {
      color: theme.palette.CUTTING.dark,
      '& .status': {
        backgroundColor: theme.palette.CUTTING.light,
      },
    },
    [WorkOrderStatus.COMPLETED]: {
      color: theme.palette.COMPLETED.dark,
      '& .status': {
        backgroundColor: theme.palette.COMPLETED.light,
      },
    },
  }),
);

enum OrderedAtRange {
  LAST_MONTH = 'lastMonth',
  THIS_MONTH = 'thisMonth',
  LAST_YEAR = 'lastYear',
  THIS_YEAR = 'thisYear',
}

function WorkOrderSummaryCard() {
  const { t } = useTranslation();
  const classes = useStyles();
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
      <div className={classes.orderedAtRangeButtons}>
        <CustomToggleButton
          value={orderedAtRange}
          options={orderedAtRangeOptions}
          onChange={handleChangeOrderedAtRange}
        />
      </div>
      <div className={classes.workOrderCountByPrintSide}>
        <div className="printNone" style={{ width: `${printNoneRatio}%` }}>
          <div>{t('products:printNone')}</div>
          <div className="bar">
            <span>{formatDigit(printNoneCount)}</span>
            <span className="percent">({printNoneRatio.toFixed(1)}%)</span>
          </div>
        </div>
        <div className="print" style={{ width: `${printRatio}%` }}>
          <div>{t('products:print')}</div>
          <div className="bar">
            <span className="percent">({printRatio.toFixed(1)}%)</span>
            <span>{formatDigit(printCount)}</span>
          </div>
        </div>
      </div>
      <div className={classes.workOrderCountByStatus}>
        {Object.entries(workOrderCount.byStatus).map(([status, count]) => (
          <div
            key={status}
            className={classNames(classes.item, classes[status as WorkOrderStatus])}
          >
            <div className={classNames(classes.status, 'status')}>
              {t(`workOrders:workOrderStatus:${status}`)}
            </div>
            <div className={classNames(classes.count, 'count')}>
              {isLoading ? <Skeleton height="100%" width={30} /> : formatDigit(count)}
            </div>
          </div>
        ))}
      </div>
    </DashboardCard>
  );
}

export default WorkOrderSummaryCard;
