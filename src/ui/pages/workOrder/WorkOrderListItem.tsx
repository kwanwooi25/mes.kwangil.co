/* eslint-disable no-nested-ternary */
import AccountName from 'ui/elements/AccountName';
import ConfirmDialog from 'ui/dialog/Confirm';
import WorkOrderDialog from 'ui/dialog/WorkOrder';
import WorkOrdersCompleteDialog from 'ui/dialog/WorkOrdersComplete';
import ProductName from 'ui/elements/ProductName';
import SelectWorkOrderStatus from 'ui/elements/SelectWorkOrderStatus';
import WorkOrderId from 'ui/elements/WorkOrderId';
import WorkOrderPDF from 'ui/pdf/WorkOrderPDF';
import { PLATE_STATUS_COLORS, PrintSide, WorkOrderStatus } from 'const';
import { useAuth } from 'features/auth/authHook';
import { useDialog } from 'features/dialog/dialogHook';
import { useScreenSize } from 'hooks/useScreenSize';
import { useWorkOrderDisplay } from 'hooks/useWorkOrderDisplay';
import React, { memo, MouseEvent, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from 'react-query';
import { getWorkOrderToUpdate } from 'utils/workOrder';
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
} from '@mui/material';
import DoneIcon from '@mui/icons-material/Done';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { BlobProvider } from '@react-pdf/renderer';
import { highlight } from 'utils/string';
import { WorkOrderDto, WorkOrderFilter } from 'features/workOrder/interface';
import {
  useDeleteWorkOrdersMutation,
  useUpdateWorkOrderMutation,
} from 'features/workOrder/useWorkOrders';
import classNames from 'classnames';

export interface WorkOrderListItemProps extends ListItemProps {
  workOrder: WorkOrderDto;
  itemHeight: number;
  isSelected: boolean;
  filter: WorkOrderFilter;
  toggleSelection?: (workOrder: WorkOrderDto) => any;
  isSelectable?: boolean;
}

