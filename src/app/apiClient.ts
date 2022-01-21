import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { push } from 'connected-react-router';
import { DEFAULT_API_URL, Path } from 'const';
import { authActions } from 'features/auth/authSlice';
import { notificationActions } from 'features/notification/notificationSlice';

import store from './store';

const baseURL = process.env.REACT_APP_API_URL || DEFAULT_API_URL;

const apiClient = axios.create({ baseURL });

apiClient.interceptors.response.use(
  (res: AxiosResponse) => res,
  (error: AxiosError) => {
    if (error.response?.data.message === 'Token invalid') {
      store.dispatch(authActions.loginFailed());
      store.dispatch(
        notificationActions.notify({ variant: 'error', message: 'auth:loginRequired' }),
      );
      store.dispatch(push(Path.LOGIN));
    }
  },
);

const setAuthHeaders = (token?: string) => {
  if (token) {
    localStorage.setItem('token', token);
  } else {
    localStorage.removeItem('token');
  }

  apiClient.defaults.headers.common = {
    ...apiClient.defaults.headers.common,
    authorization: !token ? '' : `Bearer ${token}`,
  };
};

const getAuthToken = () => localStorage.getItem('token') || '';

const handleRequest = (config: AxiosRequestConfig) => {
  const onSuccess = (res: AxiosResponse) => res.data;
  const onError = (error: AxiosError) => Promise.reject(error.response || error.message);

  return apiClient(config).then(onSuccess).catch(onError);
};

export { apiClient, handleRequest, setAuthHeaders, getAuthToken };
