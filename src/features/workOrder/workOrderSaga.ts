import { CreateWorkOrdersDto, GetWorkOrdersQuery, WorkOrderDto } from './interface';
import { all, call, fork, put, select, takeEvery } from 'redux-saga/effects';
import { workOrderActions, workOrderSelectors } from './workOrderSlice';

import { GetListResponse } from 'types/api';
import { LoadingKeys } from 'const';
import { dialogActions } from 'features/dialog/dialogSlice';
import { loadingActions } from 'features/loading/loadingSlice';
import { notificationActions } from 'features/notification/notificationSlice';
import { workOrderApi } from './workOrderApi';

const {
  getList,
  setList,
  resetList,
  deleteWorkOrders,
  resetSelection,
  createWorkOrder,
  createWorkOrders,
  updateWorkOrder,
  updateSuccess,
} = workOrderActions;
const { startLoading, finishLoading } = loadingActions;
const { close: closeDialog } = dialogActions;
const { notify } = notificationActions;

function* getWorkOrdersSaga({ payload: query }: ReturnType<typeof getList>) {
  try {
    yield put(startLoading(LoadingKeys.GET_WORK_ORDERS));
    const data: GetListResponse<WorkOrderDto> = yield call(workOrderApi.getWorkOrders, query);
    yield put(setList(data));
  } catch (error) {
    yield put(notify({ variant: 'error', message: 'workOrders:getWorkOrdersFailed' }));
  } finally {
    yield put(finishLoading(LoadingKeys.GET_WORK_ORDERS));
  }
}

function* createWorkOrderSaga({ payload: workOrderToCreate }: ReturnType<typeof createWorkOrder>) {
  try {
    yield put(startLoading(LoadingKeys.SAVING_WORK_ORDER));
    yield call(workOrderApi.createWorkOrder, workOrderToCreate);
    yield put(closeDialog());
    yield put(notify({ variant: 'success', message: 'workOrders:createWorkOrderSuccess' }));
    yield fork(resetWorkOrdersAndFetch);
  } catch (error) {
    yield put(notify({ variant: 'error', message: 'workOrders:createWorkOrderFailed' }));
  } finally {
    yield put(finishLoading(LoadingKeys.SAVING_WORK_ORDER));
  }
}

function* createWorkOrdersSaga({ payload: workOrdersToCreate }: ReturnType<typeof createWorkOrders>) {
  try {
    yield put(startLoading(LoadingKeys.UPLOADING));
    const { failedList } = yield call(workOrderApi.createWorkOrders, workOrdersToCreate);
    if (failedList.length) {
      const workOrdersToRetry: CreateWorkOrdersDto[] = failedList.map(
        ({ reason, ...workOrder }: CreateWorkOrdersDto & { reason: string }) => workOrder
      );
      yield put(createWorkOrders(workOrdersToRetry));
    } else {
      yield put(notify({ variant: 'success', message: 'workOrders:bulkCreateWorkOrderSuccess' }));
      yield put(closeDialog());
      yield fork(resetWorkOrdersAndFetch);
    }
  } catch (error) {
    yield put(notify({ variant: 'error', message: 'workOrders:bulkCreateWorkOrderFailed' }));
  } finally {
    yield put(finishLoading(LoadingKeys.UPLOADING));
  }
}

function* updateWorkOrderSaga({ payload: workOrderToUpdate }: ReturnType<typeof updateWorkOrder>) {
  try {
    yield put(startLoading(LoadingKeys.SAVING_WORK_ORDER));
    const updatedWorkOrder: WorkOrderDto = yield call(workOrderApi.updateWorkOrder, workOrderToUpdate);
    yield put(closeDialog());
    yield put(notify({ variant: 'success', message: 'workOrders:updateWorkOrderSuccess' }));
    yield put(updateSuccess(updatedWorkOrder));
  } catch (error) {
    yield put(notify({ variant: 'error', message: 'workOrders:updateWorkOrderFailed' }));
  } finally {
    yield put(finishLoading(LoadingKeys.SAVING_WORK_ORDER));
  }
}

function* deleteWorkOrdersSaga({ payload: workOrderIds }: ReturnType<typeof deleteWorkOrders>) {
  try {
    yield call(workOrderApi.deleteWorkOrders, workOrderIds);
    yield put(resetSelection());
    yield put(notify({ variant: 'success', message: 'products:deleteWorkOrderSuccess' }));
    yield fork(resetWorkOrdersAndFetch);
  } catch (error) {
    yield put(notify({ variant: 'error', message: 'products:deleteProductFailed' }));
  }
}

function* resetWorkOrdersAndFetch() {
  yield put(resetList());
  const query: GetWorkOrdersQuery = yield select(workOrderSelectors.query);
  yield put(getList({ ...query, offset: 0 }));
}

export function* workOrderSaga(): any {
  yield all([
    yield takeEvery(getList.type, getWorkOrdersSaga),
    yield takeEvery(createWorkOrder.type, createWorkOrderSaga),
    yield takeEvery(createWorkOrders.type, createWorkOrdersSaga),
    yield takeEvery(updateWorkOrder.type, updateWorkOrderSaga),
    yield takeEvery(deleteWorkOrders.type, deleteWorkOrdersSaga),
  ]);
}
