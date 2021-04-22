import { accountActions, accountSelector } from './accountSlice';

import { AccountDto } from './interface';
import { useAppSelector } from 'app/store';

export const useAccounts = () => {
  const accountState = useAppSelector(accountSelector);
  const { ids, entities, selectedIds } = accountState;
  const accounts = ids.map((id) => entities[id] as AccountDto);
  const isSelectMode = !!selectedIds.length;

  return {
    ...accountState,
    accounts,
    isSelectMode,
    ...accountActions,
  };
};
