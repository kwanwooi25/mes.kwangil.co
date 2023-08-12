/* eslint-disable no-case-declarations */
import {
  DeliveryMethod,
  DELIVERY_METHOD_TEXT,
  ExcelVariant,
  PlateStatus,
  PLATE_MATERIAL_TEXT,
  PLATE_STATUS_TEXT,
  PrintSide,
  PRINT_SIDE_TEXT,
  WorkOrderStatus,
} from 'const';
import { AccountDto, CreateAccountDto, CreateContactDto } from 'features/account/interface';
import { PlateDto } from 'features/plate/interface';
import { CreateProductDto, CreateProductsDto, ProductDto } from 'features/product/interface';
import {
  CreateWorkOrderDto,
  CreateWorkOrdersDto,
  WorkOrderDto,
} from 'features/workOrder/interface';
import { isEmpty } from 'lodash';
import { Dispatch, SetStateAction } from 'react';
import XLSX from 'xlsx';

import { formatDate } from './date';
import { getProductTitle } from './product';
import { getFileNameFromUrl } from './string';

const ACCOUNT_LABEL_TO_KEY: { [key: string]: keyof CreateAccountDto } = {
  업체명: 'name',
  사업자등록번호: 'crn',
  메모: 'memo',
};

const ACCOUNT_KEY_TO_LABEL: { [key: string]: string } = {
  name: '업체명',
  crn: '사업자등록번호',
  memo: '메모',
};

const CONTACT_LABEL_TO_KEY: { [key: string]: keyof CreateContactDto } = {
  제목: 'title',
  전화: 'phone',
  팩스: 'fax',
  이메일: 'email',
  주소: 'address',
};

const CONTACT_KEY_TO_LABEL: { [key: string]: string } = {
  title: '제목',
  phone: '전화',
  fax: '팩스',
  email: '이메일',
  address: '주소',
};

const PRODUCT_LABEL_TO_KEY: { [key: string]: keyof CreateProductsDto } = {
  업체명: 'accountName',
  제품명: 'name',
  두께: 'thickness',
  길이: 'length',
  너비: 'width',
  원단색상: 'extColor',
  대전방지: 'extIsAntistatic',
  처리: 'printSide',
  압출메모: 'extMemo',
  전면도수: 'printFrontColorCount',
  전면색상: 'printFrontColor',
  전면인쇄위치: 'printFrontPosition',
  후면도수: 'printBackColorCount',
  후면색상: 'printBackColor',
  후면인쇄위치: 'printBackPosition',
  인쇄메모: 'printMemo',
  가공위치: 'cutPosition',
  초음파가공: 'cutIsUltrasonic',
  가루포장: 'cutIsForPowder',
  펀치개수: 'cutPunchCount',
  펀치크기: 'cutPunchSize',
  펀치위치: 'cutPunchPosition',
  가공메모: 'cutMemo',
  포장방법: 'packMaterial',
  포장단위: 'packUnit',
  전량납품: 'packCanDeliverAll',
  포장메모: 'packMemo',
  제품메모: 'productMemo',
  이미지: 'images',
};

const PRODUCT_KEY_TO_LABEL: { [key: string]: string } = {
  accountName: '업체명',
  name: '제품명',
  thickness: '두께',
  length: '길이',
  width: '너비',
  extColor: '원단색상',
  extIsAntistatic: '대전방지',
  printSide: '처리',
  extMemo: '압출메모',
  printFrontColorCount: '전면도수',
  printFrontColor: '전면색상',
  printFrontPosition: '전면인쇄위치',
  printBackColorCount: '후면도수',
  printBackColor: '후면색상',
  printBackPosition: '후면인쇄위치',
  printMemo: '인쇄메모',
  cutPosition: '가공위치',
  cutIsUltrasonic: '초음파가공',
  cutIsForPowder: '가루포장',
  cutPunchCount: '펀치개수',
  cutPunchSize: '펀치크기',
  cutPunchPosition: '펀치위치',
  cutMemo: '가공메모',
  packMaterial: '포장방법',
  packUnit: '포장단위',
  packCanDeliverAll: '전량납품',
  packMemo: '포장메모',
  productMemo: '제품메모',
  images: '이미지',
  plates: '동판',
  lastWorkOrder: '최종작업일',
};

