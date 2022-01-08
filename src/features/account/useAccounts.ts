import { DEFAULT_LIST_LIMIT, ExcelVariant } from 'const';
import { accountApi } from 'features/account/accountApi';
import { AccountDto, AccountFilter, AccountOption } from 'features/account/interface';
import useNotification from 'features/notification/useNotification';
import { QueryClient, useInfiniteQuery, useMutation, useQuery } from 'react-query';
import { GetListResponse } from 'types/api';
import { downloadWorkbook } from 'utils/excel';

export const useInfiniteAccounts = (filter: AccountFilter, limit: number = DEFAULT_LIST_LIMIT) => {
  const accountInfiniteQuery = useInfiniteQuery(
    ['accounts', filter.accountName],
    async ({ queryKey, pageParam: offset = 0 }): Promise<GetListResponse<AccountDto>> => {
      const [, accountName] = queryKey;
      return accountApi.getAccounts({ offset, limit, accountName });
    },
    {
      getNextPageParam: (lastPage, pages) => lastPage.hasMore && pages.length * limit,
    },
  );

  const { isFetching, fetchNextPage, hasNextPage } = accountInfiniteQuery;

  const loadMore = () => hasNextPage && !isFetching && fetchNextPage();

  return { loadMore, ...accountInfiniteQuery };
};

export const useAccountOptions = () => {
  const {
    isFetching: isLoading,
    data: accountOptions,
    isFetched,
  } = useQuery(['account-options'], async (): Promise<AccountOption[]> => {
    const { rows }: { rows: AccountDto[] } = await accountApi.getAllAccounts();
    return rows.map(({ id, name }) => ({ id, name }));
  });

  return { isLoading, accountOptions, isFetched };
};

export const useDownloadAccounts = (filter: AccountFilter) => {
  const { isFetching: isDownloading, refetch } = useQuery(
    ['download-accounts', filter.accountName],
    async ({ queryKey }) => {
      const [, accountName] = queryKey;
      const { rows } = await accountApi.getAllAccounts(accountName);
      return rows;
    },
    { enabled: false },
  );

  const download = (fileName: string) => {
    refetch().then((res) => {
      downloadWorkbook[ExcelVariant.ACCOUNT](res.data, fileName);
    });
  };

  return { isDownloading, download };
};

export const useAccount = (id: number) =>
  useQuery(
    ['account', id],
    async ({ queryKey }) => {
      const [, accountId] = queryKey;
      return accountApi.getAccount(accountId as number);
    },
    { enabled: false },
  );

export const useCreateAccountMutation = ({
  queryClient,
  onSuccess = () => {},
  onError = () => {},
}: {
  queryClient: QueryClient;
  onSuccess?: () => any;
  onError?: () => any;
}) => {
  const { notify } = useNotification();
  const { mutateAsync: createAccount, isLoading: isCreating } = useMutation(
    accountApi.createAccount,
    {
      onSuccess: () => {
        notify({ variant: 'success', message: 'accounts:createAccountSuccess' });
        queryClient.invalidateQueries('accounts');
        onSuccess();
      },
      onError: () => {
        notify({ variant: 'error', message: 'accounts:createAccountFailed' });
        onError();
      },
    },
  );

  return { createAccount, isCreating };
};

export const useBulkCreateAccountMutation = ({
  queryClient,
  onSettled = () => {},
}: {
  queryClient: QueryClient;
  onSettled?: (data: any) => any;
}) => {
  const { mutateAsync: createAccounts, isLoading: isCreating } = useMutation(
    accountApi.createAccounts,
    {
      onSettled: (data) => {
        queryClient.invalidateQueries('accounts');
        onSettled(data);
      },
    },
  );

  return { createAccounts, isCreating };
};

export const useUpdateAccountMutation = ({
  queryClient,
  onSuccess = () => {},
  onError = () => {},
}: {
  queryClient: QueryClient;
  onSuccess?: () => any;
  onError?: () => any;
}) => {
  const { notify } = useNotification();
  const { mutateAsync: updateAccount, isLoading: isUpdating } = useMutation(
    accountApi.updateAccount,
    {
      onSuccess: () => {
        notify({ variant: 'success', message: 'accounts:updateAccountSuccess' });
        queryClient.invalidateQueries('accounts');
        onSuccess();
      },
      onError: () => {
        notify({ variant: 'error', message: 'accounts:updateAccountFailed' });
        onError();
      },
    },
  );

  return { updateAccount, isUpdating };
};

export const useDeleteAccountsMutation = ({
  queryClient,
  onSuccess = () => {},
  onError = () => {},
}: {
  queryClient: QueryClient;
  onSuccess?: () => any;
  onError?: () => any;
}) => {
  const { notify } = useNotification();
  const { mutateAsync: deleteAccounts, isLoading: isDeleting } = useMutation(
    accountApi.deleteAccounts,
    {
      onSuccess: () => {
        notify({ variant: 'success', message: 'accounts:deleteAccountSuccess' });
        queryClient.invalidateQueries('accounts');
        onSuccess();
      },
      onError: () => {
        notify({ variant: 'error', message: 'accounts:deleteAccountFailed' });
        onError();
      },
    },
  );

  return { deleteAccounts, isDeleting };
};
