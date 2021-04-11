import { apiClient, handleRequest } from 'store/apiClient';

import { LoginDto } from './interface';

const api = {
  login: async (loginData: LoginDto) => handleRequest(await apiClient.post('/auth/login', loginData)),
  whoAmI: async () => handleRequest(await apiClient.get('/user/me')),
};

export { api as authApi };
