import { LoginDto, UserDto } from './interface';
import React, { ReactNode, createContext, useCallback, useContext, useEffect, useState } from 'react';
import { getAuthToken, setAuthHeaders } from 'store/apiClient';

import { authApi } from './authApi';
import { notificationActions } from 'features/notification/notificationSlice';
import { useAppDispatch } from 'store';

interface AuthContext {
  isRefreshing: boolean;
  isLoading: boolean;
  isLoggedIn: boolean;
  currentUser: UserDto | null;
  login: (loginData: LoginDto) => void;
  logout: () => void;
}

const authContext = createContext<AuthContext>({
  isRefreshing: false,
  isLoading: false,
  isLoggedIn: false,
  currentUser: null,
  login: (loginData: LoginDto) => {},
  logout: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const auth = useAuthProvider();
  return <authContext.Provider value={auth}>{children}</authContext.Provider>;
};

export const useAuth = () => useContext(authContext);

export const useAuthProvider = (): AuthContext => {
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<UserDto | null>(null);
  const dispatch = useAppDispatch();

  const handleLoginSuccess = useCallback(({ user, token }: { user: UserDto; token: string }) => {
    setAuthHeaders(token);
    setIsLoggedIn(true);
    setCurrentUser(user);
  }, []);

  const handleLoginFail = useCallback(
    (message?: string) => {
      setAuthHeaders();
      setIsLoggedIn(false);
      setCurrentUser(null);
      message && dispatch(notificationActions.notify({ variant: 'error', message }));
    },
    [dispatch]
  );

  const login = async (loginData: LoginDto) => {
    try {
      setIsLoading(true);
      const { user, token } = await authApi.login(loginData);
      handleLoginSuccess({ user, token });
    } catch (error) {
      handleLoginFail('auth:loginFailed');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    handleLoginFail();
  };

  useEffect(() => {
    (async () => {
      try {
        setIsRefreshing(true);
        const token = getAuthToken();
        setAuthHeaders(token);
        const user = await authApi.whoAmI();
        if (!user) {
          return handleLoginFail();
        }
        handleLoginSuccess({ user, token });
      } catch (error) {
        handleLoginFail();
      } finally {
        setIsRefreshing(false);
      }
    })();
  }, []);

  return {
    isRefreshing,
    isLoading,
    isLoggedIn,
    currentUser,
    login,
    logout,
  };
};
