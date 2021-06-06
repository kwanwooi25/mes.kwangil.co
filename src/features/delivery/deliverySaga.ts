import { LoadingKeys } from 'const';
import { loadingActions } from 'features/loading/loadingSlice';
import { notificationActions } from 'features/notification/notificationSlice';
import { GetListResponse } from 'types/api';

import { all, call, put, takeEvery } from '@redux-saga/core/effects';

import { deliveryApi } from './deliveryApi';
import { deliveryActions } from './deliverySlice';
import { DeliveryDto } from './interface';

const { getList, setList } = deliveryActions;
const { startLoading, finishLoading } = loadingActions;
const { notify } = notificationActions;

function* getDeliveriesSaga({ payload: query }: ReturnType<typeof getList>) {
  try {
    yield put(startLoading(LoadingKeys.GET_DELIVERIES));
    const data: GetListResponse<DeliveryDto> = yield call(deliveryApi.getDeliveries, query);
    yield put(setList(data));
  } catch (error) {
    yield put(notify({ variant: 'error', message: 'delivery:getDeliveriesFailed' }));
  } finally {
    yield put(finishLoading(LoadingKeys.GET_DELIVERIES));
  }
}

export function* deliverySaga(): any {
  yield all([yield takeEvery(getList.type, getDeliveriesSaga)]);
}
