import { LoginDto, UserDto } from './interface';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import { RootState } from 'app/store';
import { setAuthHeaders } from 'app/apiClient';

interface AuthState {
  currentUser?: UserDto | null;
}

const initialState: AuthState = {
  currentUser: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<LoginDto>) => {},
    loginSuccess: (state, { payload: { user, token } }: PayloadAction<{ user: UserDto; token: string }>) => {
      setAuthHeaders(token);
      state.currentUser = user;
    },
    loginFailed: (state) => {
      setAuthHeaders();
      state.currentUser = null;
    },
    logout: (state) => {},
  },
});

export const authSelector = (state: RootState) => state.auth;

export const authActions = { ...authSlice.actions };

export default authSlice.reducer;
