import { DeliveryMethod, PrintSide, StockHistoryType } from 'const';
import { AccountDto, AccountOption } from 'features/account/interface';
import { PlateDto } from 'features/plate/interface';
import { WorkOrderDto } from 'features/workOrder/interface';
import { BaseQuery } from 'types/api';

export interface ProductFilter {
  accountName: string;
  name: string;
  thickness: string;
  length: string;
  width: string;
  extColor: string;
  printColor: string;
}

export type GetProductsQuery = BaseQuery & ProductFilter;

export interface ImageDto {
  id: number;
  productId: number;
  fileName: string;
  imageUrl: string;
}

export interface CreateImageDto extends Omit<ImageDto, 'id' | 'productId'> {}

export interface StockDto {
  id: number;
  balance: number;
  createdAt: Date;
  updatedAt: Date;
  productId: number;
  history: StockHistoryDto[];
}

export interface CreateStockDto
  extends Omit<StockDto, 'id' | 'createdAt' | 'updatedAt' | 'history'> {}

export interface StockHistoryDto {
  id: number;
  type: StockHistoryType;
  quantity: number;
  balance: number;
  createdAt: Date;
}

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
  shouldKeepRemainder: boolean;
  deliveryMethod: DeliveryMethod;
  productMemo: string;
  account: AccountDto;
  images: ImageDto[];
  plates?: PlateDto[];
  workOrders?: WorkOrderDto[];
  stock?: StockDto;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

export interface CreateProductDto
  extends Omit<
    ProductDto,
    'id' | 'account' | 'images' | 'plates' | 'createdAt' | 'updatedAt' | 'deletedAt'
  > {
  images: CreateImageDto[];
}

export interface CreateProductsDto extends Omit<CreateProductDto, 'accountId'> {
  accountName: string;
}

export interface UpdateProductDto extends Omit<ProductDto, 'account'> {
  imagesToCreate?: CreateImageDto[];
  imageIdsToDelete?: number[];
}

export interface ProductFormValues {
  id?: number;
  account: AccountOption | null;
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
  shouldKeepRemainder: boolean;
  deliveryMethod: DeliveryMethod;
  productMemo: string;
  stock?: StockDto;
  images: ImageDto[];
  filesToUpload?: File[];
  imagesToDelete?: ImageDto[];
}
