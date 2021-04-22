import { AccountDto, ContactDto, CreateContactDto, CreateAccountDto } from './interface';
import { AccountState, accountActions, accountSelector } from './accountSlice';
import { all, call, cancel, fork, put, select, takeEvery } from 'redux-saga/effects';

import { GetListResponse } from 'types/api';
import { accountApi } from './accountApi';
import { notificationActions } from 'features/notification/notificationSlice';
import { loadingActions } from 'features/loading/loadingSlice';
import { LoadingKeys } from 'const';
import { dialogActions } from 'features/dialog/dialogSlice';

const {
  getAccounts,
  setAccounts,
  resetAccounts,
  createAccount,
  createAccounts,
  updateAccount,
  updateAccountSuccess,
  deleteAccounts,
  resetSelection,
} = accountActions;
const { startLoading, finishLoading } = loadingActions;
const { close: closeDialog } = dialogActions;
const { notify } = notificationActions;

function* getAccountsSaga({ payload: query }: ReturnType<typeof getAccounts>) {
  try {
    yield put(startLoading(LoadingKeys.GET_ACCOUNTS));
    const data: GetListResponse<AccountDto> = yield call(accountApi.getAccounts, query);
    yield put(setAccounts(data));
  } catch (error) {
    yield put(notify({ variant: 'error', message: 'accounts:getAccountsFailed' }));
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
    yield put(closeDialog());
    yield put(notify({ variant: 'success', message: 'accounts:createAccountSuccess' }));
    yield fork(resetAccountsAndFetch);
  } catch (error) {
    yield put(notify({ variant: 'error', message: 'accounts:createAccountFailed' }));
  } finally {
    yield put(finishLoading(LoadingKeys.SAVING_ACCOUNT));
  }
}

function* createAccountsSaga({ payload: accountsToCreate }: ReturnType<typeof createAccounts>) {
  try {
    yield put(startLoading(LoadingKeys.UPLOADING));
    const { failedList } = yield call(accountApi.createAccounts, accountsToCreate);
    if (failedList.length) {
      const accountsToRetry: CreateAccountDto[] = failedList.map(
        ({ reason, ...account }: CreateAccountDto & { reason: string }) => account
      );
      yield put(createAccounts(accountsToRetry));
    } else {
      yield put(notify({ variant: 'success', message: 'accounts:bulkCreateAccountSuccess' }));
      yield put(closeDialog());
      yield fork(resetAccountsAndFetch);
    }
  } catch (error) {
    yield put(notify({ variant: 'error', message: 'accounts:bulkCreateAccountFailed' }));
  } finally {
    yield put(finishLoading(LoadingKeys.UPLOADING));
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
    yield put(closeDialog());
    yield put(notify({ variant: 'success', message: 'accounts:updateAccountSuccess' }));
    yield put(updateAccountSuccess(updatedAccount));
  } catch (error) {
    yield put(notify({ variant: 'error', message: 'accounts:updateAccountFailed' }));
  } finally {
    yield put(finishLoading(LoadingKeys.SAVING_ACCOUNT));
  }
}

function* deleteAccountsSaga({ payload: accountIds }: ReturnType<typeof deleteAccounts>) {
  try {
    yield call(accountApi.deleteAccounts, accountIds);
    yield put(resetSelection());
    yield put(notify({ variant: 'success', message: 'accounts:deleteAccountSuccess' }));
    yield fork(resetAccountsAndFetch);
  } catch (error) {
    yield put(notify({ variant: 'error', message: 'accounts:deleteAccountFailed' }));
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
    yield put(notify({ variant: 'error', message: 'contacts:titleRequired' }));
  }

  return !hasEmptyContactTitle;
}

export function* accountSaga(): any {
  yield all([
    yield takeEvery(getAccounts.type, getAccountsSaga),
    yield takeEvery(createAccount.type, createAccountSaga),
    yield takeEvery(createAccounts.type, createAccountsSaga),
    yield takeEvery(updateAccount.type, updateAccountSaga),
    yield takeEvery(deleteAccounts.type, deleteAccountsSaga),
  ]);
}
