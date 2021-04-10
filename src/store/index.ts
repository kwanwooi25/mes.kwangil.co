import { Action, ThunkAction, configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

import { createBrowserHistory } from 'history';
import { createLogger } from 'redux-logger';
import { createRootReducer } from './rootReducer';
import { routerMiddleware } from 'connected-react-router';

export const history = createBrowserHistory();

const reducer = createRootReducer(history);

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
