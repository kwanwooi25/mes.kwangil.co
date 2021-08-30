import { getAuthToken, setAuthHeaders } from 'app/apiClient';
import { useAppDispatch, useAppSelector } from 'app/store';
import { push } from 'connected-react-router';
import { Path, Permissions } from 'const';
import useNotification from 'features/notification/useNotification';
import { useMutation } from 'react-query';

import { authApi } from './authApi';
import { authActions, authSelector } from './authSlice';
import { LoginResult, UserDto } from './interface';

export const useAuth = () => {
  const authState = useAppSelector(authSelector);
  const { currentUser } = authState;
  const isLoggedIn = !!currentUser;
  const permissions = currentUser?.userRole.permissions || [];
  const canViewAccounts = permissions.includes(Permissions.ACCOUNT_READ);
  const canCreateAccounts = permissions.includes(Permissions.ACCOUNT_CREATE);
  const canUpdateAccounts = permissions.includes(Permissions.ACCOUNT_UPDATE);
  const canDeleteAccounts = permissions.includes(Permissions.ACCOUNT_DELETE);
  const canViewQuotes = permissions.includes(Permissions.QUOTE_READ);
  const canCreateQuotes = permissions.includes(Permissions.QUOTE_CREATE);
  const canUpdateQuotes = permissions.includes(Permissions.QUOTE_UPDATE);
  const canDeleteQuotes = permissions.includes(Permissions.QUOTE_DELETE);
  const canViewProducts = permissions.includes(Permissions.PRODUCT_READ);
  const canCreateProducts = permissions.includes(Permissions.PRODUCT_CREATE);
  const canUpdateProducts = permissions.includes(Permissions.PRODUCT_UPDATE);
  const canDeleteProducts = permissions.includes(Permissions.PRODUCT_DELETE);
  const canViewPlates = permissions.includes(Permissions.PLATE_READ);
  const canCreatePlates = permissions.includes(Permissions.PLATE_CREATE);
  const canUpdatePlates = permissions.includes(Permissions.PLATE_UPDATE);
  const canDeletePlates = permissions.includes(Permissions.PLATE_DELETE);
  const canViewWorkOrders = permissions.includes(Permissions.WORK_ORDER_READ);
  const canCreateWorkOrders = permissions.includes(Permissions.WORK_ORDER_CREATE);
  const canUpdateWorkOrders = permissions.includes(Permissions.WORK_ORDER_UPDATE);
  const canDeleteWorkOrders = permissions.includes(Permissions.WORK_ORDER_DELETE);
  const canViewUsers = permissions.includes(Permissions.USER_READ);
  const canCreateUsers = permissions.includes(Permissions.USER_CREATE);
  const canUpdateUsers = permissions.includes(Permissions.USER_UPDATE);
  const canDeleteUsers = permissions.includes(Permissions.USER_DELETE);

  const navPaths = Object.values(Path).filter((path) => {
    switch (path) {
      case Path.DASHBOARD:
      case Path.SETTINGS:
        return true;
      case Path.ACCOUNTS:
        return permissions.includes(Permissions.ACCOUNT_READ);
      case Path.QUOTES:
        return permissions.includes(Permissions.QUOTE_READ);
      case Path.PRODUCTS:
        return permissions.includes(Permissions.PRODUCT_READ);
      case Path.PLATES:
        return permissions.includes(Permissions.PLATE_READ);
      case Path.WORK_ORDERS:
        return permissions.includes(Permissions.WORK_ORDER_READ);
      case Path.USERS:
        return permissions.includes(Permissions.USER_READ);
      default:
        return false;
    }
  });

  return {
    ...authState,
    isLoggedIn,
    navPaths,
    permissions,
    canViewAccounts,
    canCreateAccounts,
    canUpdateAccounts,
    canDeleteAccounts,
    canViewQuotes,
    canCreateQuotes,
    canUpdateQuotes,
    canDeleteQuotes,
    canViewProducts,
    canCreateProducts,
    canUpdateProducts,
    canDeleteProducts,
    canViewPlates,
    canCreatePlates,
    canUpdatePlates,
    canDeletePlates,
    canViewWorkOrders,
    canCreateWorkOrders,
    canUpdateWorkOrders,
    canDeleteWorkOrders,
    canViewUsers,
    canCreateUsers,
    canUpdateUsers,
    canDeleteUsers,
    ...authActions,
  };
};

export const useLoginMutation = () => {
  const dispatch = useAppDispatch();
  const { notify } = useNotification();
  const { mutateAsync: login, isLoading: isLoggingIn } = useMutation(authApi.login, {
    onSuccess: (data: LoginResult) => {
      notify({ variant: 'success', message: 'auth:loginSuccess' });
      dispatch(authActions.loginSuccess(data));
    },
    onError: () => {
      notify({ variant: 'error', message: 'auth:loginFailed' });
      dispatch(authActions.loginFailed());
    },
  });

  return { login, isLoggingIn };
};

export const useRefreshLoginMutation = () => {
  const dispatch = useAppDispatch();
  const token = getAuthToken();
  setAuthHeaders(token);

  const { mutateAsync: refreshLogin, isLoading: isRefreshing } = useMutation(authApi.whoAmI, {
    onSuccess: (user: UserDto) => {
      dispatch(authActions.loginSuccess({ user, token }));
    },
    onError: () => {
      dispatch(authActions.loginFailed());
    },
  });

  return { refreshLogin, isRefreshing, isTokenExists: !!token };
};

export const useRegisterUserMutation = () => {
  const dispatch = useAppDispatch();
  const { notify } = useNotification();
  const { mutateAsync: registerUser, isLoading } = useMutation(authApi.signUp, {
    onSuccess: () => {
      notify({ variant: 'success', message: 'auth:signUpSuccess' });
      dispatch(push(Path.HOME));
    },
    onError: () => {
      notify({ variant: 'error', message: 'auth:signUpFailed' });
    },
  });

  return { registerUser, isLoading };
};