const PLATE_KEY_TO_LABEL: { [key: string]: string } = {
  id: '동판ID',
  code: '동판코드',
  round: '둘레',
  length: '기장',
  name: '동판명',
  material: '동판재질',
  location: '동판위치',
  memo: '동판메모',
  createdAt: '생성일',
  updatedAt: '수정일',
  products: '사용제품',
};

const WORK_ORDER_LABEL_TO_KEY: { [key: string]: keyof CreateWorkOrdersDto } = {
  아이디: 'id',
  주문일: 'orderedAt',
  업체명: 'accountName',
  제품명: 'productName',
  두께: 'thickness',
  길이: 'length',
  너비: 'width',
  주문수량: 'orderQuantity',
  동판상태: 'plateStatus',
  납기일: 'deliverBy',
  납기엄수: 'shouldBePunctual',
  자투리보관: 'shouldKeepRemainder',
  지급: 'isUrgent',
  작업메모: 'workMemo',
  납품메모: 'deliveryMemo',
  완료일: 'completedAt',
  완료수량: 'completedQuantity',
  납품일: 'deliveredAt',
  납품수량: 'deliveredQuantity',
};

const WORK_ORDER_KEY_TO_LABEL: { [key: string]: string } = {
  id: '작업지시번호',
  orderedAt: '주문일',
  accountName: '업체명',
  productName: '제품명',
  thickness: '두께',
  length: '길이',
  width: '너비',
  orderQuantity: '주문수량',
  plateStatus: '동판상태',
  deliverBy: '납기일',
  shouldBePunctual: '납기엄수',
  shouldKeepRemainder: '자투리보관',
  isUrgent: '지급',
  completedAt: '완료일',
  completedQuantity: '완료수량',
  deliveredAt: '납품일',
  deliveredQuantity: '납품수량',
  deliveryMethod: '납품방법',
  workMemo: '작업메모',
  deliveryMemo: '납품메모',
};

export function getWorkbook(data: any, workbookTitle: string = 'noTitle') {
  const sheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  workbook.SheetNames.push(workbookTitle);
  workbook.Sheets[workbookTitle] = sheet;
  XLSX.writeFile(workbook, `${workbookTitle}.xlsx`);
  return workbook;
}

