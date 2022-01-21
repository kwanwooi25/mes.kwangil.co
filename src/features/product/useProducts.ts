import { DEFAULT_LIST_LIMIT, ExcelVariant } from 'const';
import useNotification from 'features/notification/useNotification';
import { ProductDto, ProductFilter } from 'features/product/interface';
import { productApi } from 'features/product/productApi';
import { QueryClient, useInfiniteQuery, useMutation, useQuery } from 'react-query';
import { GetListResponse } from 'types/api';
import { downloadWorkbook } from 'utils/excel';

export const useInfiniteProducts = (filter: ProductFilter, limit: number = DEFAULT_LIST_LIMIT) => {
  const productInfiniteQuery = useInfiniteQuery(
    ['products', JSON.stringify(filter)],
    async ({ queryKey, pageParam: offset = 0 }): Promise<GetListResponse<ProductDto>> => {
      const [, serializedFilter] = queryKey;
      return productApi.getProducts({ offset, limit, ...JSON.parse(serializedFilter) });
    },
    {
      getNextPageParam: (lastPage, pages) => lastPage.hasMore && pages.length * limit,
    },
  );

  const { isFetching, fetchNextPage, hasNextPage } = productInfiniteQuery;

  const loadMore = () => hasNextPage && !isFetching && fetchNextPage();

  return { loadMore, ...productInfiniteQuery };
};

export const useProductOptions = (filter: ProductFilter) => {
  const {
    isFetching: isLoading,
    data: productOptions,
    isFetched,
  } = useQuery(['products', JSON.stringify(filter)], async ({ queryKey }) => {
    const [, serializedFilter] = queryKey;
    const { rows = [] } = await productApi.getAllProducts(JSON.parse(serializedFilter));
    return rows as ProductDto[];
  });

  return { isLoading, productOptions, isFetched };
};

export const useDownloadProducts = (filter: ProductFilter) => {
  const { isFetching: isDownloading, refetch } = useQuery(
    ['download-products', JSON.stringify(filter)],
    async ({ queryKey }) => {
      const [, serializedFilter] = queryKey;
      const { rows } = await productApi.getAllProducts(JSON.parse(serializedFilter));
      return rows;
    },
    { enabled: false },
  );

  const download = (fileName: string) => {
    refetch().then((res) => {
      downloadWorkbook[ExcelVariant.PRODUCT](res.data, fileName);
    });
  };

  return { isDownloading, download };
};

export const useProduct = (id: number) =>
  useQuery(
    ['product', id],
    async ({ queryKey }) => {
      const [, productId] = queryKey;
      return productApi.getProduct(productId as number);
    },
    { enabled: false },
  );

export const useCreateProductMutation = ({
  queryClient,
  onSuccess = () => {},
  onError = () => {},
}: {
  queryClient: QueryClient;
  onSuccess?: () => any;
  onError?: () => any;
}) => {
  const { notify } = useNotification();
  const { mutateAsync: createProduct, isLoading: isCreating } = useMutation(
    productApi.createProduct,
    {
      onSuccess: () => {
        notify({ variant: 'success', message: 'products:createProductSuccess' });
        queryClient.invalidateQueries('products');
        onSuccess();
      },
      onError: () => {
        notify({ variant: 'error', message: 'products:createProductFailed' });
        onError();
      },
    },
  );

  return { createProduct, isCreating };
};

export const useBulkCreateProductMutation = ({
  queryClient,
  onSettled = () => {},
}: {
  queryClient: QueryClient;
  onSettled?: (data: any) => any;
}) => {
  const { mutateAsync: createProducts, isLoading: isCreating } = useMutation(
    productApi.createProducts,
    {
      onSettled: (data) => {
        queryClient.invalidateQueries('products');
        onSettled(data);
      },
    },
  );

  return { createProducts, isCreating };
};

export const useUpdateProductMutation = ({
  queryClient,
  onSuccess = () => {},
  onError = () => {},
}: {
  queryClient: QueryClient;
  onSuccess?: () => any;
  onError?: () => any;
}) => {
  const { notify } = useNotification();
  const { mutateAsync: updateProduct, isLoading: isUpdating } = useMutation(
    productApi.updateProduct,
    {
      onSuccess: () => {
        notify({ variant: 'success', message: 'products:updateProductSuccess' });
        queryClient.invalidateQueries('products');
        queryClient.invalidateQueries('workOrders');
        onSuccess();
      },
      onError: () => {
        notify({ variant: 'error', message: 'products:updateProductFailed' });
        onError();
      },
    },
  );

  return { updateProduct, isUpdating };
};

export const useDeleteProductsMutation = ({
  queryClient,
  onSuccess = () => {},
  onError = () => {},
}: {
  queryClient: QueryClient;
  onSuccess?: () => any;
  onError?: () => any;
}) => {
  const { notify } = useNotification();
  const { mutateAsync: deleteProducts, isLoading: isDeleting } = useMutation(
    productApi.deleteProducts,
    {
      onSuccess: () => {
        notify({ variant: 'success', message: 'products:deleteProductSuccess' });
        queryClient.invalidateQueries('products');
        onSuccess();
      },
      onError: () => {
        notify({ variant: 'error', message: 'products:deleteProductFailed' });
        onError();
      },
    },
  );

  return { deleteProducts, isDeleting };
};
