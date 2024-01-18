import { Done } from '@mui/icons-material';
import Dialog from 'features/dialog/Dialog';
import { ProductDto } from 'features/product/interface';
import { WorkOrderDto } from 'features/workOrder/interface';
import { useTranslation } from 'react-i18next';
import ListEmpty from 'ui/elements/ListEmpty';
import RoundedButton from 'ui/elements/RoundedButton';
import { formatDate } from 'utils/date';
import { getProductTitle } from 'utils/product';
import { formatDigit } from 'utils/string';
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
          <>
            <DetailField label="주문일 ⇢ 완료일" value="주문수량 ⇢ 완성수량" labelWidth={200} />
            {workOrders.map(({ id, orderedAt, completedAt, orderQuantity, completedQuantity }) => {
              let label = formatDate(orderedAt);
              let value = t('common:sheetCount', { countString: formatDigit(orderQuantity) });
              if (completedAt) {
                label += ` ⇢ ${formatDate(completedAt)}`;
              }
              if (completedQuantity) {
                value += ` ⇢ ${t('common:sheetCount', {
                  countString: formatDigit(completedQuantity),
                })}`;
              }

              return <DetailField key={id} label={label} value={value} labelWidth={200} />;
            })}
          </>
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
