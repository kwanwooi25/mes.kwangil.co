import {
  Checkbox,
  Chip,
  IconButton,
  ListItem,
  ListItemIcon,
  ListItemProps,
  ListItemSecondaryAction,
  ListItemText,
  Menu,
  MenuItem,
  Theme,
  Typography,
  createStyles,
  lighten,
  makeStyles,
} from '@material-ui/core';
import React, { MouseEvent, memo, useCallback, useState } from 'react';
import { camelCase, upperFirst } from 'lodash';
import { grey, lightGreen, orange, red, yellow } from '@material-ui/core/colors';
import { useAppDispatch, useAppSelector } from 'app/store';
import { workOrderActions, workOrderSelectors } from './workOrderSlice';

import AccountName from 'components/AccountName';
import ConfirmDialog from 'components/dialog/Confirm';
import DoneIcon from '@material-ui/icons/Done';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import ProductName from 'components/ProductName';
import SelectWorkOrderStatus from 'components/SelectWorkOrderStatus';
import { Skeleton } from '@material-ui/lab';
import WorkOrderDialog from 'components/dialog/WorkOrder';
import { WorkOrderDto } from './interface';
import WorkOrderId from 'components/WorkOrderId';
import { WorkOrderStatus } from 'const';
import WorkOrdersCompleteDialog from 'components/dialog/WorkOrdersComplete';
import { differenceInBusinessDays } from 'date-fns';
import { getWorkOrderToUpdate } from 'utils/workOrder';
import { useDialog } from 'features/dialog/dialogHook';
import { useScreenSize } from 'hooks/useScreenSize';
import { useTranslation } from 'react-i18next';
import { useWorkOrderDisplay } from 'hooks/useWorkOrderDisplay';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    [WorkOrderStatus.NOT_STARTED]: {
      background: lighten(red[50], 0.3),
    },
    [WorkOrderStatus.EXTRUDING]: {
      background: lighten(orange[50], 0.3),
    },
    [WorkOrderStatus.PRINTING]: {
      background: lighten(yellow[50], 0.3),
    },
    [WorkOrderStatus.CUTTING]: {
      background: lighten(lightGreen[50], 0.3),
    },
    [WorkOrderStatus.COMPLETED]: {
      background: grey[100],
    },
    workOrderDetail: {
      display: 'grid',
      gridTemplateColumns: '1fr 100px',
      gridTemplateAreas: `
        "workOrderId workOrderId"
        "dates workOrderStatus"
        "productNames productNames"
        "productDetail productDetail"
        "quantities quantities"
      `,
      gridGap: theme.spacing(1),
      [theme.breakpoints.up('sm')]: {
        gridTemplateColumns: '1fr 130px 100px',
        gridTemplateAreas: `
          "workOrderId dates workOrderStatus"
          "productNames productNames productNames"
          "productDetail quantities quantities"
        `,
        gridGap: theme.spacing(1, 2),
      },
      [theme.breakpoints.up('md')]: {
        gridTemplateColumns: '1fr 1fr 130px 100px',
        gridTemplateAreas: `
          "workOrderId workOrderId dates workOrderStatus"
          "productNames productDetail quantities quantities"
        `,
      },
      [theme.breakpoints.up('xl')]: {
        gridTemplateColumns: '105px 130px 3fr 2fr 200px 100px',
        gridTemplateAreas: `
          "workOrderId dates productNames productDetail quantities workOrderStatus"
        `,
        alignItems: 'center',
      },
    },
    workOrderId: {
      gridArea: 'workOrderId',
      display: 'flex',
      justifyContent: 'space-between',
      [theme.breakpoints.up('sm')]: {
        flexDirection: 'column',
        justifyContent: 'flex-start',
      },
    },
    workOrderTags: {
      '& > *': {
        marginLeft: theme.spacing(0.5),
        '&:first-child': {
          marginLeft: -theme.spacing(0.5),
        },
      },
    },
    isUrgent: {
      background: yellow[500],
      color: theme.palette.getContrastText(yellow[500]),
      fontWeight: 'bold',
    },
    shouldBePunctual: {
      background: red[500],
      color: theme.palette.getContrastText(red[500]),
      fontWeight: 'bold',
    },
    dates: {
      gridArea: 'dates',
    },
    workOrderStatus: {
      gridArea: 'workOrderStatus',
      display: 'flex',
      justifyContent: 'center',
    },
    selectWorkOrderStatus: {
      width: '100px',
    },
    productNames: {
      gridArea: 'productNames',
    },
    accountName: {
      fontSize: theme.typography.body2.fontSize,
    },
    productDetail: {
      gridArea: 'productDetail',
    },
    quantities: {
      gridArea: 'quantities',
    },

    printButton: {
      padding: theme.spacing(0.75, 2),
      '&:hover': {
        textDecoration: 'none',
      },
    },

    label: {
      fontSize: theme.typography.caption.fontSize,
    },
    value: {
      fontSize: theme.typography.body1.fontSize,
    },
  })
);

