import { handleRequest } from 'app/apiClient';
import { CreateStockDto, StockDto } from 'features/product/interface';

const urlPrefix = '/stock';

const api = {
  createOrUpdateStocks: (data: (CreateStockDto | StockDto)[]) =>
    handleRequest({ method: 'post', url: urlPrefix, data }),
};

export { api as stockApi };
