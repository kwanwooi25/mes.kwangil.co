import { CreateAccountDto, GetAccountsQuery, UpdateAccountDto } from './interface';
import { apiClient, handleRequest } from 'app/apiClient';

const urlPrefix = '/account';

const api = {
  getAccount: async (id: number) => handleRequest(await apiClient.get(`${urlPrefix}/${id}`)),
  getAccounts: async (query: GetAccountsQuery) =>
    handleRequest(await apiClient.get(`${urlPrefix}/list`, { params: { ...query } })),
  // getAllAccounts: async (searchText?: string) =>
  //   handleRequest(await apiClient.get(`${urlPrefix}/list/all`, { params: { searchText } })),
  createAccount: async (account: CreateAccountDto) => handleRequest(await apiClient.post(`${urlPrefix}`, account)),
  // createAccounts: async (accounts: CreateAccountDto[]) =>
  //   handleRequest(await apiClient.post(`${urlPrefix}/bulk`, accounts)),
  updateAccount: async ({ id, ...account }: UpdateAccountDto) =>
    handleRequest(await apiClient.patch(`${urlPrefix}/${id}`, account)),
  deleteAccounts: async (accountIds: number[]) =>
    handleRequest(await apiClient.delete(urlPrefix, { params: { ids: accountIds } })),
};

export { api as accountApi };
