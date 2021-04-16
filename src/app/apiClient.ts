import axios, { AxiosResponse } from 'axios';

import { DEFAULT_API_URL } from 'const';

const baseURL = process.env.API_URL || DEFAULT_API_URL;

const apiClient = axios.create({ baseURL });

// apiClient.interceptors.response.use(
//   (res: AxiosResponse) => res,
//   (error: AxiosError) => {
//     if (error.response?.data.message === 'Token invalid') {
//       store.dispatch(actions.auth.logout());
//       store.dispatch(actions.snackbar.enqueueErrorSnackbar('다시 로그인 해주세요.'));
//     }
//   }
// );

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
