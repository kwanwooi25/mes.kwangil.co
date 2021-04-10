import { History } from 'history';
import authReducer from 'features/auth/authSlice';
import { combineReducers } from '@reduxjs/toolkit';
import { connectRouter } from 'connected-react-router';

export const createRootReducer = (history: History) => {
  return combineReducers({
    router: connectRouter(history),
    auth: authReducer,
  });
};
