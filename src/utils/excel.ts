import { AccountDto, CreateAccountDto, CreateContactDto } from 'features/account/interface';
import { Dispatch, SetStateAction } from 'react';

import { ExcelUploadVariant } from 'const';
import XLSX from 'xlsx';

export const getExcelFileReader = {
  [ExcelUploadVariant.ACCOUNT]: (stateSetter: Dispatch<SetStateAction<CreateAccountDto[]>>) =>
    getFileReader(ExcelUploadVariant.ACCOUNT, stateSetter),
  // [ExcelUploadVariant.PRODUCT]: (stateSetter: Dispatch<SetStateAction<CreateProductsDto[]>>) =>
  //   getFileReader(ExcelUploadVariant.PRODUCT, stateSetter),
  // [ExcelUploadVariant.WORK_ORDER]: (stateSetter: Dispatch<SetStateAction<CreateWorkOrdersDto[]>>) =>
  //   getFileReader(ExcelUploadVariant.WORK_ORDER, stateSetter),
};

export const downloadWorkbook = {
  [ExcelUploadVariant.ACCOUNT]: (accounts: AccountDto[], workbookTitle: string) => {
    const data = processAccountsForDownload(accounts);
    return getWorkbook(data, workbookTitle);
  },
  // [ExcelUploadVariant.PRODUCT]: (products: ProductDto[], workbookTitle: string) => {
  //   const data = processProductsForDownload(products);
  //   return getWorkbook(data, workbookTitle);
  // },
};

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

// const PRODUCT_LABEL_TO_KEY: { [key: string]: keyof CreateProductsDto } = {
//   업체명: 'accountName',
//   제품명: 'name',
//   두께: 'thickness',
//   길이: 'length',
//   너비: 'width',
//   원단색상: 'extColor',
//   대전방지: 'extIsAntistatic',
//   처리: 'printSide',
//   압출메모: 'extMemo',
//   전면도수: 'printFrontColorCount',
//   전면색상: 'printFrontColor',
//   전면인쇄위치: 'printFrontPosition',
//   후면도수: 'printBackColorCount',
//   후면색상: 'printBackColor',
//   후면인쇄위치: 'printBackPosition',
//   인쇄메모: 'printMemo',
//   가공위치: 'cutPosition',
//   초음파가공: 'cutIsUltrasonic',
//   가루포장: 'cutIsForPowder',
//   펀치개수: 'cutPunchCount',
//   펀치크기: 'cutPunchSize',
//   펀치위치: 'cutPunchPosition',
//   가공메모: 'cutMemo',
//   포장방법: 'packMaterial',
//   포장단위: 'packUnit',
//   전량납품: 'packCanDeliverAll',
//   포장메모: 'packMemo',
//   이미지: 'images',
// };

// const PRODUCT_KEY_TO_LABEL: { [key: string]: string } = {
//   accountName: '업체명',
//   name: '제품명',
//   thickness: '두께',
//   length: '길이',
//   width: '너비',
//   extColor: '원단색상',
//   extIsAntistatic: '대전방지',
//   printSide: '처리',
//   extMemo: '압출메모',
//   printFrontColorCount: '전면도수',
//   printFrontColor: '전면색상',
//   printFrontPosition: '전면인쇄위치',
//   printBackColorCount: '후면도수',
//   printBackColor: '후면색상',
//   printBackPosition: '후면인쇄위치',
//   printMemo: '인쇄메모',
//   cutPosition: '가공위치',
//   cutIsUltrasonic: '초음파가공',
//   cutIsForPowder: '가루포장',
//   cutPunchCount: '펀치개수',
//   cutPunchSize: '펀치크기',
//   cutPunchPosition: '펀치위치',
//   cutMemo: '가공메모',
//   packMaterial: '포장방법',
//   packUnit: '포장단위',
//   packCanDeliverAll: '전량납품',
//   packMemo: '포장메모',
//   images: '이미지',
// };

// const WORK_ORDER_LABEL_TO_KEY: { [key: string]: keyof CreateWorkOrdersDto } = {
//   아이디: 'id',
//   주문일: 'orderedAt',
//   업체명: 'accountName',
//   제품명: 'productName',
//   두께: 'thickness',
//   길이: 'length',
//   너비: 'width',
//   주문수량: 'orderQuantity',
//   동판상태: 'plateStatus',
//   납기일: 'deliverBy',
//   납기엄수: 'shouldBePunctual',
//   지급: 'isUrgent',
//   작업메모: 'workMemo',
//   납품메모: 'deliveryMemo',
//   완료일: 'completedAt',
//   완료수량: 'completedQuantity',
//   납품일: 'deliveredAt',
//   납품수량: 'deliveredQuantity',
// };

