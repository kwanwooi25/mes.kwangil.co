import { DialogActions, DialogContent } from '@material-ui/core';

import Dialog from 'features/dialog/Dialog';
import DoneIcon from '@material-ui/icons/Done';
import React from 'react';
import RoundedButton from 'components/RoundedButton';
import WorkOrderDetails from './WorkOrderDetails';
import { WorkOrderDto } from 'features/workOrder/interface';
import { useTranslation } from 'react-i18next';

export interface WorkOrderDetailDialogProps {
  onClose: () => void;
  workOrder: WorkOrderDto;
}

const WorkOrderDetailDialog = ({ workOrder, onClose }: WorkOrderDetailDialogProps) => {
  const { t } = useTranslation('workOrders');

  return (
    <Dialog fullWidth open onClose={onClose} title={workOrder.id}>
      <DialogContent>{!!workOrder && <WorkOrderDetails workOrder={workOrder} />}</DialogContent>
      <DialogActions>
        <RoundedButton autoFocus onClick={onClose} color="primary" startIcon={<DoneIcon />}>
          {t('common:confirm')}
        </RoundedButton>
      </DialogActions>
    </Dialog>
  );
};

export default WorkOrderDetailDialog;
