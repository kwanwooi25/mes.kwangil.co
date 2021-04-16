import { accountActions, accountSelector } from './accountSlice';

import { AccountDto } from './interface';
import { useAppSelector } from 'app/store';

export const useAccounts = () => {
  const accountState = useAppSelector(accountSelector);
  const accounts = accountState.ids.map((id) => accountState.entities[id] as AccountDto);

  return {
    ...accountState,
    accounts,
    ...accountActions,
  };
};