const generateItem = {
  [ExcelVariant.ACCOUNT]: (row: any) =>
    Object.entries(row).reduce(
      (account: CreateAccountDto, [key, value]) => {
        if (key.includes('연락처')) {
          const [contactTitle, contactKey] = key.split(' ');
          const contactIndex = +contactTitle.slice(-1) - 1;
          const contacts: CreateContactDto[] = account.contacts || [
            { title: '기본', isBase: true },
          ];
          const newKey: keyof CreateContactDto = CONTACT_LABEL_TO_KEY[contactKey];
          if (!contacts[contactIndex] && newKey === 'title' && !!value) {
            contacts.push({ title: value as string });
          } else if (contacts[contactIndex]) {
            // @ts-ignore
            contacts[contactIndex][newKey] = value;
          }
          return { ...account, contacts };
        }
        const newKey: keyof CreateAccountDto = ACCOUNT_LABEL_TO_KEY[key];
        return { ...account, [newKey]: value };
      },
      { name: '' },
    ),
  [ExcelVariant.PRODUCT]: (row: any) =>
    Object.entries(row).reduce(
      (product: CreateProductsDto, [key, value]) => {
        const newKey: keyof CreateProductsDto = PRODUCT_LABEL_TO_KEY[key];
        let newValue;

        switch (newKey) {
          case 'images':
            // const imageBucketUrl = `https://${import.meta.env.VITE_S3_IMAGE_BUCKET_NAME}.s3.amazonaws.com/`;
            const imageBucketUrl = `https://kwangilmes-product-images.s3.amazonaws.com/`;
            const fileName = getFileNameFromUrl(value as string);
            const imageUrl = `${imageBucketUrl}${fileName}`;
            newValue = [{ fileName, imageUrl }];
            break;
          case 'printSide':
            if (value === '단면') {
              newValue = PrintSide.SINGLE;
            } else if (value === '양면') {
              newValue = PrintSide.DOUBLE;
            } else {
              newValue = PrintSide.NONE;
            }
            break;
          case 'deliveryMethod':
            if (value === '미정') {
              newValue = DeliveryMethod.TBD;
            } else if (value === '택배') {
              newValue = DeliveryMethod.COURIER;
            } else if (value === '직납') {
              newValue = DeliveryMethod.DIRECT;
            } else if (value === '퀵/화물') {
              newValue = DeliveryMethod.EXPRESS;
            }
            break;
          case 'extIsAntistatic':
          case 'cutIsUltrasonic':
          case 'cutIsForPowder':
          case 'packCanDeliverAll':
          case 'shouldKeepRemainder':
            newValue = value === 'Y';
            break;
          default:
            newValue = value;
        }

        return { ...product, [newKey]: newValue };
      },
      {
        accountName: '',
        name: '',
        thickness: 0.05,
        length: 0,
        width: 0,
        extColor: '',
        extIsAntistatic: false,
        extMemo: '',
        printSide: PrintSide.NONE,
        printFrontColorCount: 0,
        printFrontColor: '',
        printFrontPosition: '',
        printBackColorCount: 0,
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
        packMaterial: '',
        packUnit: 0,
        packCanDeliverAll: false,
        shouldKeepRemainder: false,
        deliveryMethod: DeliveryMethod.TBD,
        packMemo: '',
        productMemo: '',
        images: [],
      },
    ),
  [ExcelVariant.WORK_ORDER]: (row: any) =>
    Object.entries(row).reduce(
      (workOrder: CreateWorkOrdersDto, [key, value]) => {
        const newKey: keyof CreateWorkOrdersDto = WORK_ORDER_LABEL_TO_KEY[key];
        let newValue;

        switch (newKey) {
          case 'plateStatus':
            if (value === '신규') {
              newValue = PlateStatus.NEW;
            } else if (value === '수정') {
              newValue = PlateStatus.UPDATE;
            } else {
              newValue = PlateStatus.CONFIRM;
            }
            break;
          case 'shouldBePunctual':
          case 'shouldKeepRemainder':
          case 'isUrgent':
            newValue = value === 'Y';
            break;
          case 'deliveredAt':
            newValue = isEmpty(value) ? null : value;
            break;
          case 'completedAt':
            newValue = isEmpty(value) ? null : value;
            // eslint-disable-next-line no-param-reassign
            workOrder.workOrderStatus = WorkOrderStatus.COMPLETED;
            break;

          default:
            newValue = value;
        }

        return { ...workOrder, [newKey]: newValue };
      },
      {
        id: '',
        orderedAt: '',
        deliverBy: '',
        orderQuantity: 0,
        isUrgent: false,
        shouldBePunctual: false,
        shouldKeepRemainder: false,
        plateStatus: PlateStatus.CONFIRM,
        isPlateReady: true,
        deliveryMethod: DeliveryMethod.TBD,
        workMemo: '',
        deliveryMemo: '',
        workOrderStatus: WorkOrderStatus.NOT_STARTED,
        completedAt: null,
        completedQuantity: 0,
        deliveredAt: null,
        deliveredQuantity: 0,
        accountName: '',
        productName: '',
        thickness: 0.05,
        length: 0,
        width: 0,
      },
    ),
};

