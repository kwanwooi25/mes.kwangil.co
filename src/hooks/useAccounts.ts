import { DEFAULT_LIST_LIMIT, ExcelVariant } from 'const';
import { accountApi } from 'features/account/accountApi';
import { AccountDto, AccountFilter } from 'features/account/interface';
import { QueryClient, useInfiniteQuery, useMutation, useQuery } from 'react-query';
import { GetListResponse } from 'types/api';
import { downloadWorkbook } from 'utils/excel';

import useNotification from './useNotification';

export const useInfiniteAccounts = (filter: AccountFilter, limit: number = DEFAULT_LIST_LIMIT) => {
  return useInfiniteQuery(
    ['accounts', filter.accountName],
    async ({ queryKey, pageParam: offset = 0 }): Promise<GetListResponse<AccountDto>> => {
      const [, accountName] = queryKey;
      return await accountApi.getAccounts({ offset, limit, accountName });
    },
    {
      getNextPageParam: (lastPage, pages) => lastPage.hasMore && pages.length * limit,
    }
  );
};

export const useDownloadAccounts = (filter: AccountFilter) => {
  const { isFetching: isDownloading, data: dataForDownload } = useQuery(
    ['download-accounts', filter.accountName],
    async ({ queryKey }) => {
      const [, accountName] = queryKey;
      const { rows } = await accountApi.getAllAccounts(accountName);
      return rows;
    }
  );

  const download = (fileName: string) => {
    downloadWorkbook[ExcelVariant.ACCOUNT](dataForDownload, fileName);
  };

  return { isDownloading, download };
};

export const useAccount = (id: number) =>
  useQuery(
    ['account', id],
    async ({ queryKey }) => {
      const [, accountId] = queryKey;
      return await accountApi.getAccount(accountId as number);
    },
    { enabled: false }
  );

export const useCreateAccountMutation = ({
  queryClient,
  onSuccess = () => {},
  onError = () => {},
}: {
  queryClient: QueryClient;
  onSuccess?: () => void;
  onError?: () => void;
}) => {
  const { notify } = useNotification();
  const { mutateAsync: createAccount, isLoading: isCreating } = useMutation(accountApi.createAccount, {
    onSuccess: () => {
      notify({ variant: 'success', message: 'accounts:createAccountSuccess' });
      queryClient.invalidateQueries('accounts');
      onSuccess();
    },
    onError: () => {
      notify({ variant: 'error', message: 'accounts:createAccountFailed' });
      onError();
    },
  });

  return { createAccount, isCreating };
};

export const useBulkCreateAccountMutation = ({
  queryClient,
  onSuccess = () => {},
  onError = () => {},
}: {
  queryClient: QueryClient;
  onSuccess?: () => void;
  onError?: () => void;
}) => {
  const { notify } = useNotification();
  const { mutateAsync: createAccounts, isLoading: isCreating } = useMutation(accountApi.createAccounts, {
    onSuccess: () => {
      notify({ variant: 'success', message: 'accounts:bulkCreateAccountSuccess' });
      queryClient.invalidateQueries('accounts');
      onSuccess();
    },
    onError: () => {
      notify({ variant: 'error', message: 'accounts:bulkCreateAccountFailed' });
      onError();
    },
  });

  return { createAccounts, isCreating };
};

export const useUpdateAccountMutation = ({
  queryClient,
  onSuccess = () => {},
  onError = () => {},
}: {
  queryClient: QueryClient;
  onSuccess?: () => void;
  onError?: () => void;
}) => {
  const { notify } = useNotification();
  const { mutateAsync: updateAccount, isLoading: isUpdating } = useMutation(accountApi.updateAccount, {
    onSuccess: () => {
      notify({ variant: 'success', message: 'accounts:updateAccountSuccess' });
      queryClient.invalidateQueries('accounts');
      onSuccess();
    },
    onError: () => {
      notify({ variant: 'error', message: 'accounts:updateAccountFailed' });
      onError();
    },
  });

  return { updateAccount, isUpdating };
};

export const useDeleteAccountsMutation = ({
  queryClient,
  onSuccess = () => {},
  onError = () => {},
}: {
  queryClient: QueryClient;
  onSuccess?: () => void;
  onError?: () => void;
}) => {
  const { notify } = useNotification();
  const { mutateAsync: deleteAccounts, isLoading: isDeleting } = useMutation(accountApi.deleteAccounts, {
    onSuccess: () => {
      notify({ variant: 'success', message: 'accounts:deleteAccountSuccess' });
      queryClient.invalidateQueries('accounts');
      onSuccess();
    },
    onError: () => {
      notify({ variant: 'error', message: 'accounts:deleteAccountFailed' });
      onError();
    },
  });

  return { deleteAccounts, isDeleting };
};
