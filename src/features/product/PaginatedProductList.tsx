import { useAppDispatch, useAppSelector } from 'app/store';
import ConfirmDialog from 'components/dialog/Confirm';
import ExcelUploadDialog from 'components/dialog/ExcelUpload';
import ProductDialog from 'components/dialog/Product';
import ListEmpty from 'components/ListEmpty';
import Loading from 'components/Loading';
import SubToolbar from 'components/SubToolbar';
import {
    DEFAULT_LIST_LIMIT, ExcelVariant, LoadingKeys, ProductDialogMode, ProductListItemHeight
} from 'const';
import { useAuth } from 'features/auth/authHook';
import { useDialog } from 'features/dialog/dialogHook';
import { useLoading } from 'features/loading/loadingHook';
import { useScreenSize } from 'hooks/useScreenSize';
import PaginatedList from 'layouts/PaginatedList';
import React, { ChangeEvent, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { downloadWorkbook } from 'utils/excel';

import { IconButton, Tooltip } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import GetAppIcon from '@material-ui/icons/GetApp';
import PublishIcon from '@material-ui/icons/Publish';

import { CreateProductsDto } from './interface';
import { productApi } from './productApi';
import ProductListItem, { ProductListItemSkeleton } from './ProductListItem';
import { productActions, productSelectors } from './productSlice';

export interface PaginatedProductListProps {}

const PaginatedProductList = (props: PaginatedProductListProps) => {
  const { t } = useTranslation('products');

  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const { [LoadingKeys.GET_PRODUCTS]: isLoading } = useLoading();
  const { windowHeight, isDesktopLayout } = useScreenSize();
  const { openDialog, closeDialog } = useDialog();
  const { isUser } = useAuth();
  const dispatch = useAppDispatch();
  const query = useAppSelector(productSelectors.query);
  const { ids, currentPage, totalPages } = useAppSelector(productSelectors.pagination);
  const products = useAppSelector(productSelectors.paginatedProducts);
  const isSelectMode = useAppSelector(productSelectors.isSelectMode);
  const selectedIds = useAppSelector(productSelectors.selectedIds);
  const {
    getList,
    resetList,
    resetListOnPage,
    resetSelection,
    deleteProducts,
    selectAll,
    unselectAll,
    createProducts,
  } = productActions;

  const itemHeight = isDesktopLayout ? ProductListItemHeight.DESKTOP : ProductListItemHeight.TABLET;
  const isSelectedAll = !!ids.length && !!selectedIds.length && ids.every((id) => selectedIds.includes(id as number));
  const isIndeterminate = !isSelectedAll && ids.some((id) => selectedIds.includes(id as number));

  const handleToggleSelectAll = (checked: boolean) => {
    dispatch(checked ? selectAll(ids as number[]) : unselectAll(ids as number[]));
  };

  const handleResetSelection = () => {
    dispatch(resetSelection());
  };

  const handleChangePage = (e: ChangeEvent<unknown>, value: number) => {
    const limit = query?.limit || DEFAULT_LIST_LIMIT;
    dispatch(resetListOnPage());
    dispatch(getList({ limit, offset: limit * value - limit }));
  };

  const handleClickCreate = () => {
    openDialog(<ProductDialog mode={ProductDialogMode.CREATE} onClose={closeDialog} />);
  };

  const handleClickCreateBulk = () => {
    openDialog(
      <ExcelUploadDialog
        variant={ExcelVariant.PRODUCT}
        onSave={(products: CreateProductsDto[]) => dispatch(createProducts(products))}
        onClose={closeDialog}
      />
    );
  };

  const handleClickDownload = async () => {
    setIsDownloading(true);
    const { rows } = await productApi.getAllProducts(query);
    downloadWorkbook[ExcelVariant.PRODUCT](rows, t('productList'));
    setIsDownloading(false);
  };

  const handleClickDeleteAll = () => {
    openDialog(
      <ConfirmDialog
        title={t('deleteProduct')}
        message={t('deleteProductsConfirm', { count: selectedIds.length })}
        onClose={(isConfirmed: boolean) => {
          isConfirmed && dispatch(deleteProducts(selectedIds as number[]));
          closeDialog();
        }}
      />
    );
  };

  const selectModeButtons = [
    <Tooltip key="delete-all" title={t('common:deleteAll') as string} placement="top">
      <IconButton onClick={handleClickDeleteAll}>
        <DeleteOutlineIcon />
      </IconButton>
    </Tooltip>,
  ];

  const toolBarButtons = [
    <Tooltip key="add-product" title={t('addProduct') as string} placement="top">
      <IconButton onClick={handleClickCreate}>
        <AddIcon />
      </IconButton>
    </Tooltip>,
    <Tooltip key="add-product-bulk" title={t('common:createBulk') as string} placement="top">
      <IconButton onClick={handleClickCreateBulk}>
        <PublishIcon />
      </IconButton>
    </Tooltip>,
    <Tooltip key="download-products" title={t('common:downloadExcel') as string} placement="top">
      <IconButton onClick={handleClickDownload} disabled={isDownloading}>
        {isDownloading && <Loading />}
        <GetAppIcon />
      </IconButton>
    </Tooltip>,
  ];

  useEffect(() => {
    const toolBarCount = isUser ? 1 : 2;
    const containerMaxHeight = windowHeight - (64 * toolBarCount + 56);
    const limit = Math.floor(containerMaxHeight / itemHeight);
    dispatch(getList({ offset: 0, limit }));

    return () => {
      dispatch(resetList());
    };
  }, [windowHeight, itemHeight, isUser]);

  return (
    <>
      {!isUser && (
        <SubToolbar
          isSelectedAll={isSelectedAll}
          isIndeterminate={isIndeterminate}
          onToggleSelectAll={handleToggleSelectAll}
          onResetSelection={handleResetSelection}
          selectedCount={selectedIds.length}
          buttons={isSelectMode ? selectModeButtons : toolBarButtons}
        />
      )}
      <PaginatedList
        height={(query.limit || DEFAULT_LIST_LIMIT) * itemHeight}
        showPagination={!!products.length}
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={handleChangePage}
      >
        {isLoading ? (
          Array(query.limit)
            .fill('')
            .map((_, index) => <ProductListItemSkeleton key={index} itemHeight={itemHeight} showDetails />)
        ) : !products.length ? (
          <ListEmpty />
        ) : (
          products.map((product) => (
            <ProductListItem
              key={product.id}
              product={product}
              itemHeight={itemHeight}
              isSelected={selectedIds.includes(product.id)}
              showDetails
            />
          ))
        )}
      </PaginatedList>
    </>
  );
};

export default PaginatedProductList;
