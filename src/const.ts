import { format, subDays } from 'date-fns';
import { PlateFilter } from 'features/plate/interface';
import { ProductFilter } from 'features/product/interface';
import { WorkOrderFilter } from 'features/workOrder/interface';
import { ElementType } from 'react';

import {
  Apartment,
  Build,
  CameraRoll,
  Dashboard,
  Person,
  PhotoLibrary,
  Settings,
} from '@mui/icons-material';

export enum Path {
  HOME = '/',
  LOGIN = '/login',
  REGISTER = '/register',
  DASHBOARD = '/dashboard',
  ACCOUNTS = '/accounts',
  PRODUCTS = '/products',
  PLATES = '/plates',
  WORK_ORDERS = '/workOrders',
  USERS = '/users',
  SETTINGS = '/settings',
}

export enum ExcelVariant {
  ACCOUNT = 'accounts',
  PRODUCT = 'products',
  WORK_ORDER = 'workOrders',
}

export enum Permissions {
  ACCOUNT_READ = 'ACCOUNT_READ',
  ACCOUNT_CREATE = 'ACCOUNT_CREATE',
  ACCOUNT_UPDATE = 'ACCOUNT_UPDATE',
  ACCOUNT_DELETE = 'ACCOUNT_DELETE',
  QUOTE_READ = 'QUOTE_READ',
  QUOTE_CREATE = 'QUOTE_CREATE',
  QUOTE_UPDATE = 'QUOTE_UPDATE',
  QUOTE_DELETE = 'QUOTE_DELETE',
  PRODUCT_READ = 'PRODUCT_READ',
  PRODUCT_CREATE = 'PRODUCT_CREATE',
  PRODUCT_UPDATE = 'PRODUCT_UPDATE',
  PRODUCT_DELETE = 'PRODUCT_DELETE',
  PLATE_READ = 'PLATE_READ',
  PLATE_CREATE = 'PLATE_CREATE',
  PLATE_UPDATE = 'PLATE_UPDATE',
  PLATE_DELETE = 'PLATE_DELETE',
  WORK_ORDER_READ = 'WORK_ORDER_READ',
  WORK_ORDER_CREATE = 'WORK_ORDER_CREATE',
  WORK_ORDER_UPDATE = 'WORK_ORDER_UPDATE',
  WORK_ORDER_DELETE = 'WORK_ORDER_DELETE',
  DELIVERY_READ = 'DELIVERY_READ',
  DELIVERY_CREATE = 'DELIVERY_CREATE',
  DELIVERY_UPDATE = 'DELIVERY_UPDATE',
  DELIVERY_DELETE = 'DELIVERY_DELETE',
  USER_READ = 'USER_READ',
  USER_CREATE = 'USER_CREATE',
  USER_UPDATE = 'USER_UPDATE',
  USER_DELETE = 'USER_DELETE',
}

export enum AccountListItemHeight {
  MOBILE = 72,
  TABLET = 72,
  LAPTOP = 48,
  DESKTOP = 48,
}

export enum QuoteListItemHeight {
  MOBILE = 96 + 16,
  TABLET = 72 + 16,
  DESKTOP = 48 + 16,
}

export enum ProductListItemHeight {
  MOBILE = 84 + 16,
  TABLET = 84 + 16,
  LAPTOP = 56 + 16,
  DESKTOP = 36 + 16,
}

export enum PlateListItemHeight {
  MOBILE = 52.5 + 16,
  TABLET = 52.5 + 16,
  LAPTOP = 72.5 + 16,
  DESKTOP = 36.5 + 16,
}

export enum WorkOrderListItemHeight {
  MOBILE = 228 + 16,
  TABLET = 228 + 16,
  LAPTOP = 220 + 16,
  DESKTOP = 136 + 16,
  LARGER_DESKTOP = 80 + 16,
}

export enum DeliveryListItemHeight {
  MOBILE = 88 + 8 + 16,
  TABLET = 58 + 8 + 16,
  DESKTOP = 32 + 8 + 16,
}

export enum UserListItemHeight {
  MOBILE = 56 + 8 + 16,
  TABLET = 32 + 8 + 16,
  // DESKTOP = 32 + 8 + 16,
}

export enum AccountInputs {
  name = 'name',
  crn = 'crn',
  memo = 'memo',
}

export enum ContactInputs {
  title = 'title',
  phone = 'phone',
  fax = 'fax',
  email = 'email',
  address = 'address',
  memo = 'memo',
}

export enum PrintSide {
  NONE = 'NONE',
  SINGLE = 'SINGLE',
  DOUBLE = 'DOUBLE',
}

export enum ProductThickness {
  STEP = 0.005,
  MIN = 0.05,
  MAX = 0.13,
}

export enum ProductLength {
  STEP = 0.5,
  MIN = 6,
  MAX = 100,
}

export enum ProductWidth {
  STEP = 0.5,
  MIN = 5,
  MAX = 80,
}

export enum ProductDialogMode {
  CREATE = 'CREATE',
  COPY = 'COPY',
}

export enum PrintColorCount {
  STEP = 1,
  MIN = 1,
  MAX = 3,
}

