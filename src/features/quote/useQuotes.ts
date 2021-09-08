import { DEFAULT_LIST_LIMIT } from 'const';
import useNotification from 'features/notification/useNotification';
import { QueryClient, useInfiniteQuery, useMutation } from 'react-query';
import { GetListResponse } from 'types/api';

import { QuoteDto, QuoteFilter } from './interface';
import { quoteApi } from './quoteApi';

export const useInfiniteQuotes = (filter: QuoteFilter, limit: number = DEFAULT_LIST_LIMIT) => {
  const quoteInfiniteQuery = useInfiniteQuery(
    ['quotes', JSON.stringify(filter)],
    async ({ queryKey, pageParam: offset = 0 }): Promise<GetListResponse<QuoteDto>> => {
      const [, serializedFilter] = queryKey;
      const filter = JSON.parse(serializedFilter);
      return await quoteApi.getQuotes({ offset, limit, ...filter });
    },
    {
      getNextPageParam: (lastPage, pages) => lastPage.hasMore && pages.length * limit,
    }
  );

  const { isFetching, fetchNextPage, hasNextPage } = quoteInfiniteQuery;

  const loadMore = () => hasNextPage && !isFetching && fetchNextPage();

  return { loadMore, ...quoteInfiniteQuery };
};

export const useCreateQuoteMutation = ({
  queryClient,
  onSuccess = () => {},
  onError = () => {},
}: {
  queryClient: QueryClient;
  onSuccess?: () => any;
  onError?: () => any;
}) => {
  const { notify } = useNotification();
  const { mutateAsync: createQuote, isLoading: isCreating } = useMutation(quoteApi.createQuote, {
    onSuccess: () => {
      notify({ variant: 'success', message: 'quotes:createQuoteSuccess' });
      queryClient.invalidateQueries('quotes');
      onSuccess();
    },
    onError: () => {
      notify({ variant: 'error', message: 'quotes:createQuoteFailed' });
      onError();
    },
  });

  return { createQuote, isCreating };
};
