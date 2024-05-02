import { DeliveryMethod, PlateStatus, PrintSide, WorkOrderStatus } from 'const';
import { AccountDto } from 'features/account/interface';
import { ProductDto } from 'features/product/interface';
import { BaseQuery } from 'types/api';

export interface WorkOrderFilter {
  orderedAt: string[];
  accountName?: string;
  productName?: string;
  thickness?: string;
  length?: string;
  width?: string;
  includeCompleted?: boolean;
}

export type GetWorkOrdersQuery = BaseQuery & WorkOrderFilter;

export interface WorkOrderDto {
  id: string;
  orderedAt: Date | string;
  orderUpdatedAt: Date | string;
  deliverBy: Date | string;
  orderQuantity: number;
  deliveryQuantity: number;
  isUrgent: boolean;
  shouldBePunctual: boolean;
  shouldKeepRemainder: boolean;
  shouldDeliverAll: boolean;
  plateStatus: PlateStatus;
  isPlateReady: boolean;
  deliveryMethod: DeliveryMethod;
  workMemo?: string;
  deliveryMemo?: string;
  workOrderStatus: WorkOrderStatus;
  completedAt?: Date | string | null;
  completedQuantity?: number;
  cuttingMachine?: string;
  deliveredAt?: Date | string | null;
  deliveredQuantity?: number;
  account: AccountDto;
  product: ProductDto;
}

export interface CreateWorkOrderDto
  extends Omit<WorkOrderDto, 'id' | 'orderUpdatedAt' | 'account' | 'product'> {
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

export interface CompleteWorkOrderDto {
  id: string;
  completedAt: Date | string | null;
  completedQuantity: number;
  productId: number;
}

export interface GetWorkOrdersByDeadlineQuery {
  deadline: string;
}

export interface GetWorkOrderCountQuery {
  orderedAt: string[];
}

export interface WorkOrdersByDeadline {
  overdue: WorkOrderDto[];
  imminent: WorkOrderDto[];
}

export interface WorkOrderCount {
  byStatus: { [key in WorkOrderStatus]: number };
  byPrintSide: { [key in PrintSide]: number };
}

export interface WorkOrderFormValues extends Omit<CreateWorkOrderDto, 'accountId' | 'productId'> {
  product?: ProductDto | null;
}
