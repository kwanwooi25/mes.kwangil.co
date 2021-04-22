import { RootState } from 'app/store';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ReactElement } from 'react';

interface DialogState {
  dialog?: ReactElement | null;
}

const initialState: DialogState = {
  dialog: null,
};

const dialogSlice = createSlice({
  name: 'dialog',
  initialState,
  reducers: {
    open: (state, { payload: dialog }: PayloadAction<ReactElement>) => {
      state.dialog = dialog;
    },
    close: (state) => {
      state.dialog = null;
    },
  },
});

export const dialogActions = dialogSlice.actions;

export const dialogSelector = ({ dialog }: RootState) => dialog;

export default dialogSlice.reducer;
