import useNotification from 'features/notification/useNotification';
import { QueryClient, useMutation } from 'react-query';

import { stockApi } from './stockApi';

export const useCreateOrUpdateStocksMutation = ({
  queryClient,
  onSuccess = () => {},
  onError = () => {},
}: {
  queryClient: QueryClient;
  onSuccess?: () => any;
  onError?: () => any;
}) => {
  const { notify } = useNotification();
  const { mutateAsync: createOrUpdateStocks, isLoading: isSaving } = useMutation(stockApi.createOrUpdateStocks, {
    onSuccess: () => {
      notify({ variant: 'success', message: 'products:createOrUpdateStocksSuccess' });
      queryClient.invalidateQueries('products');
      onSuccess();
    },
    onError: () => {
      notify({ variant: 'error', message: 'products:createOrUpdateStocksFailed' });
      onError();
    },
  });

  return { createOrUpdateStocks, isSaving };
};