function getFileReader<T>(variant: ExcelVariant, stateSetter: Dispatch<SetStateAction<T[]>>) {
  const reader = new FileReader();
  reader.onload = (e) => {
    if (!e.target?.result) {
      return;
    }
    const data = new Uint8Array(e.target.result as ArrayBufferLike);
    const workbook = XLSX.read(data, { type: 'array' });
    const array = XLSX.utils.sheet_to_json(workbook.Sheets[variant]);
    // @ts-ignore
    const items: T[] = array.map((row) => generateItem[variant](row));
    if (stateSetter) stateSetter(items);
  };
  return reader;
}

function processAccountsForDownload(
  accounts: (AccountDto | (CreateAccountDto & { reason: string }))[],
) {
  const accountDataKeys = Object.keys(ACCOUNT_KEY_TO_LABEL);
  const contactDataKeys = Object.keys(CONTACT_KEY_TO_LABEL);

  return accounts.map((account) =>
    Object.entries(account).reduce((processedAccount, [key, value]) => {
      if (accountDataKeys.includes(key)) {
        return {
          ...processedAccount,
          [ACCOUNT_KEY_TO_LABEL[key]]: value,
        };
      }
      if (key === 'contacts') {
        account.contacts?.slice(0, 2).forEach((contact, index) => {
          const prefix = `연락처${index + 1}`;
          const processedContact = Object.entries(contact).reduce(
            (c, [contactKey, contactValue]) => {
              if (contactDataKeys.includes(key)) {
                return {
                  ...c,
                  [`${prefix} ${CONTACT_KEY_TO_LABEL[contactKey]}`]: contactValue,
                };
              }
              return c;
            },
            {},
          );
          // eslint-disable-next-line no-param-reassign
          processedAccount = {
            ...processedAccount,
            ...processedContact,
          };
        });
        return { ...processedAccount };
      }
      if (key === 'reason') {
        return {
          ...processedAccount,
          실패사유: value,
        };
      }

      return processedAccount;
    }, {}),
  );
}

function processProductsForDownload(
  products: (ProductDto | ((CreateProductDto | CreateProductsDto) & { reason: string }))[],
) {
  const productDataKeys = Object.keys(PRODUCT_KEY_TO_LABEL);

  return products.map((product) =>
    productDataKeys.reduce((processedProduct, key) => {
      const label = PRODUCT_KEY_TO_LABEL[key] || key;
      // @ts-ignore
      let value = product[key];

      switch (key) {
        case 'accountName':
          // @ts-ignore
          value = product.account ? product.account.name : product.accountName;
          break;
        case 'extIsAntistatic':
        case 'cutIsUltrasonic':
        case 'cutIsForPowder':
        case 'packCanDeliverAll':
        case 'shouldKeepRemainder':
          value = value ? 'Y' : 'N';
          break;
        case 'printSide':
          value = PRINT_SIDE_TEXT[value];
          break;
        case 'deliveryMethod':
          value = DELIVERY_METHOD_TEXT[value];
          break;
        case 'images':
          if (value && value.length) {
            value = value[0].imageUrl;
          }
          break;
        case 'plates':
          if (value && value.length) {
            value = value.map((plate: PlateDto) => plate.code).join(', ');
          } else {
            value = '';
          }
          break;
        case 'lastWorkOrder':
          if (!product.workOrders?.length) {
            break;
          }
          const sortedWorkOrders = product.workOrders.sort((a, b) =>
            (b.orderedAt as string).localeCompare(a.orderedAt as string),
          );
          const lastWorkOrder = sortedWorkOrders[0];
          value = formatDate(lastWorkOrder.orderedAt);
          break;
        default:
          break;
      }

      return { ...processedProduct, [label]: value };
    }, {}),
  );
}

