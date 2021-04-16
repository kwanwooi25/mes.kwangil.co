import { History } from 'history';
import accountReducer from 'features/account/accountSlice';
import { combineReducers } from '@reduxjs/toolkit';
import { connectRouter } from 'connected-react-router';
import notificationReducer from 'features/notification/notificationSlice';

export const createRootReducer = (history: History) => {
  return combineReducers({
    router: connectRouter(history),
    notification: notificationReducer,
    account: accountReducer,
  });
};
