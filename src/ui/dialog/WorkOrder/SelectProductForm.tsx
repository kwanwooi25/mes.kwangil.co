import CustomListSubHeader from 'ui/elements/CustomListSubHeader';
import VirtualInfiniteScroll from 'ui/modules/VirtualInfiniteScroll/VirtualInfiniteScroll';
import { ProductDto, ProductFilter } from 'features/product/interface';
import { useProductOptions } from 'features/product/useProducts';
import { useFormikContext } from 'formik';
import React, { ChangeEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { WorkOrderFormValues } from 'features/workOrder/interface';
import Input from 'ui/elements/Input';
import { DEFAULT_PRODUCT_FILTER } from 'const';
import { useScreenSize } from 'hooks/useScreenSize';
import ProductListItem from '../Plate/ProductListItem';

export interface SelectProductFormProps {
  disabled?: boolean;
}

function SelectProductForm({ disabled = false }: SelectProductFormProps) {
  const { t } = useTranslation('workOrders');
  const { isMobileLayout } = useScreenSize();
  const [filter, setFilter] = useState<ProductFilter>(DEFAULT_PRODUCT_FILTER);
  const { productOptions = [] } = useProductOptions(filter);

  const { values, setFieldValue } = useFormikContext<WorkOrderFormValues>();

  const handleChangeFilter = (key: keyof ProductFilter) => (e: ChangeEvent<HTMLInputElement>) => {
    setFilter({ ...filter, [key]: e.target.value });
  };

  const selectProduct = (product: ProductDto) => () => {
    setFieldValue('product', product);
  };

  const removeProduct = () => {
    setFieldValue('product', null);
  };

  const renderProductOptions = (index: number) => {
    const product = productOptions.filter(({ id }) => values?.product?.id !== id)[index];
    return (
      !!product && (
        <ProductListItem key={product.id} product={product} onSelect={selectProduct(product)} />
      )
    );
  };

  return (
    <div className="grid grid-rows-[auto_auto_1fr] gap-2 h-full tablet:grid-cols-2">
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

      {((isMobileLayout && !values.product) || !isMobileLayout) && (
        <>
          <CustomListSubHeader className="tablet:col-start-1 tablet:row-start-2">
            <span>{t('searchedProducts')}</span>
            <span>{productOptions.length}</span>
          </CustomListSubHeader>
          <ul className="h-full tablet:col-start-1 tablet:row-start-3">
            <VirtualInfiniteScroll
              itemCount={productOptions.length}
              itemHeight={98}
              renderItem={renderProductOptions}
            />
          </ul>
        </>
      )}

      {((isMobileLayout && values.product) || !isMobileLayout) && (
        <>
          <CustomListSubHeader className="tablet:col-start-2 tablet:row-start-2">
            <span>{t('selectedProduct')}</span>
          </CustomListSubHeader>
          {values.product && (
            <ProductListItem
              product={values.product}
              onDelete={disabled ? undefined : removeProduct}
            />
          )}
        </>
      )}
    </div>
  );
}

export default SelectProductForm;