// const WORK_ORDER_KEY_TO_LABEL: { [key: string]: string } = {
//   id: '아이디',
//   orderedAt: '주문일',
//   accountName: '업체명',
//   productName: '제품명',
//   thickness: '두께',
//   length: '길이',
//   width: '너비',
//   orderQuantity: '주문수량',
//   plateStatus: '동판상태',
//   deliverBy: '납기일',
//   shouldBePunctual: '납기엄수',
//   isUrgent: '지급',
//   workMemo: '작업메모',
//   deliveryMemo: '납품메모',
//   workOrderStatus: '작업상태',
//   completedAt: '완료일',
//   completedQuantity: '완료수량',
//   deliveredAt: '납품일',
//   deliveredQuantity: '납품수량',
//   deliveryMethod: '납품방법',
// };

function getFileReader<T>(variant: ExcelUploadVariant, stateSetter: Dispatch<SetStateAction<T[]>>) {
  const reader = new FileReader();
  reader.onload = function (e) {
    if (!e.target?.result) {
      return;
    }
    const data = new Uint8Array(e.target.result as ArrayBufferLike);
    const workbook = XLSX.read(data, { type: 'array' });
    const array = XLSX.utils.sheet_to_json(workbook.Sheets[variant]);
    // @ts-ignore
    const items: T[] = array.map((row) => generateItem[variant](row));
    stateSetter && stateSetter(items);
  };
  return reader;
}

export function getWorkbook(data: any, workbookTitle: string = 'noTitle') {
  const sheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  workbook.SheetNames.push(workbookTitle);
  workbook.Sheets[workbookTitle] = sheet;
  XLSX.writeFile(workbook, `${workbookTitle}.xlsx`);
  return workbook;
}

const generateItem = {
  [ExcelUploadVariant.ACCOUNT]: (row: any) => {
    return Object.entries(row).reduce(
      (account: CreateAccountDto, [key, value]) => {
        if (key.includes('연락처')) {
          const [contactTitle, contactKey] = key.split(' ');
          const contactIndex = +contactTitle.slice(-1) - 1;
          const contacts: CreateContactDto[] = account.contacts || [{ title: '기본', isBase: true }];
          const newKey: keyof CreateContactDto = CONTACT_LABEL_TO_KEY[contactKey];
          if (!contacts[contactIndex] && newKey === 'title' && !!value) {
            contacts.push({ title: value as string });
          } else if (!!contacts[contactIndex]) {
            // @ts-ignore
            contacts[contactIndex][newKey] = value;
          }
          return { ...account, contacts };
        } else {
          const newKey: keyof CreateAccountDto = ACCOUNT_LABEL_TO_KEY[key];
          return { ...account, [newKey]: value };
        }
      },
      { name: '' }
    );
  },
  // [ExcelUploadVariant.PRODUCT]: (row: any) => {
  //   return Object.entries(row).reduce(
  //     (product: CreateProductsDto, [key, value]) => {
  //       const newKey: keyof CreateProductsDto = PRODUCT_LABEL_TO_KEY[key];
  //       let newValue;

  //       switch (newKey) {
  //         case 'images':
  //           // const imageBucketUrl = `https://${process.env.REACT_APP_S3_IMAGE_BUCKET_NAME}.s3.amazonaws.com/`;
  //           const imageBucketUrl = `https://kwangilmes-product-images.s3.amazonaws.com/`;
  //           const fileName = getFileNameFromUrl(value as string);
  //           const imageUrl = `${imageBucketUrl}${fileName}`;
  //           newValue = [{ fileName, imageUrl }];
  //           break;
  //         case 'printSide':
  //           if (value === '단면') {
  //             newValue = PrintSide.SINGLE;
  //           } else if (value === '양면') {
  //             newValue = PrintSide.DOUBLE;
  //           } else {
  //             newValue = PrintSide.NONE;
  //           }
  //           break;
  //         case 'extIsAntistatic':
  //         case 'cutIsUltrasonic':
  //         case 'cutIsForPowder':
  //         case 'packCanDeliverAll':
  //           newValue = value === 'Y';
  //           break;
  //         default:
  //           newValue = value;
  //       }

  //       return { ...product, [newKey]: newValue };
  //     },
  //     {
  //       accountName: '',
  //       name: '',
  //       thickness: 0.05,
  //       length: 0,
  //       width: 0,
  //       extColor: '',
  //       extIsAntistatic: false,
  //       extMemo: '',
  //       printSide: PrintSide.NONE,
  //       printFrontColorCount: 0,
  //       printFrontColor: '',
  //       printFrontPosition: '',
  //       printBackColorCount: 0,
  //       printBackColor: '',
  //       printBackPosition: '',
  //       printMemo: '',
  //       cutPosition: '',
  //       cutIsUltrasonic: false,
  //       cutIsForPowder: false,
  //       cutPunchCount: 0,
  //       cutPunchSize: '',
  //       cutPunchPosition: '',
  //       cutMemo: '',
  //       packMaterial: '',
  //       packUnit: 0,
  //       packCanDeliverAll: false,
  //       packMemo: '',
  //       images: [],
  //     }
  //   );
  // },
  // [ExcelUploadVariant.WORK_ORDER]: (row: any) => {
  //   return Object.entries(row).reduce(
  //     (workOrder: CreateWorkOrdersDto, [key, value]) => {
  //       const newKey: keyof CreateWorkOrdersDto = WORK_ORDER_LABEL_TO_KEY[key];
  //       let newValue;

  //       switch (newKey) {
  //         case 'plateStatus':
  //           if (value === '신규') {
  //             newValue = PlateStatus.NEW;
  //           } else if (value === '수정') {
  //             newValue = PlateStatus.UPDATE;
  //           } else {
  //             newValue = PlateStatus.CONFIRM;
  //           }
  //           break;
  //         case 'shouldBePunctual':
  //         case 'isUrgent':
  //           newValue = value === 'Y';
  //           break;
  //         case 'deliveredAt':
  //           newValue = value;
  //           break;
  //         case 'completedAt':
  //           newValue = value;
  //           workOrder.workOrderStatus = WorkOrderStatus.COMPLETED;
  //           break;

  //         default:
  //           newValue = value;
  //       }

  //       return { ...workOrder, [newKey]: newValue };
  //     },
  //     {
  //       id: '',
  //       orderedAt: '',
  //       deliverBy: '',
  //       orderQuantity: 0,
  //       isUrgent: false,
  //       shouldBePunctual: false,
  //       plateStatus: PlateStatus.CONFIRM,
  //       isPlateReady: true,
  //       deliveryMethod: DeliveryMethod.TBD,
  //       workMemo: '',
  //       deliveryMemo: '',
  //       workOrderStatus: WorkOrderStatus.NOT_STARTED,
  //       completedAt: null,
  //       completedQuantity: 0,
  //       deliveredAt: null,
  //       deliveredQuantity: 0,
  //       accountName: '',
  //       productName: '',
  //       thickness: 0.05,
  //       length: 0,
  //       width: 0,
  //     }
  //   );
  // },
};

