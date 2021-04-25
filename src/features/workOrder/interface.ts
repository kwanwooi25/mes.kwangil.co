import { DeliveryMethod, PlateStatus, WorkOrderStatus } from 'const';

import { AccountDto } from 'features/account/interface';
import { BaseQuery } from 'types/api';
import { ProductDto } from 'features/product/interface';

export interface WorkOrderDto {
  id: string;
  orderedAt: Date | string;
  orderUpdatedAt: Date | string;
  deliverBy: Date | string;
  orderQuantity: number;
  isUrgent: boolean;
  shouldBePunctual: boolean;
  plateStatus: PlateStatus;
  isPlateReady: boolean;
  deliveryMethod: DeliveryMethod;
  workMemo?: string;
  deliveryMemo?: string;
  workOrderStatus: WorkOrderStatus;
  completedAt?: Date | string | null;
  completedQuantity?: number;
  deliveredAt?: Date | string | null;
  deliveredQuantity?: number;
  account: AccountDto;
  product: ProductDto;
}

export interface CreateWorkOrderDto extends Omit<WorkOrderDto, 'id' | 'orderUpdatedAt' | 'account' | 'product'> {
  accountId: number;
  productId: number;
}

export interface CreateWorkOrdersDto extends Omit<CreateWorkOrderDto, 'accountId' | 'productId'> {
  id: string;
  accountName: string;
  productName: string;
  thickness: number;
  length: number;
  width: number;
}

export interface UpdateWorkOrderDto
  extends Omit<WorkOrderDto, 'id' | 'orderedAt' | 'orderUpdatedAt' | 'account' | 'product'> {
  id?: string;
}

export interface GetWorkOrdersQuery extends BaseQuery {
  orderedAt: string[];
  accountName?: string;
  productName?: string;
  includeCompleted?: boolean;
}
