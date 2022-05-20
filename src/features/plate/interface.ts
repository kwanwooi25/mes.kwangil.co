import { PlateMaterial } from 'const';
import { ProductDto } from 'features/product/interface';
import { BaseQuery } from 'types/api';

export interface PlateFilter {
  id?: string;
  accountName?: string;
  productName?: string;
  name?: string;
  round?: [number, number];
  length?: [number, number];
}

export type GetPlatesQuery = BaseQuery & PlateFilter;

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

export interface CreatePlateDto
  extends Omit<PlateDto, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'> {}

export interface PlateFormValues extends CreatePlateDto {
  id?: number;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
  productsToDisconnect?: ProductDto[];
}

export interface UpdatePlateDto extends PlateDto {
  productsToDisconnect?: ProductDto[];
}
