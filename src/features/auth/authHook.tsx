import { authActions, authSelector } from './authSlice';

import { UserRole } from 'const';
import { useAppSelector } from 'app/store';

export const useAuth = () => {
  const authState = useAppSelector(authSelector);
  const { currentUser } = authState;
  const isLoggedIn = !!currentUser;
  const userRole = currentUser?.role || UserRole.USER;
  const isUser = userRole === UserRole.USER;
  const isManager = userRole === UserRole.MANAGER;
  const isAdmin = userRole === UserRole.ADMIN;

  return { ...authState, isLoggedIn, userRole, isUser, isManager, isAdmin, ...authActions };
};
