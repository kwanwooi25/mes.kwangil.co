import { AccountDto, CreateAccountDto, GetAccountsQuery, UpdateAccountDto } from './interface';
import { EntityState, PayloadAction, createEntityAdapter, createSlice } from '@reduxjs/toolkit';

import { DEFAULT_LIST_LIMIT } from 'const';
import { GetListResponse } from 'types/api';
import { RootState } from 'app/store';

export interface AccountState extends EntityState<AccountDto> {
  query: GetAccountsQuery;
  totalCount: number;
  currentPage: number;
  totalPages: number;
  hasMore: boolean;

  isSelectMode: boolean;
  selectedIds: number[];
}

const accountsAdapter = createEntityAdapter<AccountDto>();

const initialState: AccountState = {
  ...accountsAdapter.getInitialState(),

  query: {
    offset: 0,
    limit: DEFAULT_LIST_LIMIT,
    searchText: '',
  },
  totalCount: 0,
  currentPage: 1,
  totalPages: 1,
  hasMore: true,

  isSelectMode: false,
  selectedIds: [],
};

const accountSlice = createSlice({
  name: 'accounts',
  initialState,
  reducers: {
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

    createAccount: (state, action: PayloadAction<CreateAccountDto>) => {},
    updateAccount: (state, action: PayloadAction<UpdateAccountDto>) => {},
    deleteAccounts: (state, action: PayloadAction<number[]>) => {},
    updateAccountSuccess: (state, { payload: { id, ...changes } }: PayloadAction<AccountDto>) => {
      accountsAdapter.updateOne(state, { id, changes });
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
