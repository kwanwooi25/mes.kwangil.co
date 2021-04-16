import { AccountDto, CreateAccountDto, GetAccountsQuery } from './interface';
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

  isSaving: boolean;
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

  isSaving: false,
};

export const getAccounts: any = createAsyncThunk<GetListResponse<AccountDto>, GetAccountsQuery>(
  'accounts/getAccounts',
  async (query: GetAccountsQuery, thunkApi) => {
    try {
      thunkApi.dispatch(accountSlice.actions.setQuery(query));
      const data = await accountApi.getAccounts(query);
      return data;
    } catch (error) {
      thunkApi.dispatch(notificationActions.notify({ variant: 'error', message: 'accounts:getAccountsFailed' }));
    }
  }
);

export const createAccount: any = createAsyncThunk<
  AccountDto,
  { accountToCreate: CreateAccountDto; onSuccess: () => void }
>('accounts/createAccount', async ({ accountToCreate, onSuccess }, thunkApi) => {
  try {
    const createdAccount = await accountApi.createAccount(accountToCreate);
    onSuccess();
    thunkApi.dispatch(notificationActions.notify({ variant: 'success', message: 'accounts:createAccountSuccess' }));
    const { query } = (thunkApi.getState() as RootState).account;
    thunkApi.dispatch(accountActions.resetAccounts());
    thunkApi.dispatch(getAccounts({ ...query, offset: 0 }));
    return createdAccount;
  } catch (error) {
    thunkApi.dispatch(notificationActions.notify({ variant: 'error', message: 'accounts:createAccountFailed' }));
  }
});

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
    },
    toggleSelection: (state, action: PayloadAction<number>) => {
      if (state.selectedIds.includes(action.payload)) {
        state.selectedIds = state.selectedIds.filter((id) => id !== action.payload);
      } else {
        state.selectedIds.push(action.payload);
      }
      state.isSelectMode = !!state.selectedIds.length;
    },
    resetSelection: (state) => {
      state.isSelectMode = initialState.isSelectMode;
      state.selectedIds = initialState.selectedIds;
    },
    selectAll: (state, action: PayloadAction<number[]>) => {
      action.payload.forEach((id) => {
        if (!state.selectedIds.includes(id)) {
          state.selectedIds.push(id);
        }
      });
    },
    unselectAll: (state, action: PayloadAction<number[]>) => {
      state.selectedIds = state.selectedIds.filter((id) => !action.payload.includes(id));
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
      if (offset === 0) {
        state.ids = [];
        state.entities = {};
      }
      state.ids = [...state.ids, ...rows.map(({ id }) => id)];
      state.entities = rows.reduce((entities, account) => {
        entities[account.id] = account;
        return entities;
      }, state.entities);
    },
    [getAccounts.rejected]: (state) => {
      state.isLoading = false;
    },
    [createAccount.pending]: (state) => {
      state.isSaving = true;
    },
    [createAccount.fulfilled]: (state) => {
      state.isSaving = false;
    },
    [createAccount.rejected]: (state) => {
      state.isSaving = false;
    },
  },
});

export const accountSelector = (state: RootState) => state.account;

export const accountActions = { ...accountSlice.actions, getAccounts, createAccount };

export default accountSlice.reducer;
