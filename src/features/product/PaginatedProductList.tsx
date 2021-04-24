import { DEFAULT_LIST_LIMIT, ExcelVariant, LoadingKeys, ProductDialogMode, ProductListItemHeight } from 'const';
import { IconButton, List, Theme, Tooltip, createStyles, makeStyles } from '@material-ui/core';
import ProductListItem, { ProductListItemSkeleton } from './ProductListItem';
import React, { ChangeEvent, useEffect, useState } from 'react';
import { productActions, productSelectors } from './productSlice';
import { useAppDispatch, useAppSelector } from 'app/store';

import AddIcon from '@material-ui/icons/Add';
import ConfirmDialog from 'components/dialog/Confirm';
import { CreateProductsDto } from './interface';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import ExcelUploadDialog from 'components/dialog/ExcelUpload';
import GetAppIcon from '@material-ui/icons/GetApp';
import ListEmpty from 'components/ListEmpty';
import Loading from 'components/Loading';
import { Pagination } from '@material-ui/lab';
import ProductDialog from 'components/dialog/Product';
import PublishIcon from '@material-ui/icons/Publish';
import SubToolbar from 'components/SubToolbar';
import { downloadWorkbook } from 'utils/excel';
import { productApi } from './productApi';
import { useDialog } from 'features/dialog/dialogHook';
import { useLoading } from 'features/loading/loadingHook';
import { useScreenSize } from 'hooks/useScreenSize';
import { useTranslation } from 'react-i18next';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    listContainer: {
      height: `calc(100vh - ${64 * 2 + 56}px)`,
      marginBottom: 8,
      position: 'relative',
    },
    paginationContainer: {
      display: 'flex',
      justifyContent: 'center',
    },
  })
);

export interface PaginatedProductListProps {}

const PaginatedProductList = (props: PaginatedProductListProps) => {
  const { t } = useTranslation('products');
  const classes = useStyles();

  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const { [LoadingKeys.GET_PRODUCTS]: isLoading } = useLoading();
  const { windowHeight, isDesktopLayout } = useScreenSize();
  const { openDialog, closeDialog } = useDialog();
  const dispatch = useAppDispatch();
  const query = useAppSelector(productSelectors.query);
  const currentPage = useAppSelector(productSelectors.currentPage);
  const totalPages = useAppSelector(productSelectors.totalPages);
  const ids = useAppSelector(productSelectors.ids);
  const products = useAppSelector(productSelectors.products);
  const isSelectMode = useAppSelector(productSelectors.isSelectMode);
  const selectedIds = useAppSelector(productSelectors.selectedIds);
  const {
    getList: getProducts,
    resetList: resetProducts,
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
    dispatch(resetProducts());
    dispatch(getProducts({ limit, offset: limit * value - limit }));
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
          isConfirmed && dispatch(deleteProducts(selectedIds));
          closeDialog();
        }}
      />
    );
  };

  useEffect(() => {
    const containerMaxHeight = windowHeight - (64 * 2 + 56);
    const limit = Math.floor(containerMaxHeight / itemHeight);
    dispatch(getProducts({ offset: 0, limit }));

    return () => {
      dispatch(resetProducts());
    };
  }, [windowHeight, itemHeight]);

  return (
    <>
      <SubToolbar
        isSelectedAll={isSelectedAll}
        isIndeterminate={isIndeterminate}
        onToggleSelectAll={handleToggleSelectAll}
        onResetSelection={handleResetSelection}
        selectedCount={selectedIds.length}
        buttons={
          isSelectMode ? (
            <Tooltip title={t('common:deleteAll') as string} placement="top">
              <IconButton onClick={handleClickDeleteAll}>
                <DeleteOutlineIcon />
              </IconButton>
            </Tooltip>
          ) : (
            [
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
            ]
          )
        }
      />
      <div className={classes.listContainer} style={{ height: (query.limit || DEFAULT_LIST_LIMIT) * itemHeight }}>
        <List disablePadding>
          {isLoading ? (
            Array(query.limit)
              .fill('')
              .map((_, index) => (
                <ProductListItemSkeleton key={index} itemHeight={itemHeight} showDetails={isDesktopLayout} />
              ))
          ) : !products.length ? (
            <ListEmpty />
          ) : (
            products.map((product) => (
              <ProductListItem
                key={product.id}
                product={product}
                itemHeight={itemHeight}
                isSelected={selectedIds.includes(product.id)}
                showDetails={isDesktopLayout}
              />
            ))
          )}
        </List>
      </div>
      <div className={classes.paginationContainer}>
        {!!products.length && (
          <Pagination
            size="large"
            count={totalPages}
            page={currentPage}
            onChange={handleChangePage}
            showFirstButton
            showLastButton
          />
        )}
      </div>
    </>
  );
};

export default PaginatedProductList;
