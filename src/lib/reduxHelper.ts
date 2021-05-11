import { DEFAULT_LIST_LIMIT } from 'const';
import { BaseQuery, GetListResponse } from 'types/api';

import {
    createSlice, Draft, EntityAdapter, EntityState, PayloadAction, SliceCaseReducers,
    ValidateSliceCaseReducers
} from '@reduxjs/toolkit';

export interface GenericState<Dto, QueryInterface> extends EntityState<Dto> {
  query: QueryInterface;
  hasMore: boolean;
  totalCount: number;

  pagination: {
    ids: (number | string)[];
    currentPage: number;
    totalPages: number;
  };

  selectedIds: (number | string)[];
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
        state.hasMore = hasMore;
        state.pagination = {
          ids: rows.map(({ id }) => id),
          currentPage: Math.floor((offset + limit) / limit),
          totalPages: Math.ceil(count / limit),
        };
        entityAdapter.upsertMany(state as EntityState<Dto>, rows);
      },
      resetListOnPage: (state) => {
        state.pagination.ids = [];
      },
      resetList: (state) => {
        const { limit = DEFAULT_LIST_LIMIT } = state.query;
        state.query = { ...initialState.query, limit } as Draft<QueryInterface>;
        state.pagination = {
          ids: [],
          currentPage: 1,
          totalPages: 1,
        };
        entityAdapter.removeAll(state as EntityState<Dto>);
      },
      updateSuccess: (state, { payload: { id, ...changes } }: PayloadAction<Dto>) => {
        entityAdapter.updateOne(state as EntityState<Dto>, { id, changes: changes as Partial<Dto> });
      },
      updateManySuccess: (state, { payload }: PayloadAction<Dto[]>) => {
        entityAdapter.updateMany(
          state as EntityState<Dto>,
          payload.map(({ id, ...changes }) => ({ id, changes: changes as Partial<Dto> }))
        );
      },

      toggleSelection: (state, { payload: ids }: PayloadAction<number | string>) => {
        if (state.selectedIds.includes(ids)) {
          state.selectedIds = state.selectedIds.filter((id) => id !== ids);
        } else {
          state.selectedIds.push(ids);
        }
      },
      resetSelection: (state) => {
        state.selectedIds = initialState.selectedIds;
      },
      selectAll: (state, { payload: ids }: PayloadAction<(number | string)[]>) => {
        ids.forEach((id) => {
          if (!state.selectedIds.includes(id)) {
            state.selectedIds.push(id);
          }
        });
      },
      unselectAll: (state, { payload: ids }: PayloadAction<(number | string)[]>) => {
        state.selectedIds = state.selectedIds.filter((id) => !ids.includes(id));
      },

      ...reducers,
    },
  });
};
