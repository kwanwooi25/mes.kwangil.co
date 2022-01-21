import classNames from 'classnames';
import { useDialog } from 'features/dialog/dialogHook';
import { WorkOrderDto } from 'features/workOrder/interface';
import { useWorkOrder } from 'features/workOrder/useWorkOrders';
import React, { memo } from 'react';
import { LoadingButton } from '@mui/lab';
import WorkOrderDetailDialog from 'ui/dialog/WorkOrderDetail';

export interface WorkOrderIdProps {
  className?: string;
  linkClassName?: string;
  workOrder: WorkOrderDto;
}

function WorkOrderId({ workOrder, className, linkClassName }: WorkOrderIdProps) {
  const { openDialog, closeDialog } = useDialog();

  const { refetch, isFetching } = useWorkOrder(workOrder.id);

  const openDetailDialog = async () => {
    refetch().then((res) =>
      openDialog(<WorkOrderDetailDialog workOrder={res.data} onClose={closeDialog} />),
    );
  };

  return (
    <LoadingButton
      className={classNames('!justify-start !min-w-0 max-w-max !text-base', className)}
      onClick={openDetailDialog}
      disabled={isFetching}
      loading={isFetching}
      loadingPosition="end"
      endIcon={<span />}
      color="inherit"
    >
      <p
        className={classNames('truncate', linkClassName)}
        dangerouslySetInnerHTML={{ __html: workOrder.id }}
      />
    </LoadingButton>
  );
}

export default memo(WorkOrderId);
