import { handleRequest } from 'app/apiClient';

import { CreatePlateDto, GetPlatesQuery, UpdatePlateDto } from './interface';

const urlPrefix = '/plate';

const api = {
  getPlate: (id: number) => handleRequest({ method: 'get', url: `${urlPrefix}/${id}` }),
  getPlates: (params: GetPlatesQuery) =>
    handleRequest({ method: 'get', url: `${urlPrefix}/list`, params }),
  getAllPlates: (params: GetPlatesQuery) =>
    handleRequest({ method: 'get', url: `${urlPrefix}/list/all`, params }),
  createPlate: (data: CreatePlateDto) =>
    handleRequest({ method: 'post', url: `${urlPrefix}`, data }),
  updatePlate: ({ id, ...data }: UpdatePlateDto) =>
    handleRequest({ method: 'patch', url: `${urlPrefix}/${id}`, data }),
  deletePlates: (ids: number[]) =>
    handleRequest({ method: 'delete', url: urlPrefix, params: { ids } }),
};

export { api as plateApi };
