import { accountActions, accountSelector } from './accountSlice';

import { useAppSelector } from 'store';

export const useAccounts = () => {
  const accountState = useAppSelector(accountSelector);
  const accounts = accountState.ids.map((id) => accountState.entities[id]);

  return {
    ...accountState,
    accounts,
    ...accountActions,
  };
};