function WorkOrderListItem({
  workOrder,
  itemHeight,
  isSelected,
  filter,
  toggleSelection = () => {},
  isSelectable = true,
}: WorkOrderListItemProps) {
  const { t } = useTranslation('workOrders');
  const { isMobileLayout, isTabletLayout } = useScreenSize();

  const { openDialog, closeDialog } = useDialog();
  const { canUpdateWorkOrders, canDeleteWorkOrders } = useAuth();

  const [menuAnchorEl, setMenuAnchorEl] = useState<HTMLElement | null>(null);

  const queryClient = useQueryClient();
  const { updateWorkOrder } = useUpdateWorkOrderMutation({ queryClient });
  const { deleteWorkOrders } = useDeleteWorkOrdersMutation({ queryClient });

  const handleSelectionChange = () => toggleSelection(workOrder);

  const openMenu = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => setMenuAnchorEl(e.currentTarget),
    [],
  );
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
    if (isSelected) toggleSelection(workOrder);
  };

  const handleClickComplete = () =>
    openDialog(
      <WorkOrdersCompleteDialog workOrders={[workOrder]} onClose={closeDialogAndUnselect} />,
    );

  const handleClickEdit = () =>
    openDialog(<WorkOrderDialog workOrder={workOrder} onClose={closeDialog} />);

  const handleClickDelete = () =>
    openDialog(
      <ConfirmDialog
        title={t('deleteWorkOrder')}
        message={t('deleteWorkOrderConfirm', { workOrderId: workOrder.id })}
        onClose={(isConfirmed: boolean) => {
          if (isConfirmed) deleteWorkOrders([workOrder.id]);
          closeDialogAndUnselect();
        }}
      />,
    );

  const { product } = workOrder;
  const {
    orderedAt,
    deliverBy,
    deliverByClassName,
    isCompleted,
    completedAt,
    orderQuantity,
    orderWeight,
    completedQuantity,
    completedWeight,
    isPrint,
    plateStatus,
  } = useWorkOrderDisplay(workOrder, t);
  const plateStatusColor = PLATE_STATUS_COLORS[workOrder.plateStatus];

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

  const actionButtons: { label: string; onClick: () => void }[] = [];
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
      className={classNames({
        'bg-red-300/20': workOrder.workOrderStatus === WorkOrderStatus.NOT_STARTED,
        'bg-orange-300/20': workOrder.workOrderStatus === WorkOrderStatus.EXTRUDING,
        'bg-yellow-300/20': workOrder.workOrderStatus === WorkOrderStatus.PRINTING,
        'bg-emerald-300/20': workOrder.workOrderStatus === WorkOrderStatus.CUTTING,
        'bg-gray-300/20': workOrder.workOrderStatus === WorkOrderStatus.COMPLETED,
      })}
    >
      {isSelectable && (
        <ListItemIcon className="!min-w-0">
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
        <div className="grid grid-cols-2 gap-x-2 gap-y-1 items-center laptop:grid-cols-[repeat(2,3fr)_repeat(4,2fr)] larger-desktop:grid-cols-[120px_144px_1fr_1fr_200px_90px_105px] larger-desktop:gap-y-0">
          <div className="flex col-span-2 gap-x-1 items-center laptop:col-span-3 laptop:row-span-2 desktop:flex-wrap desktop:col-span-1">
            <WorkOrderId workOrder={workOrder} />
            {!isCompleted && workOrder.isUrgent && (
              <Chip className="!text-yellow-50 !bg-yellow-500" size="small" label={t('isUrgent')} />
            )}
            {!isCompleted && workOrder.shouldBePunctual && (
              <Chip
                className="!text-red-50 !bg-red-500"
                size="small"
                label={t('shouldBePunctual')}
              />
            )}
          </div>

          {!(isMobileLayout || isTabletLayout) && (
            <>
              <p className="px-2 laptop:col-span-3 laptop:justify-self-end desktop:col-span-1 desktop:col-start-2 desktop:row-start-1 larger-desktop:justify-self-center">
                <span className="text-xs">{t('orderedAt')}: </span>
                <span className="text-sm">{orderedAt}</span>
              </p>

              <p className="px-2 laptop:col-span-3 laptop:justify-self-end desktop:col-span-1 desktop:col-start-2 desktop:row-start-2 larger-desktop:justify-self-center">
                <span className="text-xs">{t('deliverBy')}: </span>
                <span className={classNames('text-sm', deliverByClassName)}>{deliverBy}</span>
              </p>
            </>
          )}

          <AccountName
            className="col-span-2 laptop:col-span-6 larger-desktop:col-span-1 larger-desktop:col-start-3 larger-desktop:row-start-1"
            linkClassName="text-sm"
            account={product.account}
            searchText={filter.accountName}
          />

          <ProductName
            className="col-span-2 laptop:col-span-6 desktop:col-span-2 larger-desktop:col-span-1 larger-desktop:col-start-3 larger-desktop:row-start-2"
            product={product}
            searchText={filter.productName}
          />

          <span
            className="col-span-2 px-2 tablet:col-span-1 laptop:col-span-3 desktop:col-span-2 larger-desktop:col-span-1 larger-desktop:col-start-4 larger-desktop:row-start-1"
            dangerouslySetInnerHTML={{
              __html: `${highlight(String(product.thickness), filter.thickness)} x ${highlight(
                String(product.length),
                filter.length,
              )} x ${highlight(String(product.width), filter.width)}`,
            }}
          />

          <span className="col-span-2 px-2 tablet:col-span-1 tablet:justify-self-end laptop:col-span-3 desktop:col-span-2 larger-desktop:col-span-1 larger-desktop:col-start-4 larger-desktop:row-start-2 larger-desktop:justify-self-start">
            <span className="text-base">{orderQuantity}</span>
            <span className="text-xs"> ({orderWeight})</span>
          </span>

          {!(isMobileLayout || isTabletLayout) && (
            <div className="px-2 laptop:col-span-2 desktop:col-start-3 desktop:row-span-2 desktop:row-start-1 larger-desktop:col-span-1 larger-desktop:col-start-5 larger-desktop:row-start-1">
              <p>
                <span className="text-xs">{t('completedAt')}: </span>
                <span className="text-sm">{completedAt}</span>
              </p>
              <p>
                <span className="text-xs">{t('completedQuantity')}: </span>
                <span className="text-sm">{completedQuantity}</span>
                <span className="text-xs"> ({completedWeight})</span>
              </p>
            </div>
          )}

          <span className="flex items-center px-2 laptop:col-span-2 laptop:justify-center desktop:col-span-1 desktop:col-start-5 desktop:row-span-2 desktop:row-start-1 larger-desktop:col-start-6">
            {isPrint && (
              <Chip
                className="!text-white"
                label={plateStatus}
                style={{ backgroundColor: plateStatusColor }}
              />
            )}
          </span>

          <div className="flex justify-end px-2 laptop:col-span-2 desktop:col-span-1 desktop:col-start-6 desktop:row-span-2 desktop:row-start-1 larger-desktop:col-start-7">
            {workOrder.workOrderStatus !== WorkOrderStatus.COMPLETED ? (
              <SelectWorkOrderStatus
                value={workOrder.workOrderStatus}
                options={workOrderStatusOptions}
                onChange={handleChangeWorkOrderStatus}
                isNative={isMobileLayout || isTabletLayout}
                disabled={!canUpdateWorkOrders}
              />
            ) : (
              <DoneIcon fontSize="large" />
            )}
          </div>
        </div>
      </ListItemText>

      <ListItemSecondaryAction>
        <IconButton edge="end" onClick={openMenu} disabled={!actionButtons.length}>
          <MoreVertIcon />
        </IconButton>
        <Menu anchorEl={menuAnchorEl} open={Boolean(menuAnchorEl)} onClose={closeMenu}>
          <BlobProvider document={<WorkOrderPDF workOrders={[workOrder]} />}>
            {({ url, loading }) => (
              <MenuItem onClick={handleClickPrint(url as string)} disabled={loading}>
                {t('common:print')}
              </MenuItem>
            )}
          </BlobProvider>
          {actionButtons.map(({ label, onClick }) => (
            <MenuItem key={label} onClick={handleClickMenuItem(onClick)}>
              {label}
            </MenuItem>
          ))}
        </Menu>
      </ListItemSecondaryAction>
    </ListItem>
  );
}

export default memo(WorkOrderListItem);