export interface WorkOrderListItemProps extends ListItemProps {
  workOrder: WorkOrderDto;
  itemHeight: number;
  isSelected: boolean;
}

const WorkOrderListItem = ({ workOrder, itemHeight, isSelected }: WorkOrderListItemProps) => {
  const { t } = useTranslation('workOrders');
  const classes = useStyles();
  const { isMobileLayout, isTabletLayout, isDesktopLayout } = useScreenSize();

  const dispatch = useAppDispatch();
  const query = useAppSelector(workOrderSelectors.query);
  const { toggleSelection, deleteWorkOrders, updateWorkOrder } = workOrderActions;
  const { openDialog, closeDialog } = useDialog();

  const [menuAnchorEl, setMenuAnchorEl] = useState<HTMLElement | null>(null);

  const handleSelectionChange = useCallback(() => {
    dispatch(toggleSelection(workOrder.id));
  }, [workOrder]);

  const openMenu = useCallback((e: MouseEvent<HTMLButtonElement>) => setMenuAnchorEl(e.currentTarget), []);
  const closeMenu = useCallback(() => setMenuAnchorEl(null), []);

  const handleChangeWorkOrderStatus = (value: WorkOrderStatus) => {
    const { id } = workOrder;
    const workOrderToUpdate = getWorkOrderToUpdate(workOrder);
    dispatch(updateWorkOrder({ ...workOrderToUpdate, id, workOrderStatus: value }));
  };

  const handleClickMenuItem = (onClick = () => {}) => () => {
    closeMenu();
    onClick();
  };

  // const handleClickPrint = useCallback(() => {
  //   // TODO: open pdf
  // }, [workOrder]);

  const handleClickComplete = useCallback(() => {
    openDialog(<WorkOrdersCompleteDialog workOrders={[workOrder]} onClose={closeDialog} />);
  }, [workOrder]);

  const handleClickEdit = useCallback(() => {
    openDialog(<WorkOrderDialog workOrder={workOrder} onClose={closeDialog} />);
  }, [workOrder]);

  const handleClickDelete = useCallback(() => {
    openDialog(
      <ConfirmDialog
        title={t('deleteWorkOrder')}
        message={t('deleteWorkOrderConfirm', { workOrderId: workOrder.id })}
        onClose={(isConfirmed: boolean) => {
          isConfirmed && dispatch(deleteWorkOrders([workOrder.id]));
          closeDialog();
        }}
      />
    );
  }, [workOrder]);

  const { product } = workOrder;
  const {
    orderedAt,
    deliverBy,
    isCompleted,
    completedAt,
    orderQuantity,
    orderWeight,
    completedQuantity,
    completedWeight,
    productSize,
    productSummary,
  } = useWorkOrderDisplay(workOrder, t);

  const workOrderStatusOptions = Object.values(WorkOrderStatus)
    .filter((value) => value !== WorkOrderStatus.COMPLETED)
    .map((value) => ({
      label: t(`workOrderStatus${upperFirst(camelCase(value))}`),
      value,
    }));
  const productNameMaxWidth = isDesktopLayout ? 295 : isTabletLayout ? 280 : isMobileLayout ? 480 : undefined;
  const deliverByRemaining = differenceInBusinessDays(new Date(deliverBy), new Date());
  const deliverByColor =
    deliverByRemaining <= 3
      ? red[800]
      : deliverByRemaining <= 5
      ? orange[800]
      : deliverByRemaining <= 7
      ? yellow[800]
      : 'inherit';
  const deliverByFontWeight = !isCompleted && deliverByRemaining <= 7 ? 'bold' : 'normal';

  let actionButtons: { label: string; onClick: () => void }[] = [];
  if (workOrder.workOrderStatus === WorkOrderStatus.CUTTING) {
    actionButtons.push({ label: t('common:done'), onClick: handleClickComplete });
  }
  if (!isCompleted) {
    actionButtons = [
      ...actionButtons,
      { label: t('common:edit'), onClick: handleClickEdit },
      { label: t('common:delete'), onClick: handleClickDelete },
    ];
  }

  return (
    <ListItem
      divider
      style={{ height: itemHeight }}
      selected={isSelected}
      className={classes[workOrder.workOrderStatus]}
    >
      <ListItemIcon>
        <Checkbox
          edge="start"
          color="primary"
          checked={isSelected}
          onChange={handleSelectionChange}
          disabled={isCompleted}
        />
      </ListItemIcon>
      <ListItemText>
        <div className={classes.workOrderDetail}>
          <div className={classes.workOrderId}>
            <WorkOrderId workOrder={workOrder} />
            {!isCompleted && (
              <div className={classes.workOrderTags}>
                {workOrder.isUrgent && <Chip className={classes.isUrgent} size="small" label={t('isUrgent')} />}
                {workOrder.shouldBePunctual && (
                  <Chip className={classes.shouldBePunctual} size="small" label={t('shouldBePunctual')} />
                )}
              </div>
            )}
          </div>
          <div className={classes.dates}>
            <Typography>
              <span className={classes.label}>{t('orderedAt')}: </span>
              <span className={classes.value}>{orderedAt}</span>
            </Typography>
            <Typography>
              <span className={classes.label}>{t('deliverBy')}: </span>
              <span
                className={classes.value}
                style={{
                  color: isCompleted ? 'inherit' : deliverByColor,
                  fontWeight: deliverByFontWeight,
                }}
              >
                {deliverBy}
              </span>
            </Typography>
            <Typography>
              <span className={classes.label}>{t('completedAt')}: </span>
              <span className={classes.value}>{completedAt}</span>
            </Typography>
          </div>
          <div className={classes.workOrderStatus}>
            {workOrder.workOrderStatus !== WorkOrderStatus.COMPLETED ? (
              <SelectWorkOrderStatus
                className={classes.selectWorkOrderStatus}
                value={workOrder.workOrderStatus}
                options={workOrderStatusOptions}
                onChange={handleChangeWorkOrderStatus}
                isNative={isMobileLayout}
              />
            ) : (
              <DoneIcon fontSize="large" />
            )}
          </div>
          <div className={classes.productNames}>
            <AccountName account={product.account} linkClassName={classes.accountName} searchText={query.accountName} />
            <ProductName product={product} maxWidth={productNameMaxWidth} searchText={query.productName} />
          </div>
          <div className={classes.productDetail}>
            <Typography variant="h6">{productSize}</Typography>
            <Typography>{productSummary}</Typography>
          </div>
          <div className={classes.quantities}>
            <Typography>
              <span className={classes.label}>{t('orderQuantity')}: </span>
              <span className={classes.value}>{orderQuantity}</span>
              <span className={classes.label}> ({orderWeight})</span>
            </Typography>
            <Typography>
              <span className={classes.label}>{t('completedQuantity')}: </span>
              {!!workOrder?.completedQuantity && workOrder.completedQuantity > 0 && (
                <>
                  <span className={classes.value}>{completedQuantity}</span>
                  <span className={classes.label}> ({completedWeight})</span>
                </>
              )}
            </Typography>
          </div>
        </div>
      </ListItemText>
      <ListItemSecondaryAction>
        <IconButton edge="end" onClick={openMenu}>
          <MoreVertIcon />
        </IconButton>
        <Menu anchorEl={menuAnchorEl} open={Boolean(menuAnchorEl)} onClose={closeMenu}>
          <MenuItem style={{ padding: 0 }}>
            {/* <BlobProvider document={<WorkOrderPDF workOrder={workOrder} />}>
              {({ url }) => (
                <Link className={classes.printButton} color="textPrimary" onClick={handleClickPrint(url as string)}>
                  {t('common:print')}
                </Link>
              )}
            </BlobProvider> */}
          </MenuItem>
          {actionButtons.map(({ label, onClick }) => (
            <MenuItem key={label} onClick={handleClickMenuItem(onClick)}>
              {label}
            </MenuItem>
          ))}
        </Menu>
      </ListItemSecondaryAction>
    </ListItem>
  );
};

