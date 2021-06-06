import { RootState } from 'app/store';
import { DEFAULT_LIST_LIMIT, DeliveryMethod } from 'const';
import { createGenericSlice } from 'lib/reduxHelper';
import { formatDate } from 'utils/date';

import { createEntityAdapter, createSelector, EntityState } from '@reduxjs/toolkit';

import { DeliveryDto, GetDeliveriesQuery } from './interface';

export interface DeliveryState extends EntityState<DeliveryDto> {
  query: GetDeliveriesQuery;
  hasMore: boolean;
  totalCount: number;

  pagination: {
    ids: number[];
    currentPage: number;
    totalPages: number;
  };

  selectedIds: number[];
}

const deliveryAdapter = createEntityAdapter<DeliveryDto>();

export const initialState: DeliveryState = {
  ...deliveryAdapter.getInitialState(),

  query: {
    offset: 0,
    limit: DEFAULT_LIST_LIMIT,
    date: formatDate(new Date()),
    method: DeliveryMethod.DIRECT,
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
  name: 'delivery',
  initialState,
  entityAdapter: deliveryAdapter,
  reducers: {},
});

const deliverySelector = ({ delivery }: RootState) => delivery;

const selectors = {
  deliverySelector,
  query: createSelector(deliverySelector, ({ query }) => query),
  ids: createSelector(deliverySelector, ({ ids }) => ids as number[]),
  deliveries: createSelector(deliverySelector, ({ ids, entities }) => ids.map((id) => entities[id] as DeliveryDto)),
  paginatedDeliveries: createSelector(deliverySelector, ({ pagination, entities }) =>
    pagination.ids.map((id) => entities[id] as DeliveryDto)
  ),
  hasMore: createSelector(deliverySelector, ({ hasMore }) => hasMore),
  totalCount: createSelector(deliverySelector, ({ totalCount }) => totalCount),
  pagination: createSelector(deliverySelector, ({ pagination }) => pagination),
  isSelectMode: createSelector(deliverySelector, ({ selectedIds }) => !!selectedIds.length),
  selectedIds: createSelector(deliverySelector, ({ selectedIds }) => selectedIds),
  selectedDeliveries: createSelector(deliverySelector, ({ selectedIds, entities }) =>
    selectedIds.map((id) => entities[id] as DeliveryDto)
  ),
};

const { actions } = slice;

export { selectors as deliverySelector, actions as deliveryActions };

export default slice.reducer;
