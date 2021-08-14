import { handleRequest } from 'app/apiClient';

import {
    CompleteWorkOrderDto, CreateWorkOrderDto, CreateWorkOrdersDto, GetWorkOrderCountQuery,
    GetWorkOrdersByDeadlineQuery, GetWorkOrdersQuery, UpdateWorkOrderDto
} from './interface';

const urlPrefix = '/workOrder';

const api = {
  getWorkOrder: (id: string) => handleRequest({ method: 'get', url: `${urlPrefix}/${id}` }),
  getWorkOrders: (params: GetWorkOrdersQuery) => handleRequest({ method: 'get', url: `${urlPrefix}/list`, params }),
  getAllWorkOrders: (params: GetWorkOrdersQuery) =>
    handleRequest({ method: 'get', url: `${urlPrefix}/list/all`, params }),
  getWorkOrdersByDeadline: (params: GetWorkOrdersByDeadlineQuery) =>
    handleRequest({ method: 'get', url: `${urlPrefix}/list/deadline`, params }),
  getWorkOrdersNeedPlate: () => handleRequest({ method: 'get', url: `${urlPrefix}/list/needPlate` }),
  getWorkOrdersByProductId: (productId: number) =>
    handleRequest({ method: 'get', url: `${urlPrefix}/list/${productId}` }),
  getWorkOrderCount: (params: GetWorkOrderCountQuery) =>
    handleRequest({ method: 'get', url: `${urlPrefix}/count`, params }),
  createWorkOrder: (data: CreateWorkOrderDto) => handleRequest({ method: 'post', url: `${urlPrefix}`, data }),
  createWorkOrders: (data: CreateWorkOrdersDto[]) => handleRequest({ method: 'post', url: `${urlPrefix}/bulk`, data }),
  updateWorkOrder: ({ id, ...data }: UpdateWorkOrderDto) =>
    handleRequest({ method: 'patch', url: `${urlPrefix}/${id}`, data }),
  updateWorkOrders: (data: UpdateWorkOrderDto[]) => handleRequest({ method: 'patch', url: urlPrefix, data }),
  completeWorkOrders: (data: CompleteWorkOrderDto[]) =>
    handleRequest({ method: 'patch', url: `${urlPrefix}/complete`, data }),
  deleteWorkOrders: (ids: string[]) => handleRequest({ method: 'delete', url: urlPrefix, params: { ids } }),
};

export { api as workOrderApi };
