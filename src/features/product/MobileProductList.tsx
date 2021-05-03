import { DEFAULT_LIST_LIMIT, LoadingKeys, ProductDialogMode, ProductListItemHeight } from 'const';
import { IconButton, List, Theme, createStyles, makeStyles } from '@material-ui/core';
import React, { useEffect } from 'react';
import { productActions, productSelectors } from './productSlice';
import { useAppDispatch, useAppSelector } from 'app/store';

import ConfirmDialog from 'components/dialog/Confirm';
import CreationFab from 'components/CreationFab';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import EndOfListItem from 'components/EndOfListItem';
import ListEmpty from 'components/ListEmpty';
import ProductDialog from 'components/dialog/Product';
import ProductListItem from './ProductListItem';
import SelectionPanel from 'components/SelectionPanel';
import VirtualInfiniteScroll from 'components/VirtualInfiniteScroll';
import { formatDigit } from 'utils/string';
import { useAuth } from 'features/auth/authHook';
import { useDialog } from 'features/dialog/dialogHook';
import { useLoading } from 'features/loading/loadingHook';
import { useTranslation } from 'react-i18next';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    mobileProductList: {
      height: '100%',
    },
  })
);

export interface MobileProductListProps {}

const MobileProductList = (props: MobileProductListProps) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const query = useAppSelector(productSelectors.query);
  const hasMore = useAppSelector(productSelectors.hasMore);
  const totalCount = useAppSelector(productSelectors.totalCount);
  const products = useAppSelector(productSelectors.products);
  const isSelectMode = useAppSelector(productSelectors.isSelectMode);
  const selectedIds = useAppSelector(productSelectors.selectedIds);
  const { getList: getProducts, resetList: resetProducts, resetSelection, deleteProducts } = productActions;
  const dispatch = useAppDispatch();
  const { openDialog, closeDialog } = useDialog();
  const { [LoadingKeys.GET_PRODUCTS]: isLoading } = useLoading();
  const { isUser } = useAuth();

  const itemCount = products.length + 1;
  const itemHeight = ProductListItemHeight.MOBILE;

  const searchResult = t('common:searchResult', { count: formatDigit(totalCount) } as any);

  const loadMore = () => {
    if (hasMore) {
      const offset = (query.offset || 0) + (query.limit || DEFAULT_LIST_LIMIT);
      dispatch(getProducts({ ...query, offset }));
    }
  };

  const handleCloseSelectionPanel = () => {
    dispatch(resetSelection());
  };

  const handleClickDeleteAll = () => {
    openDialog(
      <ConfirmDialog
        title={t('products:deleteProduct')}
        message={t('products:deleteProductsConfirm', { count: selectedIds.length })}
        onClose={(isConfirmed: boolean) => {
          isConfirmed && dispatch(deleteProducts(selectedIds as number[]));
          closeDialog();
        }}
      />
    );
  };

  const openProductDialog = () => {
    openDialog(<ProductDialog mode={ProductDialogMode.CREATE} onClose={closeDialog} />);
  };

  const renderItem = (index: number) => {
    const product = products[index];

    return product ? (
      <ProductListItem
        key={product.id}
        product={product}
        itemHeight={itemHeight}
        isSelected={selectedIds.includes(product.id)}
        showDetails={false}
      />
    ) : (
      <EndOfListItem key="end-of-list" height={itemHeight} isLoading={isLoading} message={searchResult} />
    );
  };

  useEffect(() => {
    dispatch(getProducts({ offset: 0, limit: DEFAULT_LIST_LIMIT }));

    return () => {
      dispatch(resetProducts());
    };
  }, []);

  return (
    <>
      <List className={classes.mobileProductList} disablePadding>
        {!isLoading && !products.length ? (
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

      {!isUser && (
        <>
          <SelectionPanel isOpen={isSelectMode} selectedCount={selectedIds.length} onClose={handleCloseSelectionPanel}>
            <IconButton onClick={handleClickDeleteAll}>
              <DeleteOutlineIcon />
            </IconButton>
          </SelectionPanel>
          <CreationFab show={!isSelectMode} onClick={openProductDialog} />
        </>
      )}
    </>
  );
};

export default MobileProductList;