export enum PunchCount {
  STEP = 1,
  MIN = 0,
  MAX = 5,
}

export enum PackUnit {
  STEP = 500,
  MIN = 0,
  MAX = 100000,
}

export enum PlateMaterial {
  BRASS = 'BRASS',
  STEEL = 'STEEL',
}

export enum PlateRound {
  STEP = 0.5,
  MIN = 295,
  MAX = 600,
}

export enum PlateLength {
  STEP = 50,
  MIN = 250,
  MAX = 800,
}

export enum VariableRate {
  STEP = 10,
  MIN = 350,
  MAX = 700,
}

export enum PlateStatus {
  NEW = 'NEW',
  UPDATE = 'UPDATE',
  CONFIRM = 'CONFIRM',
}

export enum DeliveryMethod {
  TBD = 'TBD',
  COURIER = 'COURIER',
  DIRECT = 'DIRECT',
  EXPRESS = 'EXPRESS',
}

export enum WorkOrderStatus {
  NOT_STARTED = 'NOT_STARTED',
  EXTRUDING = 'EXTRUDING',
  PRINTING = 'PRINTING',
  CUTTING = 'CUTTING',
  COMPLETED = 'COMPLETED',
}

export enum DeadlineStatus {
  OVERDUE = 'overdue',
  IMMINENT = 'imminent',
}

export enum StockHistoryType {
  CREATED = 'CREATED',
  MANUFACTURED = 'MANUFACTURED',
  DELIVERED = 'DELIVERED',
  DISPOSAL = 'DISPOSAL',
  STOCKTAKING = 'STOCKTAKING',
}

export const NAV_WIDTH = 240;
export const NAV_ICONS: { [key: string]: ElementType } = {
  [Path.DASHBOARD]: Dashboard,
  [Path.ACCOUNTS]: Apartment,
  [Path.PRODUCTS]: PhotoLibrary,
  [Path.PLATES]: CameraRoll,
  [Path.WORK_ORDERS]: Build,
  [Path.USERS]: Person,
  [Path.SETTINGS]: Settings,
};

export const SEARCH_PANEL_WIDTH = 360;

export const DASHBOARD_CARD_MIN_WIDTH = 320;

export const PHONE_NUMBER_MAX_LENGTH = 11;
export const CRN_MAX_LENGTH = 10;

export const PHONE_INPUT_KEYS = [ContactInputs.phone, ContactInputs.fax];

export const PRINT_SIDE_TEXT: { [key: string]: string } = {
  [PrintSide.NONE]: '없음 (무지)',
  [PrintSide.SINGLE]: '단면',
  [PrintSide.DOUBLE]: '양면',
};

export const DATE_FORMAT = 'yyyy-MM-dd';
export const DATE_FORMAT_WITH_WEEKDAY = 'yyyy-MM-dd (eee)';

export const PLATE_STATUS_TEXT: { [key: string]: string } = {
  [PlateStatus.NEW]: '신규',
  [PlateStatus.UPDATE]: '수정',
  [PlateStatus.CONFIRM]: '확인',
};

export const PLATE_STATUS_CLASS: { [key in PlateStatus]: string } = {
  [PlateStatus.NEW]: '!text-white !bg-red-500',
  [PlateStatus.UPDATE]: '!text-white !bg-yellow-500',
  [PlateStatus.CONFIRM]: '!text-white !bg-gray-500',
};

export const DELIVERY_METHOD_TEXT: { [key: string]: string } = {
  [DeliveryMethod.TBD]: '미정',
  [DeliveryMethod.DIRECT]: '직납',
  [DeliveryMethod.COURIER]: '택배',
  [DeliveryMethod.EXPRESS]: '퀵/화물',
};

export const WORK_ORDER_STATUS_COLOR: { [key in WorkOrderStatus]: string } = {
  [WorkOrderStatus.NOT_STARTED]: 'red',
  [WorkOrderStatus.EXTRUDING]: 'orange',
  [WorkOrderStatus.PRINTING]: 'yellow',
  [WorkOrderStatus.CUTTING]: 'emerald',
  [WorkOrderStatus.COMPLETED]: 'gray',
};

export const DEFAULT_PAGE = Path.DASHBOARD;
export const DEFAULT_API_URL = 'http://localhost:5000';
export const DEFAULT_LIST_LIMIT = 50;

export const DEFAULT_PLATE_FILTER: PlateFilter = {
  accountName: '',
  productName: '',
  name: '',
  round: [PlateRound.MIN, PlateRound.MAX],
  length: [PlateLength.MIN, PlateLength.MAX],
};

export const DEFAULT_PRODUCT_FILTER: ProductFilter = {
  accountName: '',
  name: '',
  thickness: '',
  length: '',
  width: '',
  extColor: '',
  printColor: '',
};

export const DEFAULT_WORK_ORDER_FILTER: WorkOrderFilter = {
  orderedAt: [format(subDays(new Date(), 14), DATE_FORMAT), format(new Date(), DATE_FORMAT)],
  accountName: '',
  productName: '',
  thickness: '',
  length: '',
  width: '',
  includeCompleted: false,
};
