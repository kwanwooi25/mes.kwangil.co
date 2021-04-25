import { getProductSize, getProductSummary } from 'utils/product';

import DetailField from '../DetailField';
import { List } from '@material-ui/core';
import React from 'react';
import { WorkOrderDto } from 'features/workOrder/interface';
import { capitalize } from 'lodash';
import { formatDate } from 'utils/date';
import { formatDigit } from 'utils/string';
import { getWeight } from 'utils/workOrder';
import { useTranslation } from 'react-i18next';

export interface WorkOrderDetailsProps {
  workOrder: WorkOrderDto;
}

const WorkOrderDetails = ({ workOrder }: WorkOrderDetailsProps) => {
  const { t } = useTranslation('workOrders');
  const { orderedAt, completedAt, product, workMemo, deliveryMemo, deliveryMethod } = workOrder;

  const orderQuantity = t('common:sheetCount', { countString: formatDigit(workOrder.orderQuantity) });
  const orderWeight = t('common:weightInKg', { weight: getWeight({ product, quantity: workOrder.orderQuantity }) });
  const completedQuantity = t('common:sheetCount', { countString: formatDigit(workOrder.completedQuantity || 0) });
  const completedWeight = t('common:weightInKg', {
    weight: getWeight({ product, quantity: workOrder.completedQuantity }),
  });
  const deliveryMethodText = t(`deliveryMethod${capitalize(deliveryMethod)}`);

  return (
    <List disablePadding>
      <DetailField label={t('orderedAt')} value={formatDate(orderedAt)} />
      <DetailField label={t('completedAt')} value={formatDate(completedAt)} />
      <DetailField label={t('accountName')} value={product?.account?.name} />
      <DetailField label={t('productName')} value={product?.name} />
      <DetailField label={t('productSize')} value={getProductSize(product)} />
      <DetailField label={t('productSummary')} value={getProductSummary(product, t)} />
      <DetailField label={t('orderQuantity')} value={`${orderQuantity} (${orderWeight})`} />
      <DetailField label={t('completedQuantity')} value={`${completedQuantity} (${completedWeight})`} />
      <DetailField label={t('workMemo')} value={workMemo} />
      <DetailField label={t('deliveryMethod')} value={deliveryMethodText} />
      <DetailField label={t('deliveryMemo')} value={deliveryMemo} />
    </List>
  );
};

export default WorkOrderDetails;
