import { AccountState, accountActions, accountSelector } from './accountSlice';
import { all, call, put, select, takeEvery } from 'redux-saga/effects';

import { AccountDto } from './interface';
import { GetListResponse } from 'types/api';
import { accountApi } from './accountApi';
import { notificationActions } from 'features/notification/notificationSlice';

const {
  setLoading,
  getAccounts,
  setAccounts,
  resetAccounts,
  setSaving,
  createAccount,
  setShouldCloseAccountDialog,
} = accountActions;

function* getAccountsSaga({ payload: query }: ReturnType<typeof getAccounts>) {
  try {
    yield put(setLoading(true));
    const data: GetListResponse<AccountDto> = yield call(accountApi.getAccounts, query);
    yield put(setAccounts(data));
  } catch (error) {
    yield put(notificationActions.notify({ variant: 'error', message: 'accounts:getAccountsFailed' }));
  } finally {
    yield put(setLoading(false));
  }
}

function* createAccountSaga({ payload: accountToCreate }: ReturnType<typeof createAccount>) {
  const hasEmptyContactTitle = accountToCreate.contacts?.some(({ title }) => !title);
  if (hasEmptyContactTitle) {
    yield put(notificationActions.notify({ variant: 'error', message: 'contacts:titleRequired' }));
    return;
  }

  try {
    yield put(setSaving(true));
    yield call(accountApi.createAccount, accountToCreate);
    yield put(setShouldCloseAccountDialog(true));
    yield put(notificationActions.notify({ variant: 'success', message: 'accounts:createAccountSuccess' }));
    yield put(resetAccounts());
    const { query }: AccountState = yield select(accountSelector);
    yield put(getAccounts({ ...query, offset: 0 }));
  } catch (error) {
    yield put(notificationActions.notify({ variant: 'error', message: 'accounts:createAccountFailed' }));
  } finally {
    yield put(setSaving(false));
  }
}

export function* accountSaga(): any {
  yield all([
    yield takeEvery(getAccounts.type, getAccountsSaga),
    yield takeEvery(createAccount.type, createAccountSaga),
  ]);
}
