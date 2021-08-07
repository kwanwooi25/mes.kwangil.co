import CustomListSubHeader from 'components/CustomListSubHeader';
import SearchInput from 'components/form/SearchInput';
import VirtualInfiniteScroll from 'components/VirtualInfiniteScroll';
import { ProductDto } from 'features/product/interface';
import { useProductOptions } from 'features/product/useProducts';
import { useFormikContext } from 'formik';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { createStyles, List, makeStyles, Theme } from '@material-ui/core';

import ProductListItem from '../Plate/ProductListItem';
import { WorkOrderFormValues } from './';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    selectProductForm: {
      display: 'grid',
      gridTemplateRows: 'auto auto 1fr',
      gridGap: theme.spacing(1),
      height: `calc(100% - ${theme.spacing(2)}px)`,
    },
    productSearch: {},
    selectedProductHeader: {},
    searchedListHeader: {},
    searchedList: {},
  })
);

export interface SelectProductFormProps {
  disabled?: boolean;
}

const SelectProductForm = ({ disabled = false }: SelectProductFormProps) => {
  const { t } = useTranslation('workOrders');
  const classes = useStyles();

  const [searchText, setSearchText] = useState<string>('');
  const { productOptions = [] } = useProductOptions(searchText);

  const { values, setFieldValue } = useFormikContext<WorkOrderFormValues>();

  const selectProduct = (product: ProductDto) => () => {
    setFieldValue('product', product);
  };

  const removeProduct = () => {
    setFieldValue('product', null);
  };

  const renderProductOptions = (index: number) => {
    const product = productOptions[index];
    return !!product && <ProductListItem key={product.id} product={product} onSelect={selectProduct(product)} />;
  };

  return (
    <div className={classes.selectProductForm}>
      <SearchInput
        className={classes.productSearch}
        onSearch={setSearchText}
        placeholder={t('products:searchPlaceholder')}
        autoFocus
      />

      {!!values.product ? (
        <>
          <CustomListSubHeader className={classes.selectedProductHeader}>
            <span>{t('selectedProduct')}</span>
          </CustomListSubHeader>
          <ProductListItem product={values.product} onDelete={disabled ? undefined : removeProduct} />
        </>
      ) : (
        <>
          <CustomListSubHeader className={classes.searchedListHeader}>
            <span>{t('searchedProducts')}</span>
            <span>{productOptions.length}</span>
          </CustomListSubHeader>
          <List disablePadding className={classes.searchedList}>
            <VirtualInfiniteScroll
              itemCount={productOptions.length}
              itemHeight={98}
              renderItem={renderProductOptions}
            />
          </List>
        </>
      )}
    </div>
  );
};

export default SelectProductForm;
