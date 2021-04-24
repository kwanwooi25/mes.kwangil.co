import { GetPlatesQuery, PlateDto } from './interface';
import { all, call, fork, put, select, takeEvery } from 'redux-saga/effects';
import { plateActions, plateSelectors } from './plateSlice';

import { GetListResponse } from 'types/api';
import { LoadingKeys } from 'const';
import { dialogActions } from 'features/dialog/dialogSlice';
import { loadingActions } from 'features/loading/loadingSlice';
import { notificationActions } from 'features/notification/notificationSlice';
import { plateApi } from './plateApi';

const {
  getList,
  setList,
  resetList,
  deletePlates,
  resetSelection,
  createPlate,
  updatePlate,
  updateSuccess,
} = plateActions;
const { startLoading, finishLoading } = loadingActions;
const { close: closeDialog } = dialogActions;
const { notify } = notificationActions;

function* getPlatesSaga({ payload: query }: ReturnType<typeof getList>) {
  try {
    yield put(startLoading(LoadingKeys.GET_PLATES));
    const data: GetListResponse<PlateDto> = yield call(plateApi.getPlates, query);
    yield put(setList(data));
  } catch (error) {
    yield put(notify({ variant: 'error', message: 'plates:getPlatesFailed' }));
  } finally {
    yield put(finishLoading(LoadingKeys.GET_PLATES));
  }
}

function* createPlateSaga({ payload: plateToCreate }: ReturnType<typeof createPlate>) {
  try {
    yield put(startLoading(LoadingKeys.SAVING_PLATE));
    yield call(plateApi.createPlate, plateToCreate);
    yield put(closeDialog());
    yield put(notify({ variant: 'success', message: 'plates:createPlateSuccess' }));
    yield fork(resetPlatesAndFetch);
  } catch (error) {
    yield put(notify({ variant: 'error', message: 'plates:createPlateFailed' }));
  } finally {
    yield put(finishLoading(LoadingKeys.SAVING_PLATE));
  }
}

function* updatePlateSaga({ payload: plateToUpdate }: ReturnType<typeof updatePlate>) {
  try {
    yield put(startLoading(LoadingKeys.SAVING_PLATE));
    const updatedPlate: PlateDto = yield call(plateApi.updatePlate, plateToUpdate);
    yield put(closeDialog());
    yield put(notify({ variant: 'success', message: 'plates:updatePlateSuccess' }));
    yield put(updateSuccess(updatedPlate));
  } catch (error) {
    yield put(notify({ variant: 'error', message: 'plates:updatePlateFailed' }));
  } finally {
    yield put(finishLoading(LoadingKeys.SAVING_PLATE));
  }
}

function* deletePlatesSaga({ payload: plateIds }: ReturnType<typeof deletePlates>) {
  try {
    yield call(plateApi.deletePlates, plateIds);
    yield put(resetSelection());
    yield put(notify({ variant: 'success', message: 'plates:deletePlateSuccess' }));
    yield fork(resetPlatesAndFetch);
  } catch (error) {
    yield put(notify({ variant: 'error', message: 'plates:deletePlateFailed' }));
  }
}

function* resetPlatesAndFetch() {
  yield put(resetList());
  const query: GetPlatesQuery = yield select(plateSelectors.query);
  yield put(getList({ ...query, offset: 0 }));
}

export function* plateSaga(): any {
  yield all([
    yield takeEvery(getList.type, getPlatesSaga),
    yield takeEvery(createPlate.type, createPlateSaga),
    yield takeEvery(updatePlate.type, updatePlateSaga),
    yield takeEvery(deletePlates.type, deletePlatesSaga),
  ]);
}
