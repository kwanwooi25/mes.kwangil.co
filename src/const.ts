import ApartmentIcon from '@material-ui/icons/Apartment';
import BuildIcon from '@material-ui/icons/Build';
import CameraRollIcon from '@material-ui/icons/CameraRoll';
import DashboardIcon from '@material-ui/icons/Dashboard';
import { ElementType } from 'react';
import PhotoLibraryIcon from '@material-ui/icons/PhotoLibrary';

export enum Path {
  HOME = '/',
  LOGIN = '/login',
  DASHBOARD = '/dashboard',
  ACCOUNTS = '/accounts',
  PRODUCTS = '/products',
  PLATES = '/plates',
  WORK_ORDERS = '/workOrders',
}

export enum ExcelVariant {
  ACCOUNT = 'accounts',
  PRODUCT = 'products',
  WORK_ORDER = 'workOrders',
}

export enum LoadingKeys {
  LOGIN = 'LOGIN',
  REFRESH_LOGIN = 'REFRESH_LOGIN',
  UPLOADING = 'UPLOADING',
  GET_ACCOUNTS = 'GET_ACCOUNTS',
  SAVING_ACCOUNT = 'SAVING_ACCOUNT',
  GET_PRODUCTS = 'GET_PRODUCTS',
  SAVING_PRODUCT = 'SAVING_PRODUCT',
  GET_PLATES = 'GET_PLATES',
  SAVING_PLATE = 'SAVING_PLATE',
  GET_WORK_ORDERS = 'GET_WORK_ORDERS',
  SAVING_WORK_ORDER = 'SAVING_WORK_ORDER',
}

export enum AccountListItemHeight {
  MOBILE = 72,
  TABLET = 54,
}

export enum ProductListItemHeight {
  MOBILE = 104,
  TABLET = 72,
  DESKTOP = 54,
}

export enum PlateListItemHeight {
  MOBILE = 64,
  TABLET = 73,
  DESKTOP = 54,
}

export enum WorkOrderListItemHeight {
  MOBILE = 293 + 8 + 16,
  TABLET = 138 + 8 + 16,
  DESKTOP = 72 + 8 + 16,
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
  EDIT = 'EDIT',
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
  MIN = 300,
  MAX = 600,
}

export enum PlateLength {
  STEP = 50,
  MIN = 300,
  MAX = 800,
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

export const DEFAULT_PAGE = Path.DASHBOARD;
export const DEFAULT_API_URL = 'http://localhost:5000';
export const DEFAULT_LIST_LIMIT = 50;

export const NAV_WIDTH = 240;
export const NAV_PATHS = [Path.DASHBOARD, Path.ACCOUNTS, Path.PRODUCTS, Path.PLATES, Path.WORK_ORDERS];
export const NAV_ICONS: { [key: string]: ElementType } = {
  [Path.DASHBOARD]: DashboardIcon,
  [Path.ACCOUNTS]: ApartmentIcon,
  [Path.PRODUCTS]: PhotoLibraryIcon,
  [Path.PLATES]: CameraRollIcon,
  [Path.WORK_ORDERS]: BuildIcon,
};

export const SEARCH_PANEL_WIDTH = 360;

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

export const DELIVERY_METHOD_TEXT: { [key: string]: string } = {
  [DeliveryMethod.TBD]: '미정',
  [DeliveryMethod.DIRECT]: '직납',
  [DeliveryMethod.COURIER]: '택배',
  [DeliveryMethod.EXPRESS]: '퀵/화물',
};
