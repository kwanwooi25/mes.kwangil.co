import { OptionsObject as NotistackOptions, VariantType } from 'notistack';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';

export interface Notification {
  key: string;
  message: string;
  options?: NotistackOptions;
  dismissed?: boolean;
}

interface NotifyActionPayload {
  variant: VariantType;
  message: string;
}

const notificationSlice = createSlice({
  name: 'notifications',
  initialState: [] as Notification[],
  reducers: {
    notify: (state, action: PayloadAction<NotifyActionPayload>) => {
      const { variant, message } = action.payload;

      state.push({
        key: `${new Date().getTime()}`,
        message,
        options: { variant },
        dismissed: false,
      });
    },
    remove: (state, action: PayloadAction<string>) => {
      state = state.filter(({ key }) => key !== action.payload);
    },
  },
});

export const notificationActions = notificationSlice.actions;

export default notificationSlice.reducer;
