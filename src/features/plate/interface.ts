import { BaseQuery } from 'types/api';
import { PlateMaterial } from 'const';
import { ProductDto } from 'features/product/interface';

export interface PlateDto {
  id: number;
  round: number;
  length: number;
  name?: string;
  material: PlateMaterial;
  location?: string;
  memo?: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  products: ProductDto[];
}

export interface CreatePlateDto extends Omit<PlateDto, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'> {}

export interface UpdatePlateDto extends PlateDto {
  productsToDisconnect?: ProductDto[];
}

export interface GetPlatesQuery extends BaseQuery {
  accountName?: string;
  productName?: string;
  name?: string;
  round?: number[];
  length?: number[];
}
