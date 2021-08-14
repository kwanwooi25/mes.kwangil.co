import { handleRequest } from 'app/apiClient';

import { LoginDto, SignUpDto } from './interface';

const api = {
  login: (data: LoginDto) => handleRequest({ method: 'post', url: '/auth/login', data }),
  signUp: (data: SignUpDto) => handleRequest({ method: 'post', url: '/auth/signup', data }),
  whoAmI: () => handleRequest({ method: 'get', url: '/user/me' }),
};

export { api as authApi };
