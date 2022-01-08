import CreationFab from 'components/CreationFab';
import AlertDialog from 'components/dialog/Alert';
import ConfirmDialog from 'components/dialog/Confirm';
import ExcelUploadDialog from 'components/dialog/ExcelUpload';
import ProductDialog from 'components/dialog/Product';
import StockDialog from 'components/dialog/Stock';
import EndOfListItem from 'components/EndOfListItem';
import ListEmpty from 'components/ListEmpty';
import Loading from 'components/Loading';
import SelectionPanel from 'components/SelectionPanel';
import SubToolbar from 'components/SubToolbar';
import VirtualInfiniteScroll from 'components/VirtualInfiniteScroll';
import {
  DEFAULT_PRODUCT_FILTER,
  ExcelVariant,
  ProductDialogMode,
  ProductListItemHeight,
} from 'const';
import { useAuth } from 'features/auth/authHook';
import { useDialog } from 'features/dialog/dialogHook';
import { useScreenSize } from 'hooks/useScreenSize';
import { useSelection } from 'hooks/useSelection';
import Layout from 'layouts/Layout';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from 'react-query';
import { BulkCreationResponse } from 'types/api';
import { downloadWorkbook } from 'utils/excel';
import { formatDigit } from 'utils/string';

import { IconButton, List, Tooltip } from '@material-ui/core';
import { Add, DeleteOutline, GetApp, Iso, Publish, Refresh } from '@material-ui/icons';

import { CreateProductsDto, ProductDto, ProductFilter } from './interface';
import ProductListItem from './ProductListItem';
import ProductSearch from './ProductSearch';
import {
  useBulkCreateProductMutation,
  useDeleteProductsMutation,
  useDownloadProducts,
  useInfiniteProducts,
} from './useProducts';

function ProductPage() {
  const { t } = useTranslation('products');
  const [filter, setFilter] = useState<ProductFilter>(DEFAULT_PRODUCT_FILTER);

  const { openDialog, closeDialog } = useDialog();
  const { isMobileLayout, isTabletLayout, isDesktopLayout } = useScreenSize();
  const { canCreateProducts, canUpdateProducts, canDeleteProducts } = useAuth();
  const { isFetching, data, loadMore } = useInfiniteProducts(filter);
  const { isDownloading, download } = useDownloadProducts(filter);

  const products = data?.pages.reduce((p: ProductDto[], { rows }) => [...p, ...rows], []) || [];
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
  // eslint-disable-next-line no-nested-ternary
  const itemHeight = isDesktopLayout
    ? ProductListItemHeight.DESKTOP
    : isTabletLayout
    ? ProductListItemHeight.TABLET
    : ProductListItemHeight.MOBILE;
  const searchResult = t('common:searchResult', {
    count: formatDigit(data?.pages[data.pages.length - 1].count || 0),
  } as any);
  const selectedProducts = products.filter(({ id }) => selectedIds.includes(id));

  const handleClickRefresh = () => queryClient.invalidateQueries('products');

  const handleClickStock = async () =>
    openDialog(<StockDialog products={selectedProducts} onClose={closeDialog} />);

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
  if (canCreateProducts && canUpdateProducts) {
    selectModeButtons.push(
      <Tooltip
        key="create-or-update-stocks"
        title={t('createOrUpdateStock') as string}
        placement="top"
      >
        <IconButton onClick={handleClickStock}>
          <Iso />
        </IconButton>
      </Tooltip>,
    );
  }
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
        showDetails={!isMobileLayout}
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
      {(isTabletLayout || isDesktopLayout) && (
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
      <List style={{ height: isMobileLayout ? '100%' : 'calc(100% - 65px)' }} disablePadding>
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
