import { useAuth } from 'features/auth/authHook';
import { WorkOrderDto } from 'features/workOrder/interface';
import { useWorkOrderDisplay } from 'hooks/useWorkOrderDisplay';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { hideText } from 'utils/string';

import { List } from '@mui/material';

import DetailField from '../DetailField';

export interface WorkOrderDetailsProps {
  workOrder: WorkOrderDto;
}

function WorkOrderDetails({ workOrder }: WorkOrderDetailsProps) {
  const { t } = useTranslation('workOrders');
  const { canViewAccounts, canViewProducts } = useAuth();
  const {
    orderedAt,
    completedAt,
    productSize,
    productSummary,
    orderQuantity,
    orderWeight,
    completedQuantity,
    completedWeight,
    deliveryMethod,
    isPrint,
    plateStatus,
  } = useWorkOrderDisplay(workOrder, t);
  const { product, workMemo, deliveryMemo } = workOrder;

  const accountName = canViewAccounts ? product?.account?.name : hideText(product?.account?.name);
  const productName = canViewProducts ? product?.name : hideText(product?.name);

  return (
    <List disablePadding>
      <DetailField label={t('orderedAt')} value={orderedAt} />
      <DetailField label={t('completedAt')} value={completedAt} />
      <DetailField label={t('accountName')} value={accountName} />
      <DetailField label={t('productName')} value={productName} />
      <DetailField label={t('productSize')} value={productSize} />
      <DetailField label={t('productSummary')} value={productSummary} />
      {isPrint && <DetailField label={t('plateStatus')} value={plateStatus} />}
      <DetailField label={t('orderQuantity')} value={`${orderQuantity} (${orderWeight})`} />
      <DetailField
        label={t('completedQuantity')}
        value={`${completedQuantity} (${completedWeight})`}
      />
      <DetailField label={t('workMemo')} value={workMemo} />
      <DetailField label={t('deliveryMethod')} value={deliveryMethod} />
      <DetailField label={t('deliveryMemo')} value={deliveryMemo} />
    </List>
  );
}

export default WorkOrderDetails;
