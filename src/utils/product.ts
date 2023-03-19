import { DeliveryMethod, PrintSide } from 'const';
import {
  CreateImageDto,
  CreateProductDto,
  ImageDto,
  ProductDto,
  ProductFormValues,
  UpdateProductDto,
} from 'features/product/interface';
import { TFunction } from 'i18next';
import { capitalize } from 'lodash';

import { deleteImage, uploadImage } from './s3';
import { formatDigit } from './string';

/**
 * 제품 규격 조합
 *
 * @param product 제품 정보
 *
 * @example 0.07 x 20 x 13
 */
export function getProductSize({ thickness, length, width }: ProductDto): string {
  if (!thickness || !length || !width) {
    return '';
  }

  return `${thickness} x ${length} x ${width}`;
}

/**
 * 제품명 조합
 *
 * @param product 제품 정보
 *
 * @example 가나다약국 (0.07 x 20 x 13)
 */
export function getProductTitle(product: ProductDto) {
  if (!product) {
    return '';
  }

  return `${product.name} (${getProductSize(product)})`;
}

/**
 *
 * @param product 제품 정보
 * @param t i18n TFunction
 *
 * @example 유백 무지
 * @example 투명 / 인쇄 2도
 */
export function getProductSummary(
  { extColor, printFrontColorCount, printBackColorCount }: ProductDto,
  t: TFunction,
): string {
  const colorCount = printFrontColorCount + printBackColorCount;
  if (!colorCount) {
    return `${extColor} 무지`;
  }

  const printSide = printBackColorCount > 0 ? PrintSide.DOUBLE : PrintSide.SINGLE;
  const printSideText = t(`products:print${capitalize(printSide)}`);

  return `${extColor} / ${printSideText} 인쇄 ${colorCount}도`;
}

/**
 * 압출 정보 조합
 *
 * @param product 제품 정보
 * @param t i18n function
 *
 * @example 투명 (단면 처리)
 */
export function getExtrusionDetail({ extColor, printSide }: ProductDto, t: TFunction): string {
  const printSideText = t(`products:print${capitalize(printSide)}`);

  if (printSide === PrintSide.NONE) {
    return `${extColor} ${printSideText}`;
  }

  return `${extColor} (${printSideText} 처리)`;
}

/**
 * 인쇄 요약 정보
 *
 * @param product 제품 정보
 *
 * @example 인쇄 3도 (전면: 올백/주황, 후면: 흑색)
 */
export function getPrintSummary({
  printFrontColorCount,
  printFrontColor,
  printBackColorCount,
  printBackColor,
}: ProductDto): string {
  const colorCount = printFrontColorCount + printBackColorCount;
  if (!colorCount) {
    return '무지';
  }

  if (!printBackColorCount) {
    return `인쇄 ${colorCount}도 (${printFrontColor})`;
  }

  return `인쇄 ${colorCount}도 (전면: ${printFrontColor}, 후면: ${printBackColor})`;
}

/**
 * 인쇄 상세 정보
 *
 * @param colorCount 도수
 * @param color 색상
 * @param position 인쇄 위치
 *
 * @example 1도 (색상: 흑색, 위치: 중앙)
 */
export function getPrintDetail({
  colorCount,
  color,
  position,
}: {
  colorCount: number;
  color: string;
  position: string;
}): string {
  if (!colorCount) {
    return '';
  }

  let printDetail = `${colorCount}도`;
  if (color) {
    printDetail += ` (색상: ${color}`;
    if (position) {
      printDetail += `, 위치: ${position}`;
    }
    printDetail += ')';
  }

  return printDetail;
}

/**
 * 펀치 정보
 *
 * @param count 개수
 * @param size 크기
 * @param position 위치
 *
 * @example 1개 (크기: 5mm, 위치: 우측상단 각 1cm 띄고)
 */
export function getPunchDetail({
  count,
  size,
  position,
}: {
  count: number;
  size: string;
  position: string;
}): string {
  if (!count) {
    return '없음';
  }

  let punchDetail = `${count}개`;
  const detailArray = [];

  if (size) {
    detailArray.push(`크기: ${size}`);
  }
  if (position) {
    detailArray.push(`위치: ${position}`);
  }

  if (detailArray.length) {
    punchDetail += `(${detailArray.join(', ')})`;
  }

  return punchDetail;
}

/**
 * 포장 정보
 *
 * @param material 포장 방법 (자재)
 * @param unit 포장 단위
 *
 * @example 마대 포장 (10,000매씩)
 */
export function getPackagingDetail({ material, unit }: { material: string; unit: number }): string {
  let packagingDetail = '';

  if (material) {
    packagingDetail += `${material} 포장`;
  }

  if (unit) {
    packagingDetail += ` (${formatDigit(unit)}매씩)`;
  }

  return packagingDetail;
}