const WorkOrderListItemSkeleton = memo(({ itemHeight }: { itemHeight: number }) => {
  const classes = useStyles();

  return (
    <ListItem divider style={{ height: itemHeight }}>
      <ListItemIcon>
        <Skeleton variant="rect" width={24} height={24} />
      </ListItemIcon>
      <ListItemText>
        <div className={classes.workOrderDetail}>
          <Skeleton className={classes.workOrderId} variant="rect" width="80%" height={24} />
          <div className={classes.dates}>
            <Skeleton variant="rect" width="80%" height={20} />
            <Skeleton variant="rect" width="80%" height={20} />
            <Skeleton variant="rect" width="80%" height={20} />
          </div>
          <Skeleton className={classes.workOrderStatus} variant="rect" width="80%" height={20} />
          <div className={classes.productNames}>
            <Skeleton variant="rect" width="80%" height={24} />
            <Skeleton variant="rect" width="80%" height={30} />
          </div>
          <div className={classes.productDetail}>
            <Skeleton variant="rect" width="80%" height={24} />
            <Skeleton variant="rect" width="80%" height={20} />
          </div>
          <div className={classes.quantities}>
            <Skeleton variant="rect" width="80%" height={20} />
            <Skeleton variant="rect" width="80%" height={20} />
          </div>
        </div>
      </ListItemText>
      <ListItemSecondaryAction>
        <Skeleton variant="circle" width={48} height={48} style={{ marginRight: -12 }} />
      </ListItemSecondaryAction>
    </ListItem>
  );
});

export { WorkOrderListItemSkeleton };

export default memo(WorkOrderListItem);
