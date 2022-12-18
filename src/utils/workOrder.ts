import { DATE_FORMAT, DeliveryMethod, PlateStatus, PrintSide, WorkOrderStatus } from 'const';
import {
  UpdateWorkOrderDto,
  WorkOrderDto,
  WorkOrderFormValues,
} from 'features/workOrder/interface';
import { add, format } from 'date-fns';

import { ProductDto } from 'features/product/interface';
import { formatDigit } from './string';

/**
 * 작업지시 수량을 중량으로 환산하여 반환
 *
 * @param product 제품 정보
 * @param quantity 수량
 * @param formatted 천단위 콤마 적용 여부
 *
 * @example formatted = true: 1,654.00
 * @example formatted = false: 1654.00
 */
export function getWeight({
  product,
  quantity = 0,
  formatted = true,
}: {
  product: ProductDto;
  quantity?: number;
  formatted?: boolean;
}): string {
  const { thickness, length, width } = product;

  const weight = (+thickness * (+length + 5) * (+width / 100) * 0.0184 * quantity).toFixed(1);

  if (!formatted) {
    return weight;
  }

  const [int, decimal] = weight.split('.');

  return `${formatDigit(int)}.${decimal}`;
}

/**
 * 작업지시 수량을 길이로 환산하여 반환
 *
 * @param product 제품 정보
 * @param quantity 수량
 * @param formatted 천단위 콤마 적용 여부
 *
 * @example formatted = true: 1,654.00
 * @example formatted = false: 1654.00
 */
export function getLength({
  product,
  quantity = 0,
  formatted = true,
}: {
  product: ProductDto;
  quantity?: number;
  formatted?: boolean;
}): string {
  const { width } = product;

  const sheetLength = ((+width / 100) * quantity).toFixed(1);

  if (!formatted) {
    return sheetLength;
  }

  const [int, decimal] = sheetLength.split('.');

  return `${formatDigit(int)}.${decimal}`;
}

/**
 * 압출 수량 계산하여 반환
 *
 * @param product 제품 정보
 * @param quantity 수량
 * @param formatted 천단위 콤마 적용 여부
 *
 * @example formatted = true: 1,654.00
 * @example formatted = false: 1654.00
 */
export function getExtrusionSpec({
  product,
  quantity = 0,
}: {
  product: ProductDto;
  quantity?: number;
}) {
  const lossRate = product.printSide === PrintSide.NONE ? 0.06 : 0.1;
  const weightWithLoss = +getWeight({ product, quantity, formatted: false }) * (1 + lossRate);
  const lengthWithLoss = +getLength({ product, quantity, formatted: false }) * (1 + lossRate);
  const rollCount = Math.ceil(weightWithLoss / 15);
  const lengthPerRoll = Math.ceil(lengthWithLoss / rollCount / 10) * 10;

  return { lengthPerRoll, rollCount };
}

/**
 * 작업지시 생성/수정시 초기값 반환
 *
 * @param workOrder 수정하려는 작업지시
 */
export function getInitialWorkOrderFormValues(
  workOrder?: WorkOrderDto,
  product?: ProductDto,
): WorkOrderFormValues {
  if (!workOrder) {
    return {
      orderedAt: format(new Date(), DATE_FORMAT),
      deliverBy: format(add(new Date(), { days: 10 }), DATE_FORMAT),
      orderQuantity: 10000,
      isUrgent: false,
      shouldBePunctual: false,
      plateStatus: PlateStatus.CONFIRM,
      isPlateReady: true,
      deliveryMethod: DeliveryMethod.TBD,
      workMemo: '',
      deliveryMemo: '',
      workOrderStatus: WorkOrderStatus.NOT_STARTED,
      product: product || null,
    };
  }

  return { ...workOrder };
}

/**
 * 작업지시 수정사항 반환
 *
 * @param workOrder 수정하려는 작업지시
 */
export function getWorkOrderToUpdate(
  workOrder: WorkOrderDto | WorkOrderFormValues,
): UpdateWorkOrderDto {
  const {
    deliverBy,
    orderQuantity,
    isUrgent,
    shouldBePunctual,
    plateStatus,
    isPlateReady,
    deliveryMethod,
    completedAt,
    completedQuantity,
    workMemo,
    deliveryMemo,
    workOrderStatus,
  } = workOrder;

  return {
    deliverBy,
    orderQuantity,
    isUrgent,
    shouldBePunctual,
    plateStatus,
    isPlateReady,
    deliveryMethod,
    completedAt,
    completedQuantity,
    workMemo,
    deliveryMemo,
    workOrderStatus,
  };
}
