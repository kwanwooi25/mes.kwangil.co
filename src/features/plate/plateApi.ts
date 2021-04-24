import { CreatePlateDto, GetPlatesQuery, UpdatePlateDto } from './interface';
import { apiClient, handleRequest } from 'app/apiClient';

const urlPrefix = '/plate';

const api = {
  getPlate: async (id: number) => handleRequest(await apiClient.get(`${urlPrefix}/${id}`)),
  getPlates: async (query: GetPlatesQuery) =>
    handleRequest(await apiClient.get(`${urlPrefix}/list`, { params: { ...query } })),
  createPlate: async (plate: CreatePlateDto) => handleRequest(await apiClient.post(`${urlPrefix}`, plate)),
  updatePlate: async ({ id, ...plate }: UpdatePlateDto) =>
    handleRequest(await apiClient.patch(`${urlPrefix}/${id}`, plate)),
  deletePlates: async (plateIds: number[]) =>
    handleRequest(await apiClient.delete(urlPrefix, { params: { ids: plateIds } })),
};

export { api as plateApi };
