import ListEmpty from 'components/ListEmpty';
import RoundedButton from 'components/RoundedButton';
import Dialog from 'features/dialog/Dialog';
import { ProductDto } from 'features/product/interface';
import { WorkOrderDto } from 'features/workOrder/interface';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { formatDate } from 'utils/date';
import { getProductTitle } from 'utils/product';
import { formatDigit } from 'utils/string';

import { DialogActions, DialogContent } from '@material-ui/core';
import DoneIcon from '@material-ui/icons/Done';

import DetailField from '../DetailField';

export interface WorkOrderHistoryDialogProps {
  product: ProductDto;
  workOrders: WorkOrderDto[];
  onClose: () => void;
}

const WorkOrderHistoryDialog = ({ product, workOrders, onClose }: WorkOrderHistoryDialogProps) => {
  const { t } = useTranslation('workOrders');
  const title = `${getProductTitle(product)} ${t('common:workOrderHistory')}`;

  return (
    <Dialog fullWidth open onClose={onClose} title={title}>
      <DialogContent>
        {workOrders.length ? (
          workOrders.map(({ id, orderedAt, orderQuantity }) => (
            <DetailField
              key={id}
              label={formatDate(orderedAt)}
              value={`${formatDigit(orderQuantity)}${t('common:sheetCount')}`}
            />
          ))
        ) : (
          <ListEmpty message={t('noHistory')} />
        )}
      </DialogContent>
      <DialogActions>
        <RoundedButton autoFocus onClick={onClose} color="primary" startIcon={<DoneIcon />}>
          {t('common:confirm')}
        </RoundedButton>
      </DialogActions>
    </Dialog>
  );
};

export default WorkOrderHistoryDialog;
