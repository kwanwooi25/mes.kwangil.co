import { BaseQuery, GetListResponse } from 'types/api';
import {
  Draft,
  EntityAdapter,
  EntityState,
  PayloadAction,
  SliceCaseReducers,
  ValidateSliceCaseReducers,
  createSlice,
} from '@reduxjs/toolkit';

import { DEFAULT_LIST_LIMIT } from 'const';

export interface GenericState<Dto, QueryInterface> extends EntityState<Dto> {
  query: QueryInterface;
  hasMore: boolean;
  totalCount: number;

  currentPage: number;
  totalPages: number;

  selectedIds: number[];
}

export const createGenericSlice = <
  Dto extends { id: number | string },
  QueryInterface extends BaseQuery,
  Reducers extends SliceCaseReducers<GenericState<Dto, QueryInterface>>
>({
  name = '',
  initialState,
  reducers,
  entityAdapter,
}: {
  name: string;
  initialState: GenericState<Dto, QueryInterface>;
  reducers: ValidateSliceCaseReducers<GenericState<Dto, QueryInterface>, Reducers>;
  entityAdapter: EntityAdapter<Dto>;
}) => {
  return createSlice({
    name,
    initialState,
    reducers: {
      getList: (state, { payload }: PayloadAction<QueryInterface>) => {
        state.query = { ...state.query, ...payload };
      },
      setList: (state, { payload: { rows, hasMore, count } }: PayloadAction<GetListResponse<Dto>>) => {
        const { limit = DEFAULT_LIST_LIMIT, offset = 0 } = state.query;
        state.totalCount = count;
        state.currentPage = Math.floor((offset + limit) / limit);
        state.totalPages = Math.ceil(count / limit);
        state.hasMore = hasMore;
        entityAdapter.upsertMany(state as EntityState<Dto>, rows);
      },
      resetList: (state) => {
        const { limit = DEFAULT_LIST_LIMIT } = state.query;
        state.query = { ...initialState.query, limit } as Draft<QueryInterface>;
        entityAdapter.removeAll(state as EntityState<Dto>);
      },
      updateSuccess: (state, { payload: { id, ...changes } }: PayloadAction<Dto>) => {
        entityAdapter.updateOne(state as EntityState<Dto>, { id, changes: changes as Partial<Dto> });
      },

      toggleSelection: (state, { payload: ids }: PayloadAction<number>) => {
        if (state.selectedIds.includes(ids)) {
          state.selectedIds = state.selectedIds.filter((id) => id !== ids);
        } else {
          state.selectedIds.push(ids);
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

      ...reducers,
    },
  });
};