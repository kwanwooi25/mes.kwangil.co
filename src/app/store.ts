import { connectRouter, routerMiddleware } from 'connected-react-router';
import { authSaga } from 'features/auth/authSaga';
import authReducer from 'features/auth/authSlice';
import { deliverySaga } from 'features/delivery/deliverySaga';
import deliveryReducer from 'features/delivery/deliverySlice';
import dialogReducer from 'features/dialog/dialogSlice';
import loadingReducer from 'features/loading/loadingSlice';
import notificationReducer from 'features/notification/notificationSlice';
import { plateSaga } from 'features/plate/plateSaga';
import plateReducer from 'features/plate/plateSlice';
import uiReducer from 'features/ui/uiSlice';
import { workOrderSaga } from 'features/workOrder/workOrderSaga';
import workOrderReducer from 'features/workOrder/workOrderSlice';
import { createBrowserHistory } from 'history';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { createLogger } from 'redux-logger';
import createSagaMiddleware from 'redux-saga';
import { all } from 'redux-saga/effects';

import {
    Action, combineReducers, configureStore, getDefaultMiddleware, ThunkAction
} from '@reduxjs/toolkit';

export const history = createBrowserHistory();

const reducer = combineReducers({
  router: connectRouter(history),
  ui: uiReducer,
  loading: loadingReducer,
  dialog: dialogReducer,
  notification: notificationReducer,
  auth: authReducer,
  plate: plateReducer,
  workOrder: workOrderReducer,
  delivery: deliveryReducer,
});

const sagaMiddleware = createSagaMiddleware();
const logger = createLogger({ collapsed: true });

const middleware = [
  ...getDefaultMiddleware({ thunk: false, serializableCheck: false }),
  routerMiddleware(history),
  sagaMiddleware,
];

const isProduction = process.env.NODE_ENV === 'production';

if (!isProduction) {
  middleware.push(logger);
}

const store = configureStore({
  reducer,
  middleware,
  devTools: !isProduction,
});

function* rootSaga() {
  yield all([authSaga(), plateSaga(), workOrderSaga(), deliverySaga()]);
}

sagaMiddleware.run(rootSaga);

export type RootState = ReturnType<typeof reducer>;

export type AppDispatch = typeof store.dispatch;
export type AppThunk = ThunkAction<void, RootState, unknown, Action>;
export const useAppDispatch = () => useDispatch();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default store;
