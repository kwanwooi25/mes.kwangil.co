import { useAppDispatch } from 'app/store';
import Input from 'ui/elements/Input';
import RoundedButton from 'ui/elements/RoundedButton';
import { useAuth } from 'features/auth/authHook';
import { useUI } from 'features/ui/uiHook';
import { useFormik } from 'formik';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { DEFAULT_PRODUCT_FILTER } from 'const';
import { ProductFilter } from 'features/product/interface';
import { Divider } from '@mui/material';

export interface ProductSearchProps {
  filter: ProductFilter;
  onChange: (filter: ProductFilter) => any;
}

function ProductSearch({ filter, onChange }: ProductSearchProps) {
  const { t } = useTranslation('products');

  const dispatch = useAppDispatch();
  const { closeSearch } = useUI();
  const { canViewAccounts } = useAuth();

  const initialValues = { ...DEFAULT_PRODUCT_FILTER };

  const { values, setValues, handleSubmit, handleChange, handleReset } = useFormik<ProductFilter>({
    initialValues,
    onReset: () => {
      onChange({ ...DEFAULT_PRODUCT_FILTER });
    },
    onSubmit: (submitValues) => {
      onChange({ ...submitValues });
      dispatch(closeSearch());
    },
  });

  useEffect(() => {
    setValues({ ...initialValues, ...filter });
  }, []);

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-6 gap-x-2" noValidate>
      <Input
        className="col-span-6"
        name="accountName"
        label={t('accountName')}
        value={values.accountName}
        onChange={handleChange}
        disabled={!canViewAccounts}
        autoFocus
      />
      <Input
        className="col-span-6"
        name="name"
        label={t('name')}
        value={values.name}
        onChange={handleChange}
        autoFocus={!canViewAccounts}
      />
      <Input
        className="col-span-2"
        name="thickness"
        label={t('thickness')}
        value={values.thickness}
        onChange={handleChange}
      />
      <Input
        className="col-span-2"
        name="length"
        label={t('length')}
        value={values.length}
        onChange={handleChange}
      />
      <Input
        className="col-span-2"
        name="width"
        label={t('width')}
        value={values.width}
        onChange={handleChange}
      />
      <Input
        className="col-span-3"
        name="extColor"
        label={t('extColor')}
        value={values.extColor}
        onChange={handleChange}
      />
      <Input
        className="col-span-3"
        name="printColor"
        label={t('printColor')}
        value={values.printColor}
        onChange={handleChange}
      />
      <Divider className="col-span-6 !my-4" />
      <div className="flex col-span-6 gap-x-4 py-2">
        <RoundedButton fullWidth variant="outlined" size="large" onClick={handleReset}>
          {t('common:reset')}
        </RoundedButton>
        <RoundedButton fullWidth color="primary" size="large" type="submit">
          {t('common:search')}
        </RoundedButton>
      </div>
    </form>
  );
}

export default ProductSearch;
