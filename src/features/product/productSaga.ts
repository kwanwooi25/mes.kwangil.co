import { all, call, put, takeEvery } from 'redux-saga/effects';

import { GetListResponse } from 'types/api';
import { ProductDto } from './interface';
import { notificationActions } from 'features/notification/notificationSlice';
import { productActions } from './productSlice';
import { productApi } from './productApi';

const { setLoading, getProducts, setProducts } = productActions;

function* getProductsSaga({ payload: query }: ReturnType<typeof getProducts>) {
  try {
    yield put(setLoading(true));
    const data: GetListResponse<ProductDto> = yield call(productApi.getProducts, query);
    yield put(setProducts(data));
  } catch (error) {
    yield put(notificationActions.notify({ variant: 'error', message: 'products:getProductsFailed' }));
  } finally {
    yield put(setLoading(false));
  }
}

export function* productSaga(): any {
  yield all([
    yield takeEvery(getProducts.type, getProductsSaga),
    // yield takeEvery(createProduct.type, createProductSaga),
    // yield takeEvery(updateProduct.type, updateProductSaga),
    // yield takeEvery(deleteProducts.type, deleteProductsSaga),
  ]);
}
