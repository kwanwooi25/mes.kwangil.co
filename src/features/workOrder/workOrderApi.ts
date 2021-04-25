import { CreateWorkOrderDto, CreateWorkOrdersDto, GetWorkOrdersQuery, UpdateWorkOrderDto } from './interface';
import { apiClient, handleRequest } from 'app/apiClient';

const urlPrefix = '/workOrder';

const api = {
  getWorkOrder: async (id: string) => handleRequest(await apiClient.get(`${urlPrefix}/${id}`)),
  getWorkOrders: async (query: GetWorkOrdersQuery) =>
    handleRequest(await apiClient.get(`${urlPrefix}/list`, { params: { ...query } })),
  getAllWorkOrders: async (query: GetWorkOrdersQuery) =>
    handleRequest(await apiClient.get(`${urlPrefix}/list/all`, { params: { ...query } })),
  createWorkOrder: async (workOrder: CreateWorkOrderDto) =>
    handleRequest(await apiClient.post(`${urlPrefix}`, workOrder)),
  createWorkOrders: async (workOrders: CreateWorkOrdersDto[]) =>
    handleRequest(await apiClient.post(`${urlPrefix}/bulk`, workOrders)),
  updateWorkOrder: async ({ id, ...workOrder }: UpdateWorkOrderDto) =>
    handleRequest(await apiClient.patch(`${urlPrefix}/${id}`, workOrder)),
  updateWorkOrders: async (workOrders: UpdateWorkOrderDto[]) =>
    handleRequest(await apiClient.patch(urlPrefix, workOrders)),
  deleteWorkOrders: async (workOrderIds: string[]) =>
    handleRequest(await apiClient.delete(urlPrefix, { params: { ids: workOrderIds } })),
};

export { api as workOrderApi };
