import { ProductState, productActions, productSelector } from './productSlice';
import { all, call, fork, put, select, takeEvery } from 'redux-saga/effects';

import { GetListResponse } from 'types/api';
import { ProductDto } from './interface';
import { notificationActions } from 'features/notification/notificationSlice';
import { productApi } from './productApi';
import { loadingActions } from 'features/loading/loadingSlice';
import { LoadingKeys } from 'const';

const {
  getProducts,
  setProducts,
  resetProducts,
  deleteProducts,
  resetSelection,
  createProduct,
  updateProduct,
  updateProductSuccess,
  setShouldCloseProductDialog,
} = productActions;
const { startLoading, finishLoading } = loadingActions;

function* getProductsSaga({ payload: query }: ReturnType<typeof getProducts>) {
  try {
    yield put(startLoading(LoadingKeys.GET_PRODUCTS));
    const data: GetListResponse<ProductDto> = yield call(productApi.getProducts, query);
    yield put(setProducts(data));
  } catch (error) {
    yield put(notificationActions.notify({ variant: 'error', message: 'products:getProductsFailed' }));
  } finally {
    yield put(finishLoading(LoadingKeys.GET_PRODUCTS));
  }
}

function* createProductSaga({ payload: productToCreate }: ReturnType<typeof createProduct>) {
  try {
    yield put(startLoading(LoadingKeys.SAVING_PRODUCT));
    yield call(productApi.createProduct, productToCreate);
    yield put(setShouldCloseProductDialog(true));
    yield put(notificationActions.notify({ variant: 'success', message: 'products:createProductSuccess' }));
    yield fork(resetProductsAndFetch);
  } catch (error) {
    yield put(notificationActions.notify({ variant: 'error', message: 'products:createProductFailed' }));
  } finally {
    yield put(finishLoading(LoadingKeys.SAVING_PRODUCT));
  }
}

function* updateProductSaga({ payload: productToUpdate }: ReturnType<typeof updateProduct>) {
  try {
    yield put(startLoading(LoadingKeys.SAVING_PRODUCT));
    const updatedProduct: ProductDto = yield call(productApi.updateProduct, productToUpdate);
    yield put(setShouldCloseProductDialog(true));
    yield put(notificationActions.notify({ variant: 'success', message: 'products:updateProductSuccess' }));
    yield put(updateProductSuccess(updatedProduct));
  } catch (error) {
    yield put(notificationActions.notify({ variant: 'error', message: 'products:updateProductFailed' }));
  } finally {
    yield put(finishLoading(LoadingKeys.SAVING_PRODUCT));
  }
}

function* deleteProductsSaga({ payload: productIds }: ReturnType<typeof deleteProducts>) {
  try {
    yield call(productApi.deleteProducts, productIds);
    yield put(resetSelection());
    yield put(notificationActions.notify({ variant: 'success', message: 'products:deleteProductSuccess' }));
    yield fork(resetProductsAndFetch);
  } catch (error) {
    yield put(notificationActions.notify({ variant: 'error', message: 'products:deleteProductFailed' }));
  }
}

function* resetProductsAndFetch() {
  yield put(resetProducts());
  const { query }: ProductState = yield select(productSelector);
  yield put(getProducts({ ...query, offset: 0 }));
}

export function* productSaga(): any {
  yield all([
    yield takeEvery(getProducts.type, getProductsSaga),
    yield takeEvery(createProduct.type, createProductSaga),
    yield takeEvery(updateProduct.type, updateProductSaga),
    yield takeEvery(deleteProducts.type, deleteProductsSaga),
  ]);
}
