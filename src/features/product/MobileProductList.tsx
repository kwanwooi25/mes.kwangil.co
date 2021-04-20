import { DEFAULT_LIST_LIMIT, ProductListItemHeight } from 'const';
import { IconButton, List, Theme, createStyles, makeStyles } from '@material-ui/core';
import React, { useEffect } from 'react';

import ConfirmDialog from 'components/dialog/Confirm';
import CreationFab from 'components/CreationFab';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import EndOfListItem from 'components/EndOfListItem';
import ListEmpty from 'components/ListEmpty';
import ProductListItem from './ProductListItem';
import SelectionPanel from 'components/SelectionPanel';
import VirtualInfiniteScroll from 'components/VirtualInfiniteScroll';
import { formatDigit } from 'utils/string';
import { useAppDispatch } from 'app/store';
import { useDialog } from 'features/dialog/dialogHook';
import { useProducts } from './productHook';
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
  const {
    query,
    isLoading,
    hasMore,
    totalCount,
    products,
    getProducts,
    resetProducts,
    isSelectMode,
    selectedIds,
    resetSelection,
    deleteProducts,
  } = useProducts();
  const dispatch = useAppDispatch();
  const { openDialog, closeDialog } = useDialog();

  const itemCount = products.length + 1;
  const itemHeight = ProductListItemHeight.XS;

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
        title={t('products:deleteAccount')}
        message={t('products:deleteProductsConfirm', { count: selectedIds.length })}
        onClose={(isConfirmed: boolean) => {
          isConfirmed && dispatch(deleteProducts(selectedIds));
          closeDialog();
        }}
      />
    );
  };

  const openProductDialog = () => {
    // TODO: open product dialog
    // openDialog();
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
    dispatch(getProducts({ limit: DEFAULT_LIST_LIMIT }));

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
      <SelectionPanel isOpen={isSelectMode} selectedCount={selectedIds.length} onClose={handleCloseSelectionPanel}>
        <IconButton onClick={handleClickDeleteAll}>
          <DeleteOutlineIcon />
        </IconButton>
      </SelectionPanel>
      <CreationFab show={!isSelectMode} onClick={openProductDialog} />
    </>
  );
};

export default MobileProductList;
