import { DEFAULT_LIST_LIMIT, ExcelVariant } from 'const';
import useNotification from 'features/notification/useNotification';
import { WorkOrderDto } from 'features/workOrder/interface';
import { workOrderApi } from 'features/workOrder/workOrderApi';
import { QueryClient, useInfiniteQuery, useMutation, useQuery } from 'react-query';
import { GetListResponse } from 'types/api';
import { downloadWorkbook } from 'utils/excel';

import { WorkOrderFilter } from './interface';

export const useInfiniteWorkOrders = (filter: WorkOrderFilter, limit: number = DEFAULT_LIST_LIMIT) => {
  const workOrderInfiniteQuery = useInfiniteQuery(
    ['workOrders', JSON.stringify(filter)],
    async ({ queryKey, pageParam: offset = 0 }): Promise<GetListResponse<WorkOrderDto>> => {
      const [, serializedFilter] = queryKey;
      const filter = JSON.parse(serializedFilter);
      return await workOrderApi.getWorkOrders({ offset, limit, ...filter });
    },
    {
      getNextPageParam: (lastPage, pages) => lastPage.hasMore && pages.length * limit,
    }
  );

  const { isFetching, fetchNextPage, hasNextPage } = workOrderInfiniteQuery;

  const loadMore = () => hasNextPage && !isFetching && fetchNextPage();

  return { loadMore, ...workOrderInfiniteQuery };
};

export const useDownloadWorkOrders = (filter: WorkOrderFilter) => {
  const { isFetching: isDownloading, refetch } = useQuery(
    ['download-workOrders', JSON.stringify(filter)],
    async ({ queryKey }) => {
      const [, serializedFilter] = queryKey;
      const filter = JSON.parse(serializedFilter);
      const { rows } = await workOrderApi.getAllWorkOrders(filter);
      return rows;
    },
    { enabled: false }
  );

  const download = (fileName: string) => {
    refetch().then((res) => {
      downloadWorkbook[ExcelVariant.WORK_ORDER](res.data, fileName);
    });
  };

  return { isDownloading, download };
};

export const useWorkOrder = (id: string) =>
  useQuery(
    ['workOrder', id],
    async ({ queryKey }) => {
      const [, workOrderId] = queryKey;
      return await workOrderApi.getWorkOrder(workOrderId);
    },
    { enabled: false }
  );

export const useWorkOrdersByProduct = (productId: number) =>
  useQuery(
    ['workOrdersByProductId', productId],
    async ({ queryKey }) => {
      const [, productId] = queryKey;
      return await workOrderApi.getWorkOrdersByProductId(+productId);
    },
    { enabled: false }
  );

export const useCreateWorkOrderMutation = ({
  queryClient,
  onSuccess = () => {},
  onError = () => {},
}: {
  queryClient: QueryClient;
  onSuccess?: () => any;
  onError?: () => any;
}) => {
  const { notify } = useNotification();
  const { mutateAsync: createWorkOrder, isLoading: isCreating } = useMutation(workOrderApi.createWorkOrder, {
    onSuccess: () => {
      notify({ variant: 'success', message: 'workOrders:createWorkOrderSuccess' });
      queryClient.invalidateQueries('workOrders');
      onSuccess();
    },
    onError: () => {
      notify({ variant: 'error', message: 'workOrders:createWorkOrderFailed' });
      onError();
    },
  });

  return { createWorkOrder, isCreating };
};

export const useBulkCreateWorkOrderMutation = ({
  queryClient,
  onSettled = (data: any) => {},
}: {
  queryClient: QueryClient;
  onSettled?: (data: any) => any;
}) => {
  const { mutateAsync: createWorkOrders, isLoading: isCreating } = useMutation(workOrderApi.createWorkOrders, {
    onSettled: (data) => {
      queryClient.invalidateQueries('workOrders');
      onSettled(data);
    },
  });

  return { createWorkOrders, isCreating };
};

export const useUpdateWorkOrderMutation = ({
  queryClient,
  onSuccess = () => {},
  onError = () => {},
}: {
  queryClient: QueryClient;
  onSuccess?: () => any;
  onError?: () => any;
}) => {
  const { notify } = useNotification();
  const { mutateAsync: updateWorkOrder, isLoading: isUpdating } = useMutation(workOrderApi.updateWorkOrder, {
    onSuccess: () => {
      notify({ variant: 'success', message: 'workOrders:updateWorkOrderSuccess' });
      queryClient.invalidateQueries('workOrders');
      onSuccess();
    },
    onError: () => {
      notify({ variant: 'error', message: 'workOrders:updateWorkOrderFailed' });
      onError();
    },
  });

  return { updateWorkOrder, isUpdating };
};

export const useCompleteWorkOrdersMutation = ({
  queryClient,
  onSuccess = () => {},
  onError = () => {},
}: {
  queryClient: QueryClient;
  onSuccess?: () => any;
  onError?: () => any;
}) => {
  const { notify } = useNotification();
  const { mutateAsync: completeWorkOrders, isLoading: isUpdating } = useMutation(workOrderApi.completeWorkOrders, {
    onSuccess: () => {
      notify({ variant: 'success', message: 'workOrders:completeWorkOrdersSuccess' });
      queryClient.invalidateQueries('workOrders');
      queryClient.invalidateQueries('products');
      onSuccess();
    },
    onError: () => {
      notify({ variant: 'error', message: 'workOrders:completeWorkOrdersFailed' });
      onError();
    },
  });

  return { completeWorkOrders, isUpdating };
};

export const useDeleteWorkOrdersMutation = ({
  queryClient,
  onSuccess = () => {},
  onError = () => {},
}: {
  queryClient: QueryClient;
  onSuccess?: () => any;
  onError?: () => any;
}) => {
  const { notify } = useNotification();
  const { mutateAsync: deleteWorkOrders, isLoading: isDeleting } = useMutation(workOrderApi.deleteWorkOrders, {
    onSuccess: () => {
      notify({ variant: 'success', message: 'workOrders:deleteWorkOrderSuccess' });
      queryClient.invalidateQueries('workOrders');
      onSuccess();
    },
    onError: () => {
      notify({ variant: 'error', message: 'workOrders:deleteWorkOrderFailed' });
      onError();
    },
  });

  return { deleteWorkOrders, isDeleting };
};
