import { EntityState, PayloadAction, createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import { GetProductsQuery, ProductDto } from './interface';
import { ProductLength, ProductThickness, ProductWidth } from 'const';

import { DEFAULT_LIST_LIMIT } from 'const';
import { GetListResponse } from 'types/api';
import { RootState } from 'app/store';

export interface ProductState extends EntityState<ProductDto> {
  query: GetProductsQuery;
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

const productsAdapter = createEntityAdapter<ProductDto>();

const initialState: ProductState = {
  ...productsAdapter.getInitialState(),

  query: {
    offset: 0,
    limit: DEFAULT_LIST_LIMIT,
    accountName: '',
    name: '',
    thickness: [ProductThickness.MIN, ProductThickness.MAX],
    length: [ProductLength.MIN, ProductLength.MAX],
    width: [ProductWidth.MIN, ProductWidth.MAX],
    extColor: '',
    printColor: '',
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

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setLoading: (state, { payload: isLoading }: PayloadAction<boolean>) => {
      state.isLoading = isLoading;
    },
    getProducts: (state, { payload: query }: PayloadAction<GetProductsQuery>) => {
      state.query = { ...state.query, ...query };
    },
    setProducts: (state, { payload: { rows, hasMore, count } }: PayloadAction<GetListResponse<ProductDto>>) => {
      const { limit = DEFAULT_LIST_LIMIT, offset = 0 } = state.query;
      state.totalCount = count;
      state.currentPage = Math.floor((offset + limit) / limit);
      state.totalPages = Math.ceil(count / limit);
      state.hasMore = hasMore;
      productsAdapter.upsertMany(state, rows);
    },
    resetProducts: (state) => {
      const { limit = DEFAULT_LIST_LIMIT } = state.query;
      state.query = { ...initialState.query, limit };
      productsAdapter.removeAll(state);
    },

    toggleSelection: (state, { payload }: PayloadAction<number>) => {
      if (state.selectedIds.includes(payload)) {
        state.selectedIds = state.selectedIds.filter((id) => id !== payload);
      } else {
        state.selectedIds.push(payload);
      }
      state.isSelectMode = !!state.selectedIds.length;
    },
    resetSelection: (state) => {
      state.isSelectMode = initialState.isSelectMode;
      state.selectedIds = initialState.selectedIds;
    },
    selectAll: (state, { payload: ids }: PayloadAction<number[]>) => {
      ids.forEach((id) => {
        if (!state.selectedIds.includes(id)) {
          state.selectedIds.push(id);
        }
      });
    },
    unselectAll: (state, { payload: ids }: PayloadAction<number[]>) => {
      state.selectedIds = state.selectedIds.filter((id) => !ids.includes(id));
    },
  },
});

export const productSelector = ({ product }: RootState) => product;

export const productActions = productSlice.actions;

export default productSlice.reducer;
