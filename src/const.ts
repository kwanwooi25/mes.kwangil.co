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
}

export enum AccountListItemHeight {
  XS = 72,
  MD = 54,
}

export enum ProductListItemHeight {
  XS = 104,
  SM = 72,
  LG = 54,
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

export enum PlateMaterial {
  BRASS = 'BRASS',
  STEEL = 'STEEL',
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

export const PRINT_SIDE_TEXT = {
  [PrintSide.NONE]: '없음 (무지)',
  [PrintSide.SINGLE]: '단면',
  [PrintSide.DOUBLE]: '양면',
};
