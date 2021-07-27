import axios, { AxiosError, AxiosResponse } from 'axios';
import { DEFAULT_API_URL } from 'const';
import { authActions } from 'features/auth/authSlice';
import { notificationActions } from 'features/notification/notificationSlice';

import store from './store';

const baseURL = process.env.REACT_APP_API_URL || DEFAULT_API_URL;

const apiClient = axios.create({ baseURL });

apiClient.interceptors.response.use(
  (res: AxiosResponse) => res,
  (error: AxiosError) => {
    if (error.response?.data.message === 'Token invalid') {
      store.dispatch(authActions.logout());
      store.dispatch(notificationActions.notify({ variant: 'error', message: 'auth:loginRequired' }));
    }
  }
);

const setAuthHeaders = (token?: string) => {
  localStorage.setItem('token', JSON.stringify(token));
  apiClient.defaults.headers = {
    ...apiClient.defaults.headers,
    authorization: !token ? undefined : `Bearer ${token}`,
  };
};

const getAuthToken = () => {
  const token = localStorage.getItem('token');
  return token && JSON.parse(token);
};

const handleRequest = (res: AxiosResponse) => {
  try {
    return res && res.data;
  } catch (e) {
    throw Error(e.message);
  }
};

export { apiClient, handleRequest, setAuthHeaders, getAuthToken };
