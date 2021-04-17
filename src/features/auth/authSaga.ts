import { all, call, fork, put, takeLatest } from 'redux-saga/effects';
import { getAuthToken, setAuthHeaders } from 'app/apiClient';

import { Path } from 'const';
import { UserDto } from './interface';
import { authActions } from './authSlice';
import { authApi } from './authApi';
import { notificationActions } from 'features/notification/notificationSlice';
import { routerActions } from 'connected-react-router';

const { setIsRefreshing, setIsLoggingIn, login, loginSuccess, loginFailed, logout } = authActions;

function* loginSaga({ payload: loginData }: ReturnType<typeof login>) {
  try {
    yield put(setIsLoggingIn(true));
    const { user, token } = yield call(authApi.login, loginData);
    yield put(loginSuccess({ user, token }));
  } catch (error) {
    yield put(notificationActions.notify({ variant: 'error', message: 'auth:loginFailed' }));
    yield put(loginFailed());
  } finally {
    yield put(setIsLoggingIn(false));
  }
}

function* logoutSaga() {
  yield put(loginFailed());
  yield put(routerActions.push(Path.LOGIN));
}

function* refreshLoginSaga() {
  try {
    yield put(setIsRefreshing(true));
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
    yield put(setIsRefreshing(false));
  }
}

export function* authSaga(): any {
  yield all([
    yield fork(refreshLoginSaga),
    yield takeLatest(login.type, loginSaga),
    yield takeLatest(logout.type, logoutSaga),
  ]);
}
