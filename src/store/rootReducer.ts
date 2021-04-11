import { History } from 'history';
import { combineReducers } from '@reduxjs/toolkit';
import { connectRouter } from 'connected-react-router';

export const createRootReducer = (history: History) => {
  return combineReducers({
    router: connectRouter(history),
  });
};
