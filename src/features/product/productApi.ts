import { CreateProductDto, CreateProductsDto, GetProductsQuery, UpdateProductDto } from './interface';
import { apiClient, handleRequest } from 'app/apiClient';

const urlPrefix = '/product';

const api = {
  getProduct: async (id: number) => handleRequest(await apiClient.get(`${urlPrefix}/${id}`)),
  getProducts: async (query: GetProductsQuery) =>
    handleRequest(await apiClient.get(`${urlPrefix}/list`, { params: { ...query } })),
  getAllProducts: async (query: GetProductsQuery) =>
    handleRequest(await apiClient.get(`${urlPrefix}/list/all`, { params: { ...query } })),
  createProduct: async (product: CreateProductDto) => handleRequest(await apiClient.post(`${urlPrefix}`, product)),
  createProducts: async (products: CreateProductsDto[]) =>
    handleRequest(await apiClient.post(`${urlPrefix}/bulk`, products)),
  updateProduct: async ({ id, ...product }: UpdateProductDto) =>
    handleRequest(await apiClient.patch(`${urlPrefix}/${id}`, product)),
  deleteProducts: async (productIds: number[]) =>
    handleRequest(await apiClient.delete(urlPrefix, { params: { ids: productIds } })),
};

export { api as productApi };
