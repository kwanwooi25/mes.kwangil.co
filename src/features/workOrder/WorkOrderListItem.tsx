import AccountName from 'components/AccountName';
import ConfirmDialog from 'components/dialog/Confirm';
import WorkOrderDialog from 'components/dialog/WorkOrder';
import WorkOrdersCompleteDialog from 'components/dialog/WorkOrdersComplete';
import Loading from 'components/Loading';
import ProductName from 'components/ProductName';
import SelectWorkOrderStatus from 'components/SelectWorkOrderStatus';
import WorkOrderId from 'components/WorkOrderId';
import WorkOrderPDF from 'components/WorkOrderPDF';
import { PrintSide, WorkOrderStatus } from 'const';
import { useAuth } from 'features/auth/authHook';
import { useDialog } from 'features/dialog/dialogHook';
import { useScreenSize } from 'hooks/useScreenSize';
import { useWorkOrderDisplay } from 'hooks/useWorkOrderDisplay';
import React, { memo, MouseEvent, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from 'react-query';
import { getWorkOrderToUpdate } from 'utils/workOrder';

import {
    Checkbox, Chip, createStyles, IconButton, Link, ListItem, ListItemIcon, ListItemProps,
    ListItemSecondaryAction, ListItemText, makeStyles, Menu, MenuItem, Theme, Typography
} from '@material-ui/core';
import { red, yellow } from '@material-ui/core/colors';
import DoneIcon from '@material-ui/icons/Done';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { BlobProvider } from '@react-pdf/renderer';

import { WorkOrderDto, WorkOrderFilter } from './interface';
import { useDeleteWorkOrdersMutation, useUpdateWorkOrderMutation } from './useWorkOrders';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    [WorkOrderStatus.NOT_STARTED]: {
      background: theme.palette.NOT_STARTED.light,
    },
    [WorkOrderStatus.EXTRUDING]: {
      background: theme.palette.EXTRUDING.light,
    },
    [WorkOrderStatus.PRINTING]: {
      background: theme.palette.PRINTING.light,
    },
    [WorkOrderStatus.CUTTING]: {
      background: theme.palette.CUTTING.light,
    },
    [WorkOrderStatus.COMPLETED]: {
      background: theme.palette.COMPLETED.light,
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
        gridTemplateColumns: '1fr minmax(150px, 1fr) 130px 100px',
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
      fontSize: '12px',
    },
    productDetail: {
      gridArea: 'productDetail',
      fontSize: '14px',
    },
    quantities: {
      gridArea: 'quantities',
    },

    printButton: {
      fontFamily: theme.typography.fontFamily,
      fontSize: '16px',
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
  filter: WorkOrderFilter;
  toggleSelection?: (workOrder: WorkOrderDto) => any;
  isSelectable?: boolean;
}

const WorkOrderListItem = ({
  workOrder,
  itemHeight,
  isSelected,
  filter,
  toggleSelection = (workOrder: WorkOrderDto) => {},
  isSelectable = true,
}: WorkOrderListItemProps) => {
  const { t } = useTranslation('workOrders');
  const classes = useStyles();
  const { isMobileLayout, isTabletLayout, isDesktopLayout } = useScreenSize();

  const { openDialog, closeDialog } = useDialog();
  const { canUpdateWorkOrders, canDeleteWorkOrders } = useAuth();

  const [menuAnchorEl, setMenuAnchorEl] = useState<HTMLElement | null>(null);

  const queryClient = useQueryClient();
  const { updateWorkOrder } = useUpdateWorkOrderMutation({ queryClient });
  const { deleteWorkOrders } = useDeleteWorkOrdersMutation({ queryClient });

  const handleSelectionChange = () => toggleSelection(workOrder);

  const openMenu = useCallback((e: MouseEvent<HTMLButtonElement>) => setMenuAnchorEl(e.currentTarget), []);
  const closeMenu = useCallback(() => setMenuAnchorEl(null), []);

  const handleChangeWorkOrderStatus = (value: WorkOrderStatus) => {
    const { id } = workOrder;
    const workOrderToUpdate = getWorkOrderToUpdate(workOrder);
    updateWorkOrder({ ...workOrderToUpdate, id, workOrderStatus: value });
  };

  const handleClickMenuItem =
    (onClick = () => {}) =>
    () => {
      closeMenu();
      onClick();
    };

  const handleClickPrint = (url: string) => () => {
    closeMenu();
    window.open(url);
  };

  const closeDialogAndUnselect = () => {
    closeDialog();
    isSelected && toggleSelection(workOrder);
  };

  const handleClickComplete = () =>
    openDialog(<WorkOrdersCompleteDialog workOrders={[workOrder]} onClose={closeDialogAndUnselect} />);

  const handleClickEdit = () => openDialog(<WorkOrderDialog workOrder={workOrder} onClose={closeDialog} />);

  const handleClickDelete = () =>
    openDialog(
      <ConfirmDialog
        title={t('deleteWorkOrder')}
        message={t('deleteWorkOrderConfirm', { workOrderId: workOrder.id })}
        onClose={(isConfirmed: boolean) => {
          isConfirmed && deleteWorkOrders([workOrder.id]);
          closeDialogAndUnselect();
        }}
      />
    );

  const { product } = workOrder;
  const {
    orderedAt,
    deliverBy,
    deliverByStyle,
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
    .filter((value) => {
      if (value === WorkOrderStatus.PRINTING) {
        return product.printSide !== PrintSide.NONE;
      }
      return value !== WorkOrderStatus.COMPLETED;
    })
    .map((value) => ({
      label: t(`workOrders:workOrderStatus:${value}`),
      value,
    }));
  const productNameMaxWidth = isDesktopLayout ? 295 : isTabletLayout ? 280 : isMobileLayout ? 480 : undefined;

  let actionButtons: { label: string; onClick: () => void }[] = [];
  if (workOrder.workOrderStatus === WorkOrderStatus.CUTTING && canUpdateWorkOrders) {
    actionButtons.push({ label: t('common:done'), onClick: handleClickComplete });
  }
  if (!isCompleted) {
    if (canUpdateWorkOrders) {
      actionButtons.push({ label: t('common:edit'), onClick: handleClickEdit });
    }
    if (canDeleteWorkOrders) {
      actionButtons.push({ label: t('common:delete'), onClick: handleClickDelete });
    }
  }

  return (
    <ListItem
      divider
      style={{ height: itemHeight }}
      selected={isSelected}
      className={classes[workOrder.workOrderStatus]}
    >
      {isSelectable && (
        <ListItemIcon>
          <Checkbox
            edge="start"
            color="primary"
            checked={isSelected}
            onChange={handleSelectionChange}
            disabled={isCompleted}
          />
        </ListItemIcon>
      )}
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
              <span className={classes.value} style={deliverByStyle}>
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
                disabled={!canUpdateWorkOrders}
              />
            ) : (
              <DoneIcon fontSize="large" />
            )}
          </div>
          <div className={classes.productNames}>
            <AccountName
              account={product.account}
              linkClassName={classes.accountName}
              searchText={filter.accountName}
            />
            <ProductName product={product} maxWidth={productNameMaxWidth} searchText={filter.productName} />
          </div>
          <div className={classes.productDetail}>
            <Typography>{productSize}</Typography>
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
      {!!actionButtons.length && (
        <ListItemSecondaryAction>
          <IconButton edge="end" onClick={openMenu}>
            <MoreVertIcon />
          </IconButton>
          <Menu anchorEl={menuAnchorEl} open={Boolean(menuAnchorEl)} onClose={closeMenu}>
            <MenuItem style={{ padding: 0 }}>
              <BlobProvider document={<WorkOrderPDF workOrders={[workOrder]} />}>
                {({ url, loading }) => (
                  <Link
                    component="button"
                    className={classes.printButton}
                    color="textPrimary"
                    onClick={handleClickPrint(url as string)}
                    disabled={loading}
                  >
                    {loading && <Loading size="small" />}
                    {t('common:print')}
                  </Link>
                )}
              </BlobProvider>
            </MenuItem>
            {actionButtons.map(({ label, onClick }) => (
              <MenuItem key={label} onClick={handleClickMenuItem(onClick)}>
                {label}
              </MenuItem>
            ))}
          </Menu>
        </ListItemSecondaryAction>
      )}
    </ListItem>
  );
};

export default memo(WorkOrderListItem);
