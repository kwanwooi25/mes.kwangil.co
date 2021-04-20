import { AccountDto } from 'features/account/interface';
import { PlateDto } from 'features/plate/interface';
import { PrintSide } from 'const';

export interface ImageDto {
  id: number;
  productId: number;
  fileName: string;
  imageUrl: string;
}

export interface CreateImageDto extends Omit<ImageDto, 'id' | 'productId'> {}

export interface ProductDto {
  id: number;
  accountId: number;
  name: string;
  thickness: number;
  length: number;
  width: number;
  extColor: string;
  extIsAntistatic: boolean;
  extMemo: string;
  printSide: PrintSide;
  printFrontColorCount: number;
  printFrontColor: string;
  printFrontPosition: string;
  printBackColorCount: number;
  printBackColor: string;
  printBackPosition: string;
  printMemo: string;
  cutPosition: string;
  cutIsUltrasonic: boolean;
  cutIsForPowder: boolean;
  cutPunchCount: number;
  cutPunchSize: string;
  cutPunchPosition: string;
  cutMemo: string;
  packMaterial: string;
  packUnit: number;
  packCanDeliverAll: boolean;
  packMemo: string;
  account: AccountDto;
  images: ImageDto[];
  plates?: PlateDto[];
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

export interface CreateProductDto
  extends Omit<ProductDto, 'id' | 'account' | 'images' | 'plates' | 'createdAt' | 'updatedAt' | 'deletedAt'> {
  images: CreateImageDto[];
}

export interface CreateProductsDto extends Omit<CreateProductDto, 'accountId'> {
  accountName: string;
}

export interface UpdateProductDto extends Omit<ProductDto, 'account'> {
  imagesToCreate?: CreateImageDto[];
  imageIdsToDelete?: number[];
}

export interface GetProductsQuery {
  offset?: number;
  limit?: number;
  accountName?: string;
  name?: string;
  thickness?: number[];
  length?: number[];
  width?: number[];
  extColor?: string;
  printColor?: string;
}
