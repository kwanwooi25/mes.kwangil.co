import { apiClient, handleRequest } from 'app/apiClient';
import { CreateStockDto, StockDto } from 'features/product/interface';

const urlPrefix = '/stock';

const api = {
  createOrUpdateStocks: async (stocks: (CreateStockDto | StockDto)[]) =>
    handleRequest(await apiClient.post(urlPrefix, stocks)),
};

export { api as stockApi };
