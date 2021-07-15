import { OptionsObject as NotistackOptions, VariantType } from 'notistack';

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Notification {
  key: string;
  message: string;
  options?: NotistackOptions;
  dismissed?: boolean;
}

export interface NotifyActionPayload {
  variant: VariantType;
  message: string;
}

export interface NotificationState {
  notifications: Notification[];
}

const initialState: NotificationState = {
  notifications: [],
};

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    notify: (state, action: PayloadAction<NotifyActionPayload>) => {
      const { variant, message } = action.payload;

      state.notifications.push({
        key: `${new Date().getTime()}`,
        message,
        options: { variant },
        dismissed: false,
      });
    },
    remove: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(({ key }) => key !== action.payload);
    },
  },
});

export const notificationActions = notificationSlice.actions;

export default notificationSlice.reducer;
