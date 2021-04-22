import { AccountDto, ContactDto, CreateContactDto } from './interface';
import { AccountState, accountActions, accountSelector } from './accountSlice';
import { all, call, cancel, fork, put, select, takeEvery } from 'redux-saga/effects';

import { GetListResponse } from 'types/api';
import { accountApi } from './accountApi';
import { notificationActions } from 'features/notification/notificationSlice';
import { loadingActions } from 'features/loading/loadingSlice';
import { LoadingKeys } from 'const';

const {
  getAccounts,
  setAccounts,
  resetAccounts,
  createAccount,
  updateAccount,
  updateAccountSuccess,
  deleteAccounts,
  setShouldCloseAccountDialog,
  resetSelection,
} = accountActions;
const { startLoading, finishLoading } = loadingActions;

function* getAccountsSaga({ payload: query }: ReturnType<typeof getAccounts>) {
  try {
    yield put(startLoading(LoadingKeys.GET_ACCOUNTS));
    const data: GetListResponse<AccountDto> = yield call(accountApi.getAccounts, query);
    yield put(setAccounts(data));
  } catch (error) {
    yield put(notificationActions.notify({ variant: 'error', message: 'accounts:getAccountsFailed' }));
  } finally {
    yield put(finishLoading(LoadingKeys.GET_ACCOUNTS));
  }
}

function* createAccountSaga({ payload: accountToCreate }: ReturnType<typeof createAccount>) {
  const validated: boolean = yield call(validateContactTitles, accountToCreate.contacts);
  if (!validated) {
    cancel();
  }

  try {
    yield put(startLoading(LoadingKeys.SAVING_ACCOUNT));
    yield call(accountApi.createAccount, accountToCreate);
    yield put(setShouldCloseAccountDialog(true));
    yield put(notificationActions.notify({ variant: 'success', message: 'accounts:createAccountSuccess' }));
    yield fork(resetAccountsAndFetch);
  } catch (error) {
    yield put(notificationActions.notify({ variant: 'error', message: 'accounts:createAccountFailed' }));
  } finally {
    yield put(finishLoading(LoadingKeys.SAVING_ACCOUNT));
  }
}

function* updateAccountSaga({ payload: accountToUpdate }: ReturnType<typeof updateAccount>) {
  const validated: boolean = yield call(validateContactTitles, accountToUpdate.contacts);
  if (!validated) {
    cancel();
  }

  try {
    yield put(startLoading(LoadingKeys.SAVING_ACCOUNT));
    const updatedAccount: AccountDto = yield call(accountApi.updateAccount, accountToUpdate);
    yield put(setShouldCloseAccountDialog(true));
    yield put(notificationActions.notify({ variant: 'success', message: 'accounts:updateAccountSuccess' }));
    yield put(updateAccountSuccess(updatedAccount));
  } catch (error) {
    yield put(notificationActions.notify({ variant: 'error', message: 'accounts:updateAccountFailed' }));
  } finally {
    yield put(finishLoading(LoadingKeys.SAVING_ACCOUNT));
  }
}

function* deleteAccountsSaga({ payload: accountIds }: ReturnType<typeof deleteAccounts>) {
  try {
    yield call(accountApi.deleteAccounts, accountIds);
    yield put(resetSelection());
    yield put(notificationActions.notify({ variant: 'success', message: 'accounts:deleteAccountSuccess' }));
    yield fork(resetAccountsAndFetch);
  } catch (error) {
    yield put(notificationActions.notify({ variant: 'error', message: 'accounts:deleteAccountFailed' }));
  }
}

function* resetAccountsAndFetch() {
  yield put(resetAccounts());
  const { query }: AccountState = yield select(accountSelector);
  yield put(getAccounts({ ...query, offset: 0 }));
}

function* validateContactTitles(contacts?: (CreateContactDto | ContactDto)[]) {
  const hasEmptyContactTitle = contacts?.some(({ title }) => !title);
  if (hasEmptyContactTitle) {
    yield put(notificationActions.notify({ variant: 'error', message: 'contacts:titleRequired' }));
  }

  return !hasEmptyContactTitle;
}

export function* accountSaga(): any {
  yield all([
    yield takeEvery(getAccounts.type, getAccountsSaga),
    yield takeEvery(createAccount.type, createAccountSaga),
    yield takeEvery(updateAccount.type, updateAccountSaga),
    yield takeEvery(deleteAccounts.type, deleteAccountsSaga),
  ]);
}
