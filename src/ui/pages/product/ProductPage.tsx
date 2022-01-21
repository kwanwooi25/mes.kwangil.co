/* eslint-disable no-nested-ternary */
import {
  DEFAULT_PRODUCT_FILTER,
  ExcelVariant,
  ProductDialogMode,
  ProductListItemHeight,
} from 'const';
import { useAuth } from 'features/auth/authHook';
import { useDialog } from 'features/dialog/dialogHook';
import { CreateProductsDto, ProductDto, ProductFilter } from 'features/product/interface';
import {
  useBulkCreateProductMutation,
  useDeleteProductsMutation,
  useDownloadProducts,
  useInfiniteProducts,
} from 'features/product/useProducts';
import { useScreenSize } from 'hooks/useScreenSize';
import { useSelection } from 'hooks/useSelection';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from 'react-query';
import { BulkCreationResponse } from 'types/api';
import AlertDialog from 'ui/dialog/Alert';
import ConfirmDialog from 'ui/dialog/Confirm';
import ExcelUploadDialog from 'ui/dialog/ExcelUpload';
import ProductDialog from 'ui/dialog/Product';
import CreationFab from 'ui/elements/CreationFab';
import EndOfListItem from 'ui/elements/EndOfListItem';
import ListEmpty from 'ui/elements/ListEmpty';
import Loading from 'ui/elements/Loading';
import SelectionPanel from 'ui/elements/SelectionPanel';
import Layout from 'ui/layouts/Layout';
import SubToolbar from 'ui/layouts/SubToolbar';
import VirtualInfiniteScroll from 'ui/modules/VirtualInfiniteScroll/VirtualInfiniteScroll';
import { downloadWorkbook } from 'utils/excel';
import { formatDigit } from 'utils/string';

import { Add, DeleteOutline, GetApp, Publish, Refresh } from '@mui/icons-material';
import { IconButton, List, Tooltip } from '@mui/material';

import ProductListItem from './ProductListItem';
import ProductSearch from './ProductSearch';

