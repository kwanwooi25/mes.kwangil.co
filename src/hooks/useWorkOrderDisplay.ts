import { DATE_FORMAT, PrintSide } from 'const';
import { format, parseISO } from 'date-fns';
import { getProductSize, getProductSummary } from 'utils/product';

import { TFunction } from 'i18next';
import { WorkOrderDto } from 'features/workOrder/interface';
import { formatDigit } from 'utils/string';
import { getWeight } from 'utils/workOrder';

export const useWorkOrderDisplay = (workOrder: WorkOrderDto, t: TFunction) => {
  const { product } = workOrder;

  const workOrderIdChunks = workOrder.id.split('-');
  const workOrderMonth = `${workOrderIdChunks[0]}-${workOrderIdChunks[1]}`;
  const workOrderNumber = workOrderIdChunks[2];
  const orderedAt = format(parseISO(workOrder.orderedAt as string), DATE_FORMAT);
  const deliverBy = format(parseISO(workOrder.deliverBy as string), DATE_FORMAT);
  const isCompleted = !!workOrder.completedAt;
  const completedAt = isCompleted && format(parseISO(workOrder.completedAt as string), DATE_FORMAT);
  const orderQuantity = t('common:sheetCount', { countString: formatDigit(workOrder.orderQuantity) });
  const orderWeight = t('common:weightInKg', { weight: getWeight({ product, quantity: workOrder.orderQuantity }) });
  const completedQuantity = t('common:sheetCount', { countString: formatDigit(workOrder.completedQuantity || 0) });
  const completedWeight = t('common:weightInKg', {
    weight: getWeight({ product, quantity: workOrder.completedQuantity }),
  });
  let deliveryTags = [];
  if (workOrder.isUrgent) {
    deliveryTags.push(t('isUrgent'));
  }
  if (workOrder.shouldBePunctual) {
    deliveryTags.push(t('shouldBePunctual'));
  }

  const accountName = product.account.name;
  const productName = product.name;
  const productSize = getProductSize(product);
  const productSummary = getProductSummary(product, t);
  const productType = t(product.printSide === PrintSide.NONE ? 'products:printNone' : 'products:print');

  return {
    workOrderMonth,
    workOrderNumber,
    orderedAt,
    deliverBy,
    isCompleted,
    completedAt,
    orderQuantity,
    orderWeight,
    completedQuantity,
    completedWeight,
    deliveryTags,

    accountName,
    productName,
    productSize,
    productSummary,
    productType,
  };
};
