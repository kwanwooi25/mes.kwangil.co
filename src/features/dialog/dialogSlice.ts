import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import { ReactElement } from 'react';
import { RootState } from 'app/store';

interface DialogState {
  dialogs: ReactElement[];
}

const initialState: DialogState = {
  dialogs: [],
};

const dialogSlice = createSlice({
  name: 'dialog',
  initialState,
  reducers: {
    open: (state, { payload: dialog }: PayloadAction<ReactElement>) => {
      state.dialogs.unshift(dialog);
    },
    close: (state) => {
      state.dialogs.shift();
    },
  },
});

export const dialogActions = dialogSlice.actions;

export const dialogSelector = ({ dialog }: RootState) => dialog;

export default dialogSlice.reducer;
