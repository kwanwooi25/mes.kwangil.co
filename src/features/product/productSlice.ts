import { CreateProductDto, GetProductsQuery, ProductDto, UpdateProductDto } from './interface';
import { EntityState, PayloadAction, createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import { ProductLength, ProductThickness, ProductWidth } from 'const';

import { DEFAULT_LIST_LIMIT } from 'const';
import { GetListResponse } from 'types/api';
import { RootState } from 'app/store';

export interface ProductState extends EntityState<ProductDto> {
  query: GetProductsQuery;
  hasMore: boolean;
  totalCount: number;

  currentPage: number;
  totalPages: number;

  selectedIds: number[];
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
  hasMore: true,
  totalCount: 0,

  currentPage: 1,
  totalPages: 1,

  selectedIds: [],
};

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
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

    createProduct: (state, action: PayloadAction<CreateProductDto>) => {},
    updateProduct: (state, action: PayloadAction<UpdateProductDto>) => {},
    updateProductSuccess: (state, { payload: { id, ...changes } }: PayloadAction<ProductDto>) => {
      productsAdapter.updateOne(state, { id, changes });
    },
    deleteProducts: (state, action: PayloadAction<number[]>) => {},

    toggleSelection: (state, { payload }: PayloadAction<number>) => {
      if (state.selectedIds.includes(payload)) {
        state.selectedIds = state.selectedIds.filter((id) => id !== payload);
      } else {
        state.selectedIds.push(payload);
      }
    },
    resetSelection: (state) => {
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
