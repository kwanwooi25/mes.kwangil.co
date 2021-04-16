import { AccountDto, CreateAccountDto, GetAccountsQuery } from './interface';
import { EntityState, PayloadAction, createEntityAdapter, createSlice } from '@reduxjs/toolkit';

import { DEFAULT_LIST_LIMIT } from 'const';
import { GetListResponse } from 'types/api';
import { RootState } from 'app/store';

export interface AccountState extends EntityState<AccountDto> {
  query: GetAccountsQuery;
  isLoading: boolean;
  totalCount: number;
  currentPage: number;
  totalPages: number;
  hasMore: boolean;

  isSelectMode: boolean;
  selectedIds: number[];

  isSaving: boolean;
  shouldCloseAccountDialog: boolean;
}

const accountsAdapter = createEntityAdapter<AccountDto>();

const initialState: AccountState = {
  ...accountsAdapter.getInitialState(),

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

  isSelectMode: false,
  selectedIds: [],

  isSaving: false,
  shouldCloseAccountDialog: false,
};

const accountSlice = createSlice({
  name: 'accounts',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    getAccounts: (state, action: PayloadAction<GetAccountsQuery>) => {
      state.query = { ...state.query, ...action.payload };
    },
    setAccounts: (state, action: PayloadAction<GetListResponse<AccountDto>>) => {
      const { rows, hasMore, count } = action.payload;
      const { limit = DEFAULT_LIST_LIMIT, offset = 0 } = state.query;
      state.totalCount = count;
      state.currentPage = Math.floor((offset + limit) / limit);
      state.totalPages = Math.ceil(count / limit);
      state.hasMore = hasMore;
      accountsAdapter.upsertMany(state, rows);
    },
    resetAccounts: (state) => {
      const { limit = DEFAULT_LIST_LIMIT } = state.query;
      state.query = { ...initialState.query, limit };
      accountsAdapter.removeAll(state);
    },

    setSaving: (state, action: PayloadAction<boolean>) => {
      state.isSaving = action.payload;
    },
    createAccount: (state, action: PayloadAction<CreateAccountDto>) => {},
    setShouldCloseAccountDialog: (state, action: PayloadAction<boolean>) => {
      state.shouldCloseAccountDialog = action.payload;
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
});

export const accountSelector = (state: RootState) => state.account;

export const accountActions = { ...accountSlice.actions };

export default accountSlice.reducer;
