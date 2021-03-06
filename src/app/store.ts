import { connectRouter, routerMiddleware } from 'connected-react-router';
import authReducer from 'features/auth/authSlice';
import dialogReducer from 'features/dialog/dialogSlice';
import notificationReducer from 'features/notification/notificationSlice';
import uiReducer from 'features/ui/uiSlice';
import { createBrowserHistory } from 'history';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

import {
  Action,
  combineReducers,
  configureStore,
  getDefaultMiddleware,
  ThunkAction,
} from '@reduxjs/toolkit';

export const history = createBrowserHistory();

const reducer = combineReducers({
  router: connectRouter(history),
  ui: uiReducer,
  dialog: dialogReducer,
  notification: notificationReducer,
  auth: authReducer,
});

const middleware = [
  ...getDefaultMiddleware({ thunk: false, serializableCheck: false }),
  routerMiddleware(history),
];

const isProduction = import.meta.env.NODE_ENV === 'production';

const store = configureStore({
  reducer,
  middleware,
  devTools: !isProduction,
});

export type RootState = ReturnType<typeof reducer>;

export type AppDispatch = typeof store.dispatch;
export type AppThunk = ThunkAction<void, RootState, unknown, Action>;
export const useAppDispatch = () => useDispatch();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default store;
