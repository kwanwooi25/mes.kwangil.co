import { handleRequest } from 'app/apiClient';

import {
    CreateProductDto, CreateProductsDto, GetProductsQuery, UpdateProductDto
} from './interface';

const urlPrefix = '/product';

const api = {
  getProduct: (id: number) => handleRequest({ method: 'get', url: `${urlPrefix}/${id}` }),
  getProducts: (params: GetProductsQuery) => handleRequest({ method: 'get', url: `${urlPrefix}/list`, params }),
  getAllProducts: (params: GetProductsQuery) => handleRequest({ method: 'get', url: `${urlPrefix}/list/all`, params }),
  createProduct: (data: CreateProductDto) => handleRequest({ method: 'post', url: `${urlPrefix}`, data }),
  createProducts: (data: CreateProductsDto[]) => handleRequest({ method: 'post', url: `${urlPrefix}/bulk`, data }),
  updateProduct: ({ id, ...data }: UpdateProductDto) =>
    handleRequest({ method: 'patch', url: `${urlPrefix}/${id}`, data }),
  deleteProducts: (ids: number[]) => handleRequest({ method: 'delete', url: urlPrefix, params: { ids } }),
};

export { api as productApi };
