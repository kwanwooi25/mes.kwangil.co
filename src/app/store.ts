import { Action, ThunkAction, combineReducers, configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { connectRouter, routerMiddleware } from 'connected-react-router';

import accountReducer from 'features/account/accountSlice';
import { createBrowserHistory } from 'history';
import { createLogger } from 'redux-logger';
import notificationReducer from 'features/notification/notificationSlice';

export const history = createBrowserHistory();

const reducer = combineReducers({
  router: connectRouter(history),
  notification: notificationReducer,
  account: accountReducer,
});

const middleware = [...getDefaultMiddleware(), routerMiddleware(history), createLogger({ collapsed: true })];

const store = configureStore({
  reducer,
  middleware,
});

export type RootState = ReturnType<typeof reducer>;

export type AppDispatch = typeof store.dispatch;
export type AppThunk = ThunkAction<void, RootState, unknown, Action>;
export const useAppDispatch = () => useDispatch();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default store;
