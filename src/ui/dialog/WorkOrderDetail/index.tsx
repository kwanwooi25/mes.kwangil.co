import Dialog from 'features/dialog/Dialog';
import DoneIcon from '@mui/icons-material/Done';
import React from 'react';
import RoundedButton from 'ui/elements/RoundedButton';
import { WorkOrderDto } from 'features/workOrder/interface';
import { useTranslation } from 'react-i18next';
import WorkOrderDetails from './WorkOrderDetails';

export interface WorkOrderDetailDialogProps {
  onClose: () => void;
  workOrder: WorkOrderDto;
}

function WorkOrderDetailDialog({ workOrder, onClose }: WorkOrderDetailDialogProps) {
  const { t } = useTranslation('workOrders');

  return (
    <Dialog fullWidth open onClose={onClose} title={workOrder.id}>
      <Dialog.Content>{!!workOrder && <WorkOrderDetails workOrder={workOrder} />}</Dialog.Content>
      <Dialog.Actions>
        <RoundedButton autoFocus onClick={onClose} color="primary" startIcon={<DoneIcon />}>
          {t('common:confirm')}
        </RoundedButton>
      </Dialog.Actions>
    </Dialog>
  );
}

export default WorkOrderDetailDialog;
