import { ProductState, productActions, productSelector } from './productSlice';
import { all, call, fork, put, select, takeEvery } from 'redux-saga/effects';

import { GetListResponse } from 'types/api';
import { CreateProductsDto, ProductDto } from './interface';
import { notificationActions } from 'features/notification/notificationSlice';
import { productApi } from './productApi';
import { loadingActions } from 'features/loading/loadingSlice';
import { LoadingKeys } from 'const';
import { dialogActions } from 'features/dialog/dialogSlice';

const {
  getProducts,
  setProducts,
  resetProducts,
  deleteProducts,
  resetSelection,
  createProduct,
  createProducts,
  updateProduct,
  updateProductSuccess,
} = productActions;
const { startLoading, finishLoading } = loadingActions;
const { close: closeDialog } = dialogActions;
const { notify } = notificationActions;

function* getProductsSaga({ payload: query }: ReturnType<typeof getProducts>) {
  try {
    yield put(startLoading(LoadingKeys.GET_PRODUCTS));
    const data: GetListResponse<ProductDto> = yield call(productApi.getProducts, query);
    yield put(setProducts(data));
  } catch (error) {
    yield put(notify({ variant: 'error', message: 'products:getProductsFailed' }));
  } finally {
    yield put(finishLoading(LoadingKeys.GET_PRODUCTS));
  }
}

function* createProductSaga({ payload: productToCreate }: ReturnType<typeof createProduct>) {
  try {
    yield put(startLoading(LoadingKeys.SAVING_PRODUCT));
    yield call(productApi.createProduct, productToCreate);
    yield put(closeDialog());
    yield put(notify({ variant: 'success', message: 'products:createProductSuccess' }));
    yield fork(resetProductsAndFetch);
  } catch (error) {
    yield put(notify({ variant: 'error', message: 'products:createProductFailed' }));
  } finally {
    yield put(finishLoading(LoadingKeys.SAVING_PRODUCT));
  }
}

function* createProductsSaga({ payload: productsToCreate }: ReturnType<typeof createProducts>) {
  try {
    yield put(startLoading(LoadingKeys.UPLOADING));
    const { failedList } = yield call(productApi.createProducts, productsToCreate);
    if (failedList.length) {
      const productsToRetry: CreateProductsDto[] = failedList.map(
        ({ reason, ...product }: CreateProductsDto & { reason: string }) => product
      );
      yield put(createProducts(productsToRetry));
    } else {
      yield put(notify({ variant: 'success', message: 'products:bulkCreateProductSuccess' }));
      yield put(closeDialog());
      yield fork(resetProductsAndFetch);
    }
  } catch (error) {
    yield put(notify({ variant: 'error', message: 'products:bulkCreateProductFailed' }));
  } finally {
    yield put(finishLoading(LoadingKeys.UPLOADING));
  }
}

function* updateProductSaga({ payload: productToUpdate }: ReturnType<typeof updateProduct>) {
  try {
    yield put(startLoading(LoadingKeys.SAVING_PRODUCT));
    const updatedProduct: ProductDto = yield call(productApi.updateProduct, productToUpdate);
    yield put(closeDialog());
    yield put(notify({ variant: 'success', message: 'products:updateProductSuccess' }));
    yield put(updateProductSuccess(updatedProduct));
  } catch (error) {
    yield put(notify({ variant: 'error', message: 'products:updateProductFailed' }));
  } finally {
    yield put(finishLoading(LoadingKeys.SAVING_PRODUCT));
  }
}

function* deleteProductsSaga({ payload: productIds }: ReturnType<typeof deleteProducts>) {
  try {
    yield call(productApi.deleteProducts, productIds);
    yield put(resetSelection());
    yield put(notify({ variant: 'success', message: 'products:deleteProductSuccess' }));
    yield fork(resetProductsAndFetch);
  } catch (error) {
    yield put(notify({ variant: 'error', message: 'products:deleteProductFailed' }));
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
    yield takeEvery(createProducts.type, createProductsSaga),
    yield takeEvery(updateProduct.type, updateProductSaga),
    yield takeEvery(deleteProducts.type, deleteProductsSaga),
  ]);
}