function processAccountsForDownload(accounts: AccountDto[]) {
  const accountDataKeys = Object.keys(ACCOUNT_KEY_TO_LABEL);
  const contactDataKeys = Object.keys(CONTACT_KEY_TO_LABEL);

  return accounts.map((account) => {
    return Object.entries(account).reduce((processedAccount, [key, value]) => {
      if (accountDataKeys.includes(key)) {
        return {
          ...processedAccount,
          [ACCOUNT_KEY_TO_LABEL[key]]: value,
        };
      } else if (key === 'contacts') {
        account.contacts?.slice(0, 2).forEach((contact, index) => {
          const prefix = `연락처${index + 1}`;
          const processedContact = Object.entries(contact).reduce((processedContact, [key, value]) => {
            if (contactDataKeys.includes(key)) {
              return {
                ...processedContact,
                [`${prefix} ${CONTACT_KEY_TO_LABEL[key]}`]: value,
              };
            }
            return processedContact;
          }, {});
          processedAccount = {
            ...processedAccount,
            ...processedContact,
          };
        });
        return { ...processedAccount };
      }

      return processedAccount;
    }, {});
  });
}

// function processProductsForDownload(products: ProductDto[]) {
//   const productDataKeys = Object.keys(PRODUCT_KEY_TO_LABEL);

//   return products.map((product) => {
//     return productDataKeys.reduce((processedProduct, key) => {
//       const label = PRODUCT_KEY_TO_LABEL[key];
//       // @ts-ignore
//       let value = product[key];

//       switch (key) {
//         case 'accountName':
//           value = product.account.name;
//           break;
//         case 'extIsAntistatic':
//         case 'cutIsUltrasonic':
//         case 'cutIsForPowder':
//         case 'packCanDeliverAll':
//           value = value ? 'Y' : 'N';
//         case 'printSide':
//           // @ts-ignore
//           value = PRINT_SIDE_TEXT[value];
//         case 'images':
//           if (value && value.length) {
//             value = value[0].imageUrl;
//           }
//       }

//       return { ...processedProduct, [label]: value };
//     }, {});
//   });
// }
