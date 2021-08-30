import { handleRequest } from 'app/apiClient';

import { CreateQuoteDto, GetQuotesQuery } from './interface';

const urlPrefix = '/quote';

const api = {
  getQuote: (id: number) => handleRequest({ method: 'get', url: `${urlPrefix}/${id}` }),
  getQuotes: (params: GetQuotesQuery) => handleRequest({ method: 'get', url: `${urlPrefix}/list`, params }),
  getAllQuotes: (params: GetQuotesQuery) => handleRequest({ method: 'get', url: `${urlPrefix}/list/all`, params }),
  createQuote: (data: CreateQuoteDto) => handleRequest({ method: 'post', url: `${urlPrefix}`, data }),
};

export { api as quoteApi };
