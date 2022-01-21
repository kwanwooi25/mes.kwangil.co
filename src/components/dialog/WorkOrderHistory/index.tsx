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
import { Done } from '@mui/icons-material';
import DetailField from '../DetailField';

export interface WorkOrderHistoryDialogProps {
  product: ProductDto;
  workOrders: WorkOrderDto[];
  onClose: () => void;
}

function WorkOrderHistoryDialog({ product, workOrders, onClose }: WorkOrderHistoryDialogProps) {
  const { t } = useTranslation('workOrders');
  const title = `${getProductTitle(product)} ${t('common:workOrderHistory')}`;

  return (
    <Dialog fullWidth open onClose={onClose} title={title}>
      <Dialog.Content>
        {workOrders.length ? (
          workOrders.map(({ id, orderedAt, orderQuantity }) => (
            <DetailField
              key={id}
              label={formatDate(orderedAt)}
              value={t('common:sheetCount', { countString: formatDigit(orderQuantity) }) as string}
            />
          ))
        ) : (
          <ListEmpty message={t('noHistory')} />
        )}
      </Dialog.Content>
      <Dialog.Actions>
        <RoundedButton autoFocus onClick={onClose} color="primary" startIcon={<Done />}>
          {t('common:confirm')}
        </RoundedButton>
      </Dialog.Actions>
    </Dialog>
  );
}

export default WorkOrderHistoryDialog;
