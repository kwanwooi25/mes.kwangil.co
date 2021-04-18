import { RootState } from 'app/store';
import { createSlice } from '@reduxjs/toolkit';
export interface UIState {
  isNavOpen: boolean;
  isSearchOpen: boolean;
}

const initialState: UIState = {
  isNavOpen: false,
  isSearchOpen: false,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    openNav: (state) => {
      state.isNavOpen = true;
    },
    closeNav: (state) => {
      state.isNavOpen = false;
    },
    openSearch: (state) => {
      state.isSearchOpen = true;
    },
    closeSearch: (state) => {
      state.isSearchOpen = false;
    },
  },
});

export const uiSelector = ({ ui }: RootState) => ui;

export const uiActions = uiSlice.actions;

export default uiSlice.reducer;
