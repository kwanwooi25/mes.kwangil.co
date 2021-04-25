import {
  CreateWorkOrderDto,
  CreateWorkOrdersDto,
  GetWorkOrdersQuery,
  UpdateWorkOrderDto,
  WorkOrderDto,
} from './interface';
import { DATE_FORMAT, DEFAULT_LIST_LIMIT } from 'const';
import { EntityState, PayloadAction, createEntityAdapter, createSelector } from '@reduxjs/toolkit';
import { format, subDays } from 'date-fns';

import { RootState } from 'app/store';
import { createGenericSlice } from 'lib/reduxHelper';

export interface WorkOrderState extends EntityState<WorkOrderDto> {
  query: GetWorkOrdersQuery;
  hasMore: boolean;
  totalCount: number;

  currentPage: number;
  totalPages: number;

  selectedIds: string[];
}

const workOrderAdapter = createEntityAdapter<WorkOrderDto>();

export const initialState: WorkOrderState = {
  ...workOrderAdapter.getInitialState(),

  query: {
    offset: 0,
    limit: DEFAULT_LIST_LIMIT,
    orderedAt: [format(subDays(new Date(), 14), DATE_FORMAT), format(new Date(), DATE_FORMAT)],
    accountName: '',
    productName: '',
    includeCompleted: false,
  },
  hasMore: true,
  totalCount: 0,

  currentPage: 1,
  totalPages: 1,

  selectedIds: [],
};

const slice = createGenericSlice({
  name: 'workOrders',
  initialState,
  entityAdapter: workOrderAdapter,
  reducers: {
    createWorkOrder: (state, action: PayloadAction<CreateWorkOrderDto>) => {},
    createWorkOrders: (state, action: PayloadAction<CreateWorkOrdersDto[]>) => {},
    updateWorkOrder: (state, action: PayloadAction<UpdateWorkOrderDto>) => {},
    deleteWorkOrders: (state, action: PayloadAction<string[]>) => {},
  },
});

const workOrderSelector = ({ workOrder }: RootState) => workOrder;

const selectors = {
  workOrderSelector,
  query: createSelector(workOrderSelector, ({ query }) => query),
  ids: createSelector(workOrderSelector, ({ ids }) => ids as string[]),
  workOrders: createSelector(workOrderSelector, ({ ids, entities }) => ids.map((id) => entities[id] as WorkOrderDto)),
  hasMore: createSelector(workOrderSelector, ({ hasMore }) => hasMore),
  totalCount: createSelector(workOrderSelector, ({ totalCount }) => totalCount),
  currentPage: createSelector(workOrderSelector, ({ currentPage }) => currentPage),
  totalPages: createSelector(workOrderSelector, ({ totalPages }) => totalPages),
  isSelectMode: createSelector(workOrderSelector, ({ selectedIds }) => !!selectedIds.length),
  selectedIds: createSelector(workOrderSelector, ({ selectedIds }) => selectedIds),
};

const { actions } = slice;

export { selectors as workOrderSelectors, actions as workOrderActions };

export default slice.reducer;
