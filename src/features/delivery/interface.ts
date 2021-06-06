import { DeliveryMethod } from 'const';
import { ProductDto } from 'features/product/interface';
import { WorkOrderDto } from 'features/workOrder/interface';
import { BaseQuery } from 'types/api';

export interface DeliveryDto {
  id: number;
  date: Date;
  method: DeliveryMethod;
  quantity: number;
  isDelivered: boolean;
  memo: string;
  product: ProductDto;
  workOrder?: WorkOrderDto;
}

export interface CreateDeliveryDto extends Omit<DeliveryDto, 'id' | 'product' | 'workOrder'> {
  productId: number;
  workOrderId: string;
}

export interface GetDeliveriesQuery extends BaseQuery {
  date?: string;
  method?: DeliveryMethod;
}
