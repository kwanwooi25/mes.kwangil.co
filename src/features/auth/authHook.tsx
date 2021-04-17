import { authActions, authSelector } from './authSlice';

import { useAppSelector } from 'app/store';

export const useAuth = () => {
  const authState = useAppSelector(authSelector);

  return { ...authState, ...authActions };
};
