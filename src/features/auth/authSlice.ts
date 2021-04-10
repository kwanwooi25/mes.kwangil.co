import { AppThunk, RootState } from 'store';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import { authApi } from './authApi';

export interface LoginDto {
  email: string;
  password: string;
}

export interface UserDto {
  id: number | string;
  email: string;
  name: string;
  mobile?: string;
  department?: string;
  position?: string;
  profileImageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

export interface AuthState {
  isLoading: boolean;
  isLoggedIn: boolean;
  currentUser: UserDto | null;
}

const initialState: AuthState = {
  isLoading: false,
  isLoggedIn: false,
  currentUser: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setIsLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    loginSuccess: (state, action: PayloadAction<{ user: UserDto; token: string }>) => {
      state.isLoggedIn = true;
      state.currentUser = action.payload.user;
    },
    loginFailed: (state) => {
      state.isLoggedIn = false;
      state.currentUser = null;
    },
  },
});

export const login = (loginData: LoginDto): AppThunk => async (dispatch) => {
  try {
    dispatch(authSlice.actions.setIsLoading(true));
    const { user, token } = await authApi.login(loginData);
    dispatch(authSlice.actions.loginSuccess({ user, token }));
  } catch (error) {
    dispatch(authSlice.actions.loginFailed());
  } finally {
    dispatch(authSlice.actions.setIsLoading(false));
  }
};

export const logout = (): AppThunk => async (dispatch) => {
  dispatch(authSlice.actions.loginFailed());
};

export const authSelector = (state: RootState) => state.auth;

export default authSlice.reducer;
