import classnames from 'classnames';
import { useDialog } from 'features/dialog/dialogHook';
import { WorkOrderDto } from 'features/workOrder/interface';
import { useWorkOrder } from 'features/workOrder/useWorkOrders';
import React, { memo } from 'react';

import { createStyles, Link, makeStyles, Theme } from '@material-ui/core';

import WorkOrderDetailDialog from './dialog/WorkOrderDetail';
import Loading from './Loading';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    workOrderIdLink: {
      maxWidth: '120px',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      textAlign: 'left',
      fontSize: '16px',
    },
    workOrderId: {},
  })
);

export interface WorkOrderIdProps {
  className?: string;
  linkClassName?: string;
  workOrder: WorkOrderDto;
}

const WorkOrderId = ({ workOrder, className, linkClassName }: WorkOrderIdProps) => {
  const classes = useStyles();
  const { openDialog, closeDialog } = useDialog();

  const { refetch, isFetching } = useWorkOrder(workOrder.id);

  const openDetailDialog = async () => {
    refetch().then((res) => openDialog(<WorkOrderDetailDialog workOrder={res.data} onClose={closeDialog} />));
  };

  return (
    <div className={className}>
      <Link
        className={classnames(classes.workOrderIdLink, linkClassName)}
        component="button"
        variant="h6"
        color="initial"
        onClick={openDetailDialog}
      >
        {isFetching && <Loading size="16px" />}
        <span className={classes.workOrderId} dangerouslySetInnerHTML={{ __html: workOrder.id }} />
      </Link>
    </div>
  );
};

export default memo(WorkOrderId);
