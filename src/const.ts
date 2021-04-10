export enum Path {
  HOME = '/',
  LOGIN = '/login',
  DASHBOARD = '/dashboard',
  ACCOUNTS = '/accounts',
  PRODUCTS = '/products',
  PLATES = '/plates',
  WORK_ORDERS = '/workOrders',
}

export const DEFAULT_PAGE = Path.DASHBOARD;
export const DEFAULT_API_URL = 'http://localhost:5000';

export const NAV_WIDTH = 240;
export const NAV_PATHS = [Path.DASHBOARD, Path.ACCOUNTS, Path.PRODUCTS, Path.PLATES, Path.WORK_ORDERS];
