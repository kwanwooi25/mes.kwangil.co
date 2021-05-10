import { DATE_FORMAT, PrintSide, WorkOrderStatus } from 'const';
import { differenceInBusinessDays, format, parseISO } from 'date-fns';
import { WorkOrderDto } from 'features/workOrder/interface';
import { TFunction } from 'i18next';
import { theme } from 'lib/muiTheme';
import { capitalize } from 'lodash';
import { CSSProperties } from 'react';
import { getProductSize, getProductSummary } from 'utils/product';
import { formatDigit } from 'utils/string';
import { getWeight } from 'utils/workOrder';

import { orange, red, yellow } from '@material-ui/core/colors';

const COLORS = {
  [WorkOrderStatus.NOT_STARTED]: theme.palette.NOT_STARTED.light,
  [WorkOrderStatus.EXTRUDING]: theme.palette.EXTRUDING.light,
  [WorkOrderStatus.PRINTING]: theme.palette.PRINTING.light,
  [WorkOrderStatus.CUTTING]: theme.palette.CUTTING.light,
  [WorkOrderStatus.COMPLETED]: theme.palette.COMPLETED.light,
};

const BACKGROUND_COLORS = {
  [WorkOrderStatus.NOT_STARTED]: theme.palette.NOT_STARTED.dark,
  [WorkOrderStatus.EXTRUDING]: theme.palette.EXTRUDING.dark,
  [WorkOrderStatus.PRINTING]: theme.palette.PRINTING.dark,
  [WorkOrderStatus.CUTTING]: theme.palette.CUTTING.dark,
  [WorkOrderStatus.COMPLETED]: theme.palette.COMPLETED.dark,
};

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
    deliveryTags.push(t('workOrders:isUrgent'));
  }
  if (workOrder.shouldBePunctual) {
    deliveryTags.push(t('workOrders:shouldBePunctual'));
  }

  const deliverByRemaining = differenceInBusinessDays(new Date(workOrder.deliverBy), new Date());
  const deliverByStyle: CSSProperties = {
    color: isCompleted
      ? 'inherit'
      : deliverByRemaining <= 3
      ? red[800]
      : deliverByRemaining <= 5
      ? orange[800]
      : deliverByRemaining <= 7
      ? yellow[800]
      : 'inherit',
    fontWeight: !isCompleted && deliverByRemaining <= 7 ? 'bold' : 'normal',
  };

  const workOrderStatus = t(`workOrders:workOrderStatus:${workOrder.workOrderStatus}`);
  const workOrderStatusStyle: CSSProperties = {
    color: COLORS[workOrder.workOrderStatus],
    backgroundColor: BACKGROUND_COLORS[workOrder.workOrderStatus],
  };

  const plateStatus = t(`workOrders:plateStatus${capitalize(workOrder.plateStatus)}`);

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
    deliverByStyle,
    isCompleted,
    completedAt,
    orderQuantity,
    orderWeight,
    completedQuantity,
    completedWeight,
    deliveryTags,
    plateStatus,
    workOrderStatus,
    workOrderStatusStyle,

    accountName,
    productName,
    productSize,
    productSummary,
    productType,
  };
};
