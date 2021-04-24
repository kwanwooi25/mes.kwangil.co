import { GetProductsQuery, ProductDto } from 'features/product/interface';
import { List, Theme, createStyles, makeStyles } from '@material-ui/core';
import React, { useState } from 'react';

import CustomListSubHeader from 'components/CustomListSubHeader';
import { PlateFormValues } from '.';
import ProductListItem from './ProductListItem';
import SearchInput from 'components/form/SearchInput';
import VirtualInfiniteScroll from 'components/VirtualInfiniteScroll';
import { productApi } from 'features/product/productApi';
import { useFormikContext } from 'formik';
import { useTranslation } from 'react-i18next';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    selectProductsForm: {
      height: `calc(100% - ${theme.spacing(2)}px)`,
      [theme.breakpoints.up('sm')]: {
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gridTemplateRows: 'auto auto 1fr',
        gridTemplateAreas: `
        "productSearch productSearch"
        "searchedListSubheader selectedListSubheader"
        "searchedList selectedList"
        `,
        gridColumnGap: theme.spacing(2),
      },
    },
    productSearch: {
      margin: theme.spacing(0, 0, 2),
      [theme.breakpoints.up('sm')]: {
        gridArea: 'productSearch',
      },
    },
    selectedList: {
      height: '104px',
      [theme.breakpoints.up('sm')]: {
        gridArea: 'selectedList',
        height: 'auto',
      },
    },
    searchedList: {
      height: '104px',
      [theme.breakpoints.up('sm')]: {
        gridArea: 'searchedList',
        height: 'auto',
      },
    },
    selectedListSubHeader: {
      marginBottom: theme.spacing(1),
      [theme.breakpoints.up('sm')]: {
        gridArea: 'selectedListSubheader',
      },
    },
    searchedListSubHeader: {
      marginBottom: theme.spacing(1),
      [theme.breakpoints.up('sm')]: {
        gridArea: 'searchedListSubheader',
      },
    },
  })
);

export interface SelectProductsFormProps {}

const SelectProductsForm = (props: SelectProductsFormProps) => {
  const { t } = useTranslation('plates');
  const classes = useStyles();
  const [productOptions, setProductOptions] = useState<ProductDto[]>([]);

  const { values, setFieldValue, setValues } = useFormikContext<PlateFormValues>();
  const selectedProductIds = values.products.map(({ id }) => id);

  const handleSearchProduct = async (searchText: string) => {
    if (!searchText) {
      return setProductOptions([]);
    }

    const { rows } = await productApi.getAllProducts({ name: searchText } as GetProductsQuery);
    setProductOptions(rows);
  };

  const selectProduct = (product: ProductDto) => () => {
    setFieldValue('products', [...values.products, product]);
  };

  const removeProduct = (product: ProductDto) => () => {
    setValues({
      ...values,
      products: values.products.filter(({ id }) => id !== product.id),
      productsToDisconnect: [...(values.productsToDisconnect = []), product],
    });
  };

  const renderSelectedProduct = (index: number) => {
    const product = values.products[index];
    return <ProductListItem key={product.id} product={product} onDelete={removeProduct(product)} isSelected />;
  };

  const renderProductOptions = (index: number) => {
    const product = productOptions.filter(({ id }) => !selectedProductIds.includes(id))[index];
    return !!product && <ProductListItem key={product.id} product={product} onSelect={selectProduct(product)} />;
  };

  return (
    <div className={classes.selectProductsForm}>
      <SearchInput
        className={classes.productSearch}
        onSearch={handleSearchProduct}
        placeholder={t('products:searchPlaceholder')}
        autoFocus
      />

      <CustomListSubHeader className={classes.selectedListSubHeader}>
        <span>{t('selectedProducts')}</span>
        <span>{values.products.length}</span>
      </CustomListSubHeader>
      <List disablePadding className={classes.selectedList}>
        <VirtualInfiniteScroll itemCount={values.products.length} itemHeight={98} renderItem={renderSelectedProduct} />
      </List>

      <CustomListSubHeader className={classes.searchedListSubHeader}>
        <span>{t('searchedProducts')}</span>
        <span>{productOptions.length}</span>
      </CustomListSubHeader>
      <List disablePadding className={classes.searchedList}>
        <VirtualInfiniteScroll itemCount={productOptions.length} itemHeight={98} renderItem={renderProductOptions} />
      </List>
    </div>
  );
};

export default SelectProductsForm;