function ProductPage() {
  const { t } = useTranslation('products');
  const [filter, setFilter] = useState<ProductFilter>(DEFAULT_PRODUCT_FILTER);

  const { openDialog, closeDialog } = useDialog();
  const { isMobileLayout, isTabletLayout, isLaptopLayout, isDesktopLayout } = useScreenSize();
  const { canCreateProducts, canDeleteProducts } = useAuth();
  const { isFetching, data, loadMore } = useInfiniteProducts(filter);
  const { isDownloading, download } = useDownloadProducts(filter);

  const products = data?.pages?.reduce((p: ProductDto[], { rows }) => [...p, ...rows], []) || [];
  const productIds = products.map(({ id }) => id);
  const {
    selectedIds,
    isSelectMode,
    isSelectedAll,
    isIndeterminate,
    toggleSelection,
    toggleSelectAll,
    resetSelection,
  } = useSelection(productIds);

  const queryClient = useQueryClient();
  const { createProducts } = useBulkCreateProductMutation({
    queryClient,
    onSettled: ({ createdCount, failedList }: BulkCreationResponse<CreateProductsDto>) => {
      closeDialog();
      openDialog(
        <AlertDialog
          title={t('common:bulkCreationResult')}
          message={`${t('common:success')}: ${createdCount}<br>${t('common:fail')}: ${
            failedList.length
          }`}
          onClose={closeDialog}
        />,
      );
      if (failedList.length) {
        downloadWorkbook[ExcelVariant.PRODUCT](failedList, t('common:bulkCreationResult'));
      }
    },
  });
  const { deleteProducts, isDeleting } = useDeleteProductsMutation({
    queryClient,
    onSuccess: () => resetSelection(),
  });

  const itemCount = products.length + 1;
  const itemHeight = isMobileLayout
    ? ProductListItemHeight.MOBILE
    : isTabletLayout
    ? ProductListItemHeight.TABLET
    : isLaptopLayout
    ? ProductListItemHeight.LAPTOP
    : ProductListItemHeight.DESKTOP;
  const searchResult = t('common:searchResult', {
    count: formatDigit(data?.pages[data.pages.length - 1].count || 0),
  } as any);

  const handleClickRefresh = () => queryClient.invalidateQueries('products');

  const handleClickDeleteAll = () => {
    openDialog(
      <ConfirmDialog
        title={t('deleteProduct')}
        message={t('deleteProductsConfirm', { count: selectedIds.length })}
        onClose={(isConfirmed: boolean) => {
          if (isConfirmed) deleteProducts(selectedIds as number[]);
          closeDialog();
        }}
      />,
    );
  };

  const handleToggleSelection = (product: ProductDto) => toggleSelection(product.id);

  const openProductDialog = () =>
    openDialog(<ProductDialog mode={ProductDialogMode.CREATE} onClose={closeDialog} />);

  const openExcelUploadDialog = () =>
    openDialog(
      <ExcelUploadDialog
        variant={ExcelVariant.PRODUCT}
        onSave={createProducts}
        onClose={closeDialog}
      />,
    );

  const downloadExcel = () => download(t('productList'));

  const selectModeButtons: JSX.Element[] = [];
  if (canDeleteProducts) {
    selectModeButtons.push(
      <Tooltip key="delete-all" title={t('common:deleteAll') as string} placement="top">
        <IconButton onClick={handleClickDeleteAll} disabled={isDeleting}>
          {isDeleting && <Loading />}
          <DeleteOutline />
        </IconButton>
      </Tooltip>,
    );
  }

  const renderItem = (index: number) => {
    const product = products[index];

    return product ? (
      <ProductListItem
        key={product.id}
        product={product}
        itemHeight={itemHeight}
        isSelected={selectedIds.includes(product.id)}
        showDetails={isDesktopLayout}
        filter={filter}
        toggleSelection={handleToggleSelection}
        isSelectable={!!selectModeButtons.length}
      />
    ) : (
      <EndOfListItem
        key="end-of-list"
        height={itemHeight}
        isLoading={isFetching}
        message={searchResult}
      />
    );
  };

  let toolBarButtons: JSX.Element[] = [
    <Tooltip key="refresh" title={t('common:refresh') as string} placement="top">
      <IconButton onClick={handleClickRefresh}>
        <Refresh />
      </IconButton>
    </Tooltip>,
  ];
  if (canCreateProducts) {
    toolBarButtons = [
      ...toolBarButtons,
      <Tooltip key="add-product" title={t('addProduct') as string} placement="top">
        <IconButton onClick={openProductDialog}>
          <Add />
        </IconButton>
      </Tooltip>,
      <Tooltip key="add-product-bulk" title={t('common:createBulk') as string} placement="top">
        <IconButton onClick={openExcelUploadDialog}>
          <Publish />
        </IconButton>
      </Tooltip>,
    ];
  }
  toolBarButtons = [
    ...toolBarButtons,
    <Tooltip key="download-products" title={t('common:downloadExcel') as string} placement="top">
      <span>
        <IconButton onClick={downloadExcel} disabled={isDownloading}>
          {isDownloading && <Loading />}
          <GetApp />
        </IconButton>
      </span>
    </Tooltip>,
  ];

  useEffect(() => {
    resetSelection();
  }, [filter]);

  return (
    <Layout
      pageTitle={t('pageTitle')}
      SearchPanelContent={<ProductSearch filter={filter} onChange={setFilter} />}
      searchPanelTitle={`${t('common:product')} ${t('common:search')}`}
    >
      {!isMobileLayout && (
        <SubToolbar
          isSelectAllDisabled={!selectModeButtons.length}
          isSelectedAll={isSelectedAll}
          isIndeterminate={isIndeterminate}
          onToggleSelectAll={toggleSelectAll}
          onResetSelection={resetSelection}
          selectedCount={selectedIds.length}
          buttons={isSelectMode ? selectModeButtons : toolBarButtons}
        />
      )}
      <List style={{ height: isMobileLayout ? '100%' : 'calc(100% - 49px)' }} disablePadding>
        {!isFetching && !products.length ? (
          <ListEmpty />
        ) : (
          <VirtualInfiniteScroll
            itemCount={itemCount}
            itemHeight={itemHeight}
            renderItem={renderItem}
            onLoadMore={loadMore}
          />
        )}
      </List>
      {isMobileLayout && (
        <>
          {canDeleteProducts && (
            <SelectionPanel
              isOpen={isSelectMode}
              selectedCount={selectedIds.length}
              onClose={resetSelection}
            >
              <IconButton onClick={handleClickDeleteAll}>
                <DeleteOutline />
              </IconButton>
            </SelectionPanel>
          )}
          {canCreateProducts && <CreationFab show={!isSelectMode} onClick={openProductDialog} />}
        </>
      )}
    </Layout>
  );
}

export default ProductPage;