/**
 * 제품 등록시 초기값 반환
 */
export function getInitialProductToCreate(): ProductFormValues {
  return {
    account: null,
    name: '',
    thickness: 0.05,
    length: 30,
    width: 20,
    extColor: '투명',
    extIsAntistatic: false,
    extMemo: '',
    printSide: PrintSide.NONE,
    printFrontColorCount: 1,
    printFrontColor: '',
    printFrontPosition: '',
    printBackColorCount: 1,
    printBackColor: '',
    printBackPosition: '',
    printMemo: '',
    cutPosition: '',
    cutIsUltrasonic: false,
    cutIsForPowder: false,
    cutPunchCount: 0,
    cutPunchSize: '',
    cutPunchPosition: '',
    cutMemo: '',
    packMaterial: '마대',
    packUnit: 0,
    packCanDeliverAll: false,
    packMemo: '',
    shouldKeepRemainder: false,
    deliveryMethod: DeliveryMethod.TBD,
    productMemo: '',
    images: [],
    filesToUpload: [],
  };
}

/**
 * 제품 수정시 초기값 반환
 *
 * @param product 수정하려는 제품
 */
export function getInitialProductToUpdate(product: ProductDto): ProductFormValues {
  if (!product) {
    return getInitialProductToCreate();
  }

  return {
    ...product,
    filesToUpload: [],
    imagesToDelete: [],
  };
}

/**
 * 제품 복사시 초기값 반환
 *
 * @param product 복사하려는 제품
 */
export function getInitialProductToCopy(product: ProductDto): ProductFormValues {
  if (!product) {
    return getInitialProductToCreate();
  }

  const { id, accountId, name, createdAt, updatedAt, deletedAt, ...productToCopy } = product;

  return {
    ...productToCopy,
    name: `${name} - 복사됨`,
    filesToUpload: [],
  };
}

/**
 * 인쇄 면에 따라 인쇄 정보 조정
 *
 * @param product 생성 또는 수정할 제품
 */
function calibratePrintDetail<T extends CreateProductDto | UpdateProductDto>(product: T): T {
  switch (product.printSide) {
    case PrintSide.NONE:
      return {
        ...product,
        printFrontColorCount: 0,
        printFrontColor: '',
        printFrontPosition: '',
        printBackColorCount: 0,
        printBackColor: '',
        printBackPosition: '',
      };
    case PrintSide.SINGLE:
      return {
        ...product,
        printBackColorCount: 0,
        printBackColor: '',
        printBackPosition: '',
      };
    default:
      return product;
  }
}

/**
 * 제품 등록시 필요한 데이터로 변환\
 * (신규/복사)
 *
 * @param productFormValues 입력된 정보
 */
export async function getCreateProductDto({
  account,
  stock,
  ...values
}: ProductFormValues): Promise<CreateProductDto> {
  if (!account) {
    throw new Error('account required');
  }

  const { images, filesToUpload = [], imagesToDelete, ...product } = values;
  let imagesToCreate: CreateImageDto[] = [];

  if (images.length) {
    imagesToCreate = images.map(({ fileName, imageUrl }) => ({ fileName, imageUrl }));
  }

  if (filesToUpload.length) {
    imagesToCreate = [
      ...imagesToCreate,
      ...(await Promise.all(filesToUpload.map(async (file) => uploadImage(file)))),
    ];
  }

  return calibratePrintDetail({ accountId: account.id, ...product, images: imagesToCreate });
}

/**
 * 제품 수정시 필요한 데이터로 변환
 *
 * @param product 기존 제품 정보
 * @param filesToUpload 새로 입력된 이미지 파일 목록
 * @param imagesToDelete 제거된 이미지 목록
 */
export async function getUpdateProductDto(
  { account, stock, ...product }: ProductDto,
  filesToUpload: File[],
  imagesToDelete: ImageDto[],
): Promise<UpdateProductDto> {
  if (!account) {
    throw new Error('account required');
  }

  let imagesToCreate: CreateImageDto[] = [];
  let imageIdsToDelete: number[] = [];

  if (filesToUpload.length) {
    imagesToCreate = await Promise.all(filesToUpload.map(async (file) => uploadImage(file)));
  }

  if (imagesToDelete.length) {
    imageIdsToDelete = await Promise.all(imagesToDelete.map(async (image) => deleteImage(image)));
    imageIdsToDelete = imagesToDelete.map(({ id }) => id);
  }

  return calibratePrintDetail({ ...product, imagesToCreate, imageIdsToDelete });
}
