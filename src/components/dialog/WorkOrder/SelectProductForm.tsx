import { GetProductsQuery, ProductDto } from 'features/product/interface';
import { List, Theme, createStyles, makeStyles } from '@material-ui/core';
import React, { useState } from 'react';

import CustomListSubHeader from 'components/CustomListSubHeader';
import ProductListItem from '../Plate/ProductListItem';
import SearchInput from 'components/form/SearchInput';
import VirtualInfiniteScroll from 'components/VirtualInfiniteScroll';
import { WorkOrderFormValues } from '.';
import { productApi } from 'features/product/productApi';
import { useFormikContext } from 'formik';
import { useTranslation } from 'react-i18next';

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
  isEditMode?: boolean;
}

const SelectProductForm = ({ isEditMode = false }: SelectProductFormProps) => {
  const { t } = useTranslation('workOrders');
  const classes = useStyles();

  const [productOptions, setProductOptions] = useState<ProductDto[]>([]);
  const { values, setFieldValue } = useFormikContext<WorkOrderFormValues>();

  const handleSearchProduct = async (searchText: string) => {
    if (!searchText) {
      return setProductOptions([]);
    }

    const { rows } = await productApi.getAllProducts({ name: searchText } as GetProductsQuery);
    setProductOptions(rows);
  };

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
        onSearch={handleSearchProduct}
        placeholder={t('products:searchPlaceholder')}
        autoFocus
      />

      {!!values.product ? (
        <>
          <CustomListSubHeader className={classes.selectedProductHeader}>
            <span>{t('selectedProduct')}</span>
          </CustomListSubHeader>
          <ProductListItem product={values.product} onDelete={isEditMode ? undefined : removeProduct} />
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
