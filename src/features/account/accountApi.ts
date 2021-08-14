import { handleRequest } from 'app/apiClient';

import { CreateAccountDto, GetAccountsQuery, UpdateAccountDto } from './interface';

const urlPrefix = '/account';

const api = {
  getAccount: (id: number) => handleRequest({ method: 'get', url: `${urlPrefix}/${id}` }),
  getAccounts: (params: GetAccountsQuery) => handleRequest({ method: 'get', url: `${urlPrefix}/list`, params }),
  getAllAccounts: (accountName?: string) =>
    handleRequest({ method: 'get', url: `${urlPrefix}/list/all`, params: { accountName } }),
  createAccount: (data: CreateAccountDto) => handleRequest({ method: 'post', url: `${urlPrefix}`, data }),
  createAccounts: (data: CreateAccountDto[]) => handleRequest({ method: 'post', url: `${urlPrefix}/bulk`, data }),
  updateAccount: ({ id, ...data }: UpdateAccountDto) =>
    handleRequest({ method: 'patch', url: `${urlPrefix}/${id}`, data }),
  deleteAccounts: (ids: number[]) => handleRequest({ method: 'delete', url: urlPrefix, params: { ids } }),
};

export { api as accountApi };
