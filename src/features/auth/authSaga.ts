import { all, call, fork, put, takeLatest } from 'redux-saga/effects';
import { getAuthToken, setAuthHeaders } from 'app/apiClient';

import { LoadingKeys, Path } from 'const';
import { UserDto } from './interface';
import { authActions } from './authSlice';
import { authApi } from './authApi';
import { notificationActions } from 'features/notification/notificationSlice';
import { routerActions } from 'connected-react-router';
import { loadingActions } from 'features/loading/loadingSlice';

const { login, loginSuccess, loginFailed, logout } = authActions;
const { startLoading, finishLoading } = loadingActions;

function* loginSaga({ payload: loginData }: ReturnType<typeof login>) {
  try {
    yield put(startLoading(LoadingKeys.LOGIN));
    const { user, token } = yield call(authApi.login, loginData);
    yield put(loginSuccess({ user, token }));
  } catch (error) {
    yield put(notificationActions.notify({ variant: 'error', message: 'auth:loginFailed' }));
    yield put(loginFailed());
  } finally {
    yield put(finishLoading(LoadingKeys.LOGIN));
  }
}

function* logoutSaga() {
  yield put(loginFailed());
  yield put(routerActions.push(Path.LOGIN));
}

function* refreshLoginSaga() {
  try {
    yield put(startLoading(LoadingKeys.REFRESH_LOGIN));
    const token = getAuthToken();
    yield call(setAuthHeaders, token);
    const user: UserDto = yield call(authApi.whoAmI);
    if (!user) {
      yield put(loginFailed());
      return;
    }
    yield put(loginSuccess({ user, token }));
  } catch (error) {
    yield put(loginFailed());
  } finally {
    yield put(finishLoading(LoadingKeys.REFRESH_LOGIN));
  }
}

export function* authSaga(): any {
  yield all([
    yield fork(refreshLoginSaga),
    yield takeLatest(login.type, loginSaga),
    yield takeLatest(logout.type, logoutSaga),
  ]);
}
