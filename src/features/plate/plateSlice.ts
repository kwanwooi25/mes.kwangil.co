import { RootState } from 'app/store';
import { DEFAULT_LIST_LIMIT, PlateLength, PlateRound } from 'const';
import { createGenericSlice } from 'lib/reduxHelper';

import { createEntityAdapter, createSelector, EntityState, PayloadAction } from '@reduxjs/toolkit';

import { CreatePlateDto, GetPlatesQuery, PlateDto, UpdatePlateDto } from './interface';

export interface PlateState extends EntityState<PlateDto> {
  query: GetPlatesQuery;
  hasMore: boolean;
  totalCount: number;

  pagination: {
    ids: number[];
    currentPage: number;
    totalPages: number;
  };

  selectedIds: number[];
}

const platesAdapter = createEntityAdapter<PlateDto>();

export const initialState: PlateState = {
  ...platesAdapter.getInitialState(),

  query: {
    offset: 0,
    limit: DEFAULT_LIST_LIMIT,
    accountName: '',
    productName: '',
    name: '',
    round: [PlateRound.MIN, PlateRound.MAX],
    length: [PlateLength.MIN, PlateLength.MAX],
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
  name: 'plates',
  initialState,
  entityAdapter: platesAdapter,
  reducers: {
    createPlate: (state, action: PayloadAction<CreatePlateDto>) => {},
    // createPlates: (state, action: PayloadAction<CreatePlatesDto[]>) => {},
    updatePlate: (state, action: PayloadAction<UpdatePlateDto>) => {},
    deletePlates: (state, action: PayloadAction<number[]>) => {},
  },
});

const plateState = ({ plate }: RootState) => plate;

const selectors = {
  plateState,
  query: createSelector(plateState, ({ query }) => query),
  ids: createSelector(plateState, ({ ids }) => ids as number[]),
  plates: createSelector(plateState, ({ ids, entities }) => ids.map((id) => entities[id] as PlateDto)),
  paginatedPlates: createSelector(plateState, ({ pagination, entities }) =>
    pagination.ids.map((id) => entities[id] as PlateDto)
  ),
  hasMore: createSelector(plateState, ({ hasMore }) => hasMore),
  totalCount: createSelector(plateState, ({ totalCount }) => totalCount),
  pagination: createSelector(plateState, ({ pagination }) => pagination),
  isSelectMode: createSelector(plateState, ({ selectedIds }) => !!selectedIds.length),
  selectedIds: createSelector(plateState, ({ selectedIds }) => selectedIds),
};

const { actions } = slice;

export { selectors as plateSelectors, actions as plateActions };

export default slice.reducer;
