import { RootState } from 'app/store';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { LoadingKeys } from 'const';

type LoadingState = {
  [key in LoadingKeys]?: boolean;
};

const initialState: LoadingState = Object.keys(LoadingKeys).reduce(
  (state, loadingKey) => ({ ...state, [loadingKey]: false }),
  {}
);

const loadingSlice = createSlice({
  name: 'loading',
  initialState,
  reducers: {
    startLoading: (state, { payload: loadingKey }: PayloadAction<LoadingKeys>) => {
      state[loadingKey] = true;
    },
    finishLoading: (state, { payload: loadingKey }: PayloadAction<LoadingKeys>) => {
      state[loadingKey] = false;
    },
  },
});

export const loadingActions = loadingSlice.actions;

export const loadingSelector = ({ loading }: RootState) => loading;

export default loadingSlice.reducer;
