import { RootState } from 'app/store';
import { DEFAULT_LIST_LIMIT } from 'const';
import { createGenericSlice } from 'lib/reduxHelper';

import { createEntityAdapter, createSelector, EntityState, PayloadAction } from '@reduxjs/toolkit';

import { AccountDto, CreateAccountDto, GetAccountsQuery, UpdateAccountDto } from './interface';

export interface AccountState extends EntityState<AccountDto> {
  query: GetAccountsQuery;
  totalCount: number;
  hasMore: boolean;

  pagination: {
    ids: number[];
    currentPage: number;
    totalPages: number;
  };

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
  hasMore: true,
  totalCount: 0,

  pagination: {
    ids: [],
    currentPage: 1,
    totalPages: 1,
  },

  selectedIds: [],
};

const slice = createGenericSlice({
  name: 'accounts',
  initialState,
  entityAdapter: accountsAdapter,
  reducers: {
    createAccount: (state, action: PayloadAction<CreateAccountDto>) => {},
    createAccounts: (state, action: PayloadAction<CreateAccountDto[]>) => {},
    updateAccount: (state, action: PayloadAction<UpdateAccountDto>) => {},
    deleteAccounts: (state, action: PayloadAction<number[]>) => {},
  },
});

const accountSelector = ({ account }: RootState) => account;

const selectors = {
  accountSelector,
  query: createSelector(accountSelector, ({ query }) => query),
  ids: createSelector(accountSelector, ({ ids }) => ids as number[]),
  accounts: createSelector(accountSelector, ({ ids, entities }) => ids.map((id) => entities[id] as AccountDto)),
  paginatedAccounts: createSelector(accountSelector, ({ pagination, entities }) =>
    pagination!.ids.map((id) => entities[id] as AccountDto)
  ),
  hasMore: createSelector(accountSelector, ({ hasMore }) => hasMore),
  totalCount: createSelector(accountSelector, ({ totalCount }) => totalCount),
  pagination: createSelector(accountSelector, ({ pagination }) => pagination),
  isSelectMode: createSelector(accountSelector, ({ selectedIds }) => !!selectedIds.length),
  selectedIds: createSelector(accountSelector, ({ selectedIds }) => selectedIds),
};

const { actions } = slice;

export { selectors as accountSelectors, actions as accountActions };

export default slice.reducer;
