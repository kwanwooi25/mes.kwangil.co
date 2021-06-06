import { apiClient, handleRequest } from 'app/apiClient';

import { GetDeliveriesQuery } from './interface';

const urlPrefix = '/delivery';

const api = {
  getDeliveries: async (query: GetDeliveriesQuery) =>
    handleRequest(await apiClient.get(`${urlPrefix}/list`, { params: { ...query } })),
};

export { api as deliveryApi };
