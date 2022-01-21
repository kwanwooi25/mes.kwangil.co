import CustomListSubHeader from 'ui/elements/CustomListSubHeader';
import VirtualInfiniteScroll from 'ui/modules/VirtualInfiniteScroll/VirtualInfiniteScroll';
import { ProductDto, ProductFilter } from 'features/product/interface';
import { useProductOptions } from 'features/product/useProducts';
import { useFormikContext } from 'formik';
import React, { ChangeEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PlateFormValues } from 'features/plate/interface';
import Input from 'ui/elements/Input';
import { DEFAULT_PRODUCT_FILTER } from 'const';
import ProductListItem from './ProductListItem';

function SelectProductsForm() {
  const { t } = useTranslation('plates');

  const [filter, setFilter] = useState<ProductFilter>(DEFAULT_PRODUCT_FILTER);
  const { productOptions = [] } = useProductOptions(filter);

  const { values, setFieldValue, setValues } = useFormikContext<PlateFormValues>();
  const selectedProductIds = values.products.map(({ id }) => id);

  const handleChangeFilter = (key: keyof ProductFilter) => (e: ChangeEvent<HTMLInputElement>) => {
    setFilter({ ...filter, [key]: e.target.value });
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
    return (
      <ProductListItem
        key={product.id}
        product={product}
        onDelete={removeProduct(product)}
        isSelected
      />
    );
  };

  const renderProductOptions = (index: number) => {
    const product = productOptions.filter(({ id }) => !selectedProductIds.includes(id))[index];
    return (
      !!product && (
        <ProductListItem key={product.id} product={product} onSelect={selectProduct(product)} />
      )
    );
  };

  return (
    <div className="gap-2 h-full tablet:grid tablet:grid-cols-2 tablet:grid-rows-[auto_auto_1fr]">
      <div className="grid grid-cols-3 gap-x-2 tablet:grid-cols-[2fr_2fr_1fr_1fr_1fr] tablet:col-span-2">
        <Input
          className="col-span-3 tablet:col-span-1"
          name="accountName"
          label={t('products:accountName')}
          value={filter.accountName}
          onChange={handleChangeFilter('accountName')}
        />
        <Input
          className="col-span-3 tablet:col-span-1"
          name="name"
          label={t('products:name')}
          value={filter.name}
          onChange={handleChangeFilter('name')}
          autoFocus
        />
        <Input
          name="thickness"
          label={t('products:thickness')}
          value={filter.thickness}
          onChange={handleChangeFilter('thickness')}
        />
        <Input
          name="length"
          label={t('products:length')}
          value={filter.length}
          onChange={handleChangeFilter('length')}
        />
        <Input
          name="width"
          label={t('products:width')}
          value={filter.width}
          onChange={handleChangeFilter('width')}
        />
      </div>

      <CustomListSubHeader className="tablet:col-start-2 tablet:row-start-2">
        <span>{t('selectedProducts')}</span>
        <span>{values.products.length}</span>
      </CustomListSubHeader>
      <ul className="h-[104px] tablet:col-start-2 tablet:row-start-3 tablet:h-full">
        <VirtualInfiniteScroll
          itemCount={values.products.length}
          itemHeight={98}
          renderItem={renderSelectedProduct}
        />
      </ul>

      <CustomListSubHeader className="tablet:col-start-1 tablet:row-start-2">
        <span>{t('searchedProducts')}</span>
        <span>{productOptions.length}</span>
      </CustomListSubHeader>
      <ul className="h-[104px] tablet:col-start-1 tablet:row-start-3 tablet:h-full">
        <VirtualInfiniteScroll
          itemCount={productOptions.length}
          itemHeight={98}
          renderItem={renderProductOptions}
        />
      </ul>
    </div>
  );
}

export default SelectProductsForm;
