/* eslint-disable no-nested-ternary */
import classNames from 'classnames';
import { DATE_FORMAT, PlateStatus, PrintSide, WorkOrderStatus } from 'const';
import { differenceInBusinessDays, format, parseISO } from 'date-fns';
import { WorkOrderDto } from 'features/workOrder/interface';
import { TFunction } from 'i18next';
import { capitalize } from 'lodash';
import { getProductSize, getProductSummary, getProductTitle } from 'utils/product';
import { formatDigit } from 'utils/string';
import { getLength, getWeight } from 'utils/workOrder';

export const useWorkOrderDisplay = (workOrder: WorkOrderDto, t: TFunction) => {
  const { product } = workOrder;

  const workOrderIdChunks = workOrder.id.split('-');
  const workOrderMonth = `${workOrderIdChunks[0]}-${workOrderIdChunks[1]}`;
  const workOrderNumber = workOrderIdChunks[2];
  const orderedAt = format(parseISO(workOrder.orderedAt as string), DATE_FORMAT);
  const deliverBy = format(parseISO(workOrder.deliverBy as string), DATE_FORMAT);
  const isCompleted = !!workOrder.completedAt;
  const completedAt = isCompleted
    ? format(parseISO(workOrder.completedAt as string), DATE_FORMAT)
    : '';
  const orderQuantity = t('common:sheetCount', {
    countString: formatDigit(workOrder.orderQuantity),
  });
  const orderWeight = t('common:weightInKg', {
    weight: getWeight({ product, quantity: workOrder.orderQuantity }),
  });
  const orderLength = t('common:lengthInMeters', {
    length: getLength({ product, quantity: workOrder.orderQuantity }),
  });
  const completedQuantity = t('common:sheetCount', {
    countString: formatDigit(workOrder.completedQuantity || 0),
  });
  const completedWeight = t('common:weightInKg', {
    weight: getWeight({ product, quantity: workOrder.completedQuantity }),
  });
  const deliveryTags = [];
  if (workOrder.isUrgent) {
    deliveryTags.push(t('workOrders:isUrgent'));
  }
  if (workOrder.shouldBePunctual) {
    deliveryTags.push(t('workOrders:shouldBePunctual'));
  }

  const deliveryMethod = t(`workOrders:deliveryMethod${capitalize(workOrder.deliveryMethod)}`);
  const deliverByRemaining = differenceInBusinessDays(new Date(workOrder.deliverBy), new Date());
  const deliverByClassName = [
    isCompleted
      ? ''
      : deliverByRemaining <= 3
      ? 'text-red-700'
      : deliverByRemaining <= 5
      ? 'text-orange-700'
      : deliverByRemaining <= 7
      ? 'text-yellow-700'
      : '',
    !isCompleted && deliverByRemaining <= 7 ? 'bold' : 'normal',
  ].join(' ');

  const workOrderStatus = t(`workOrders:workOrderStatus:${workOrder.workOrderStatus}`);
  const workOrderStatusClassName = classNames(
    {
      '!bg-red-300/20': workOrder.workOrderStatus === WorkOrderStatus.NOT_STARTED,
      '!bg-orange-300/20': workOrder.workOrderStatus === WorkOrderStatus.EXTRUDING,
      '!bg-yellow-300/20': workOrder.workOrderStatus === WorkOrderStatus.PRINTING,
      '!bg-emerald-300/20': workOrder.workOrderStatus === WorkOrderStatus.CUTTING,
      '!bg-gray-300/20': workOrder.workOrderStatus === WorkOrderStatus.COMPLETED,
    },
    {
      '!text-red-700': workOrder.workOrderStatus === WorkOrderStatus.NOT_STARTED,
      '!text-orange-700': workOrder.workOrderStatus === WorkOrderStatus.EXTRUDING,
      '!text-yellow-700': workOrder.workOrderStatus === WorkOrderStatus.PRINTING,
      '!text-emerald-700': workOrder.workOrderStatus === WorkOrderStatus.CUTTING,
      '!text-gray-700': workOrder.workOrderStatus === WorkOrderStatus.COMPLETED,
    },
  );

  const isPrint = product.printSide !== PrintSide.NONE;
  const plateStatus = t(`workOrders:plateStatus${capitalize(workOrder.plateStatus)}`);
  const plateCodeList =
    workOrder.plateStatus === PlateStatus.UPDATE && product.plates?.length
      ? product.plates.map(({ code }) => code).join(', ')
      : '';

  const accountName = product.account.name;
  const productName = product.name;
  const productSize = getProductSize(product);
  const productTitle = getProductTitle(product);
  const productSummary = getProductSummary(product, t);
  const productType = t(
    product.printSide === PrintSide.NONE ? 'products:printNone' : 'products:print',
  );

  return {
    workOrderMonth,
    workOrderNumber,
    orderedAt,
    deliverBy,
    deliverByClassName,
    isCompleted,
    completedAt,
    orderQuantity,
    orderWeight,
    orderLength,
    completedQuantity,
    completedWeight,
    deliveryTags,
    deliveryMethod,
    isPrint,
    plateStatus,
    plateCodeList,

    workOrderStatus,
    workOrderStatusClassName,

    accountName,
    productName,
    productSize,
    productTitle,
    productSummary,
    productType,
  };
};
