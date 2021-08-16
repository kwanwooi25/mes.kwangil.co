import { DEFAULT_LIST_LIMIT } from 'const';
import { UserDto } from 'features/auth/interface';
import useNotification from 'features/notification/useNotification';
import { QueryClient, useInfiniteQuery, useMutation } from 'react-query';
import { GetListResponse } from 'types/api';

import { userApi } from './userApi';

export const useInfiniteUsers = (limit: number = DEFAULT_LIST_LIMIT) => {
  const userInfiniteQuery = useInfiniteQuery(
    ['users'],
    async ({ pageParam: offset = 0 }): Promise<GetListResponse<UserDto>> => {
      return await userApi.getUsers({ offset, limit });
    },
    {
      getNextPageParam: (lastPage, pages) => lastPage.hasMore && pages.length * limit,
    }
  );

  const { isFetching, fetchNextPage, hasNextPage } = userInfiniteQuery;

  const loadMore = () => hasNextPage && !isFetching && fetchNextPage();

  return { loadMore, ...userInfiniteQuery };
};

export const useUpdateUserMutation = ({
  queryClient,
  messageOnSuccess = 'users:updateUserSuccess',
  messageOnFail = 'users:updateUserFailed',
}: {
  queryClient: QueryClient;
  messageOnSuccess?: string;
  messageOnFail?: string;
}) => {
  const { notify } = useNotification();
  const { mutateAsync: updateUser, isLoading: isUpdating } = useMutation(userApi.updateUser, {
    onSuccess: () => {
      notify({ variant: 'success', message: messageOnSuccess });
      queryClient.invalidateQueries('users');
    },
    onError: () => {
      notify({ variant: 'error', message: messageOnFail });
    },
  });

  return { updateUser, isUpdating };
};
