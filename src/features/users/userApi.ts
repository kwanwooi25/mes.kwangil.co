import { handleRequest } from 'app/apiClient';

import { GetUsersQuery, UpdateUserDto } from './interface';

const urlPrefix = '/user';

const api = {
  getUsers: (params: GetUsersQuery) => handleRequest({ method: 'get', url: `${urlPrefix}/list`, params }),
  updateUser: ({ id, ...data }: UpdateUserDto) => handleRequest({ method: 'patch', url: `${urlPrefix}/${id}`, data }),
};

export { api as userApi };
