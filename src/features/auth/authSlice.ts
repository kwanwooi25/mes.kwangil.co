import { setAuthHeaders } from 'app/apiClient';
import { RootState } from 'app/store';

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { UserDto } from './interface';

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
    loginSuccess: (state, { payload: { user, token } }: PayloadAction<{ user: UserDto; token: string }>) => {
      setAuthHeaders(token);
      state.currentUser = user;
    },
    loginFailed: (state) => {
      setAuthHeaders();
      state.currentUser = null;
    },
  },
});

export const authSelector = (state: RootState) => state.auth;

export const authActions = { ...authSlice.actions };

export default authSlice.reducer;
