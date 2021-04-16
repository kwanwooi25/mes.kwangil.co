import { AccountDto, GetAccountsQuery } from './interface';
import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { DEFAULT_LIST_LIMIT } from 'const';
import { GetListResponse } from 'types/api';
import { RootState } from 'store';
import { accountApi } from './accountApi';
import { notificationActions } from 'features/notification/notificationSlice';

export interface AccountState {
  query: GetAccountsQuery;
  isLoading: boolean;
  totalCount: number;
  currentPage: number;
  totalPages: number;
  hasMore: boolean;
  ids: number[];
  entities: { [id: number]: AccountDto };

  isSelectMode: boolean;
  selectedIds: number[];
}

const initialState: AccountState = {
  query: {
    offset: 0,
    limit: DEFAULT_LIST_LIMIT,
    searchText: '',
  },
  isLoading: false,
  totalCount: 0,
  currentPage: 1,
  totalPages: 1,
  hasMore: true,
  ids: [],
  entities: {},

  isSelectMode: false,
  selectedIds: [],
};

export const getAccounts: any = createAsyncThunk<GetListResponse<AccountDto>, GetAccountsQuery>(
  'accounts/getAccounts',
  async (query: GetAccountsQuery) => {
    try {
      const data = await accountApi.getAccounts(query);
      return data;
    } catch (error) {
      notificationActions.notify({ variant: 'error', message: 'accounts:getAccountsFailed' });
    }
  }
);

const accountSlice = createSlice({
  name: 'accounts',
  initialState,
  reducers: {
    setQuery: (state, action: PayloadAction<GetAccountsQuery | undefined>) => {
      state.query = { ...state.query, ...action.payload };
    },
    resetAccounts: (state) => {
      state.query = initialState.query;
      state.ids = initialState.ids;
      state.entities = initialState.entities;
      state.isSelectMode = initialState.isSelectMode;
      state.selectedIds = initialState.selectedIds;
    },
  },
  extraReducers: {
    [getAccounts.pending]: (state) => {
      state.isLoading = true;
    },
    [getAccounts.fulfilled]: (state, action: PayloadAction<GetListResponse<AccountDto>>) => {
      const { rows, hasMore, count } = action.payload;
      const { limit = DEFAULT_LIST_LIMIT, offset = 0 } = state.query;
      state.isLoading = false;
      state.totalCount = count;
      state.currentPage = Math.floor((offset + limit) / limit);
      state.totalPages = Math.ceil(count / limit);
      state.hasMore = hasMore;
      state.ids = [...state.ids, ...rows.map(({ id }) => id)];
      state.entities = rows.reduce((entities, account) => {
        entities[account.id] = account;
        return entities;
      }, state.entities);
    },
    [getAccounts.rejected]: (state) => {
      state.isLoading = false;
    },
  },
});

export const accountSelector = (state: RootState) => state.account;

export const accountActions = { ...accountSlice.actions, getAccounts };

export default accountSlice.reducer;
