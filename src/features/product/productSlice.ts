import { RootState } from 'app/store';
import { DEFAULT_LIST_LIMIT, ProductLength, ProductThickness, ProductWidth } from 'const';
import { createGenericSlice } from 'lib/reduxHelper';

import { createEntityAdapter, createSelector, EntityState, PayloadAction } from '@reduxjs/toolkit';

import {
    CreateProductDto, CreateProductsDto, GetProductsQuery, ProductDto, UpdateProductDto
} from './interface';

export interface ProductState extends EntityState<ProductDto> {
  query: GetProductsQuery;
  hasMore: boolean;
  totalCount: number;

  pagination: {
    ids: number[];
    currentPage: number;
    totalPages: number;
  };

  selectedIds: number[];
}

const productsAdapter = createEntityAdapter<ProductDto>();

export const initialState: ProductState = {
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

  pagination: {
    ids: [],
    currentPage: 1,
    totalPages: 1,
  },

  selectedIds: [],
};

const slice = createGenericSlice({
  name: 'products',
  initialState,
  entityAdapter: productsAdapter,
  reducers: {
    createProduct: (state, action: PayloadAction<CreateProductDto>) => {},
    createProducts: (state, action: PayloadAction<CreateProductsDto[]>) => {},
    updateProduct: (state, action: PayloadAction<UpdateProductDto>) => {},
    deleteProducts: (state, action: PayloadAction<number[]>) => {},
  },
});

const productSelector = ({ product }: RootState) => product;

const selectors = {
  productSelector,
  query: createSelector(productSelector, ({ query }) => query),
  ids: createSelector(productSelector, ({ ids }) => ids as number[]),
  products: createSelector(productSelector, ({ ids, entities }) => ids.map((id) => entities[id] as ProductDto)),
  paginatedProducts: createSelector(productSelector, ({ pagination, entities }) =>
    pagination.ids.map((id) => entities[id] as ProductDto)
  ),
  hasMore: createSelector(productSelector, ({ hasMore }) => hasMore),
  totalCount: createSelector(productSelector, ({ totalCount }) => totalCount),
  pagination: createSelector(productSelector, ({ pagination }) => pagination),
  isSelectMode: createSelector(productSelector, ({ selectedIds }) => !!selectedIds.length),
  selectedIds: createSelector(productSelector, ({ selectedIds }) => selectedIds),
};

const { actions } = slice;

export { selectors as productSelectors, actions as productActions };

export default slice.reducer;
