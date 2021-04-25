import { Action, ThunkAction, combineReducers, configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { connectRouter, routerMiddleware } from 'connected-react-router';

import accountReducer from 'features/account/accountSlice';
import { accountSaga } from 'features/account/accountSaga';
import { all } from 'redux-saga/effects';
import authReducer from 'features/auth/authSlice';
import { authSaga } from 'features/auth/authSaga';
import { createBrowserHistory } from 'history';
import { createLogger } from 'redux-logger';
import createSagaMiddleware from 'redux-saga';
import dialogReducer from 'features/dialog/dialogSlice';
import loadingReducer from 'features/loading/loadingSlice';
import notificationReducer from 'features/notification/notificationSlice';
import plateReducer from 'features/plate/plateSlice';
import { plateSaga } from 'features/plate/plateSaga';
import productReducer from 'features/product/productSlice';
import { productSaga } from 'features/product/productSaga';
import uiReducer from 'features/ui/uiSlice';
import workOrderReducer from 'features/workOrder/workOrderSlice';
import { workOrderSaga } from 'features/workOrder/workOrderSaga';

export const history = createBrowserHistory();

const reducer = combineReducers({
  router: connectRouter(history),
  ui: uiReducer,
  loading: loadingReducer,
  dialog: dialogReducer,
  notification: notificationReducer,
  auth: authReducer,
  account: accountReducer,
  product: productReducer,
  plate: plateReducer,
  workOrder: workOrderReducer,
});

const sagaMiddleware = createSagaMiddleware();

const store = configureStore({
  reducer,
  middleware: [
    ...getDefaultMiddleware({ thunk: false, serializableCheck: false }),
    routerMiddleware(history),
    createLogger({ collapsed: true }),
    sagaMiddleware,
  ],
  devTools: process.env.NODE_ENV !== 'production',
});

function* rootSaga() {
  yield all([authSaga(), accountSaga(), productSaga(), plateSaga(), workOrderSaga()]);
}

sagaMiddleware.run(rootSaga);

export type RootState = ReturnType<typeof reducer>;

export type AppDispatch = typeof store.dispatch;
export type AppThunk = ThunkAction<void, RootState, unknown, Action>;
export const useAppDispatch = () => useDispatch();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default store;
