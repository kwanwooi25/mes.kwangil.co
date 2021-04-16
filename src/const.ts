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

export enum AccountListItemHeight {
  XS = 72,
  MD = 54,
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
