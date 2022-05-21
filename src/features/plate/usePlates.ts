import { DEFAULT_LIST_LIMIT, ExcelVariant } from 'const';
import useNotification from 'features/notification/useNotification';
import { QueryClient, useInfiniteQuery, useMutation, useQuery } from 'react-query';
import { GetListResponse } from 'types/api';
import { downloadWorkbook } from 'utils/excel';

import { PlateDto, PlateFilter } from './interface';
import { plateApi } from './plateApi';

export const useInfinitePlates = (filter: PlateFilter, limit: number = DEFAULT_LIST_LIMIT) => {
  const plateInfiniteQuery = useInfiniteQuery(
    ['plates', JSON.stringify(filter)],
    async ({ queryKey, pageParam: offset = 0 }): Promise<GetListResponse<PlateDto>> => {
      const [, serializedFilter] = queryKey;
      return plateApi.getPlates({ offset, limit, ...JSON.parse(serializedFilter) });
    },
    {
      getNextPageParam: (lastPage, pages) => lastPage.hasMore && pages.length * limit,
    },
  );

  const { isFetching, fetchNextPage, hasNextPage } = plateInfiniteQuery;

  const loadMore = () => hasNextPage && !isFetching && fetchNextPage();

  return { loadMore, ...plateInfiniteQuery };
};

export const useDownloadPlates = (filter: PlateFilter) => {
  const { isFetching: isDownloading, refetch } = useQuery(
    ['download-products', JSON.stringify(filter)],
    async ({ queryKey }) => {
      const [, serializedFilter] = queryKey;
      const { rows } = await plateApi.getAllPlates(JSON.parse(serializedFilter));
      return rows;
    },
    { enabled: false },
  );

  const download = (fileName: string) => {
    refetch().then((res) => {
      downloadWorkbook[ExcelVariant.PLATE](res.data, fileName);
    });
  };

  return { isDownloading, download };
};

export const useCreatePlateMutation = ({
  queryClient,
  onSuccess = () => {},
  onError = () => {},
}: {
  queryClient: QueryClient;
  onSuccess?: () => any;
  onError?: () => any;
}) => {
  const { notify } = useNotification();
  const { mutateAsync: createPlate, isLoading: isCreating } = useMutation(plateApi.createPlate, {
    onSuccess: () => {
      notify({ variant: 'success', message: 'plates:createPlateSuccess' });
      queryClient.invalidateQueries('plates');
      onSuccess();
    },
    onError: () => {
      notify({ variant: 'error', message: 'plates:createPlateFailed' });
      onError();
    },
  });

  return { createPlate, isCreating };
};

export const useUpdatePlateMutation = ({
  queryClient,
  onSuccess = () => {},
  onError = () => {},
}: {
  queryClient: QueryClient;
  onSuccess?: () => any;
  onError?: () => any;
}) => {
  const { notify } = useNotification();
  const { mutateAsync: updatePlate, isLoading: isUpdating } = useMutation(plateApi.updatePlate, {
    onSuccess: () => {
      notify({ variant: 'success', message: 'plates:updatePlateSuccess' });
      queryClient.invalidateQueries('plates');
      onSuccess();
    },
    onError: () => {
      notify({ variant: 'error', message: 'plates:updatePlateFailed' });
      onError();
    },
  });

  return { updatePlate, isUpdating };
};

export const useDeletePlatesMutation = ({
  queryClient,
  onSuccess = () => {},
  onError = () => {},
}: {
  queryClient: QueryClient;
  onSuccess?: () => any;
  onError?: () => any;
}) => {
  const { notify } = useNotification();
  const { mutateAsync: deletePlates, isLoading: isDeleting } = useMutation(plateApi.deletePlates, {
    onSuccess: () => {
      notify({ variant: 'success', message: 'plates:deletePlateSuccess' });
      queryClient.invalidateQueries('plates');
      onSuccess();
    },
    onError: () => {
      notify({ variant: 'error', message: 'plates:deletePlateFailed' });
      onError();
    },
  });

  return { deletePlates, isDeleting };
};
