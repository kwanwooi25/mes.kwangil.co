import { accountActions, accountSelector } from './accountSlice';
import { useAppDispatch, useAppSelector } from 'store';

import { GetAccountsQuery } from './interface';
import { useCallback } from 'react';

export const useAccounts = () => {
  const accountState = useAppSelector(accountSelector);

  const accounts = accountState.ids.map((id) => accountState.entities[id]);

  const dispatch = useAppDispatch();
  const getAccounts = useCallback(
    (query?: GetAccountsQuery) => {
      dispatch(accountActions.setQuery(query));
      dispatch(accountActions.getAccounts(query));
    },
    [dispatch]
  );
  const resetAccounts = useCallback(() => {
    dispatch(accountActions.resetAccounts());
  }, [dispatch]);

  return { ...accountState, accounts, getAccounts, resetAccounts };
};