function processPlatesForDownload(plates: PlateDto[]) {
  const plateDataKeys = Object.keys(PLATE_KEY_TO_LABEL);

  return plates.map((plate) =>
    plateDataKeys.reduce((processedPlate, key) => {
      const label = (PLATE_KEY_TO_LABEL[key] as string) || key;
      // @ts-ignore
      let value = plate[key];

      switch (key) {
        case 'material':
          // @ts-ignore
          value = PLATE_MATERIAL_TEXT[value];
          break;
        case 'products':
          value = value.map((product: ProductDto) => getProductTitle(product)).join(',');
          break;
        case 'createdAt':
        case 'updatedAt':
          value = formatDate(value);
          break;
        default:
          break;
      }

      return { ...processedPlate, [label]: value };
    }, {}),
  );
}

function processWorkOrdersForDownload(
  workOrders: (WorkOrderDto | ((CreateWorkOrderDto | CreateWorkOrdersDto) & { reason: string }))[],
) {
  const workOrderDataKeys = Object.keys(WORK_ORDER_KEY_TO_LABEL);

  return workOrders.map((workOrder) =>
    workOrderDataKeys.reduce((processedWorkOrder, key) => {
      const label = WORK_ORDER_KEY_TO_LABEL[key] || key;
      // @ts-ignore
      let value = workOrder[key];

      switch (key) {
        case 'orderedAt':
        case 'deliverBy':
        case 'completedAt':
        case 'deliveredAt':
          value = formatDate(value);
          break;
        case 'accountName':
          // @ts-ignore
          value = workOrder.product ? workOrder.product.account.name : workOrder.accountName;
          break;
        case 'productName':
          // @ts-ignore
          value = workOrder.product ? workOrder.product.name : workOrder.productName;
          break;
        case 'thickness':
        case 'length':
        case 'width':
          // @ts-ignore
          value = +workOrder.product[key];
          break;
        case 'plateStatus':
          value = PLATE_STATUS_TEXT[value];
          break;
        case 'shouldBePunctual':
        case 'shouldKeepRemainder':
        case 'isUrgent':
          value = value ? 'Y' : '';
          break;
        case 'deliveryMethod':
          value = DELIVERY_METHOD_TEXT[value];
          break;
        default:
          break;
      }

      return { ...processedWorkOrder, [label]: value };
    }, {}),
  );
}

export const downloadWorkbook = {
  [ExcelVariant.ACCOUNT]: (
    accounts: (AccountDto | (CreateAccountDto & { reason: string }))[],
    workbookTitle: string,
  ) => {
    const data = processAccountsForDownload(accounts);
    return getWorkbook(data, workbookTitle);
  },
  [ExcelVariant.PRODUCT]: (
    products: (ProductDto | ((CreateProductDto | CreateProductsDto) & { reason: string }))[],
    workbookTitle: string,
  ) => {
    const data = processProductsForDownload(products);
    return getWorkbook(data, workbookTitle);
  },
  [ExcelVariant.PLATE]: (plates: PlateDto[], workbookTitle: string) => {
    const data = processPlatesForDownload(plates);
    return getWorkbook(data, workbookTitle);
  },
  [ExcelVariant.WORK_ORDER]: (
    workOrders: (
      | WorkOrderDto
      | ((CreateWorkOrderDto | CreateWorkOrdersDto) & { reason: string })
    )[],
    workbookTitle: string,
  ) => {
    const data = processWorkOrdersForDownload(workOrders);
    return getWorkbook(data, workbookTitle);
  },
};

export const getExcelFileReader: { [key in ExcelVariant]?: Function } = {
  [ExcelVariant.ACCOUNT]: (stateSetter: Dispatch<SetStateAction<CreateAccountDto[]>>) =>
    getFileReader(ExcelVariant.ACCOUNT, stateSetter),
  [ExcelVariant.PRODUCT]: (stateSetter: Dispatch<SetStateAction<CreateProductsDto[]>>) =>
    getFileReader(ExcelVariant.PRODUCT, stateSetter),
  [ExcelVariant.WORK_ORDER]: (stateSetter: Dispatch<SetStateAction<CreateWorkOrdersDto[]>>) =>
    getFileReader(ExcelVariant.WORK_ORDER, stateSetter),
};
