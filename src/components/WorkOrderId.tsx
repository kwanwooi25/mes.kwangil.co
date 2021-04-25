import { Link, Theme, createStyles, makeStyles } from '@material-ui/core';
import React, { memo } from 'react';

import { WorkOrderDto } from 'features/workOrder/interface';
import classnames from 'classnames';
import { workOrderApi } from 'features/workOrder/workOrderApi';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    workOrderIdLink: {
      maxWidth: '200px',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      textAlign: 'left',
      fontSize: theme.typography.body1.fontSize,
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

  const openDetailDialog = async () => {
    const workOrderDetail = await workOrderApi.getWorkOrder(workOrder.id);
    console.log(workOrderDetail);
    // TODO: open detail dialog
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
        <span className={classes.workOrderId} dangerouslySetInnerHTML={{ __html: workOrder.id }} />
      </Link>
    </div>
  );
};

export default memo(WorkOrderId);
