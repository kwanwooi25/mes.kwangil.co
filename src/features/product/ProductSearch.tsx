import { useAppDispatch } from 'app/store';
import Input from 'components/form/Input';
import RoundedButton from 'components/RoundedButton';
import { useAuth } from 'features/auth/authHook';
import { useUI } from 'features/ui/uiHook';
import { useFormik } from 'formik';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { createStyles, Divider, makeStyles, Theme } from '@material-ui/core';

import { ProductFilter } from './interface';
import { DEFAULT_PRODUCT_FILTER } from './ProductPage';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    productSearch: {
      width: '100%',
      display: 'grid',
      gridTemplateColumns: 'repeat(6, 1fr)',
      gridColumnGap: theme.spacing(2),
      gridTemplateAreas: `
        "accountName accountName accountName accountName accountName accountName"
        "productName productName productName productName productName productName"
        "thickness thickness length length width width"
        "extColor extColor extColor printColor printColor printColor"
        "divider divider divider divider divider divider"
        "buttons buttons buttons buttons buttons buttons"
      `,
    },
    accountName: {
      gridArea: 'accountName',
    },
    productName: {
      gridArea: 'productName',
    },
    thickness: {
      gridArea: 'thickness',
    },
    length: {
      gridArea: 'length',
    },
    width: {
      gridArea: 'width',
    },
    extColor: {
      gridArea: 'extColor',
    },
    printColor: {
      gridArea: 'printColor',
    },
    divider: {
      gridArea: 'divider',
      margin: theme.spacing(2, 0),
    },
    buttons: {
      gridArea: 'buttons',
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gridGap: theme.spacing(2),
      padding: theme.spacing(1, 0),
    },
  }),
);

export interface ProductSearchProps {
  filter: ProductFilter;
  onChange: (filter: ProductFilter) => any;
}

const ProductSearch = ({ filter, onChange }: ProductSearchProps) => {
  const { t } = useTranslation('products');
  const classes = useStyles();

  const dispatch = useAppDispatch();
  const { closeSearch } = useUI();
  const { canViewAccounts } = useAuth();

  const initialValues = { ...DEFAULT_PRODUCT_FILTER };

  const { values, setValues, handleSubmit, handleChange, handleReset } = useFormik<ProductFilter>({
    initialValues,
    onReset: () => {
      onChange({ ...DEFAULT_PRODUCT_FILTER });
    },
    onSubmit: (values) => {
      onChange({ ...values });
      dispatch(closeSearch());
    },
  });

  useEffect(() => {
    setValues({ ...initialValues, ...filter });
  }, []);

  return (
    <form onSubmit={handleSubmit} className={classes.productSearch} noValidate>
      <Input
        className={classes.accountName}
        name="accountName"
        label={t('accountName')}
        value={values.accountName}
        onChange={handleChange}
        disabled={!canViewAccounts}
        autoFocus
      />
      <Input
        className={classes.productName}
        name="name"
        label={t('name')}
        value={values.name}
        onChange={handleChange}
        autoFocus={!canViewAccounts}
      />
      <Input
        className={classes.thickness}
        name="thickness"
        label={t('thickness')}
        value={values.thickness}
        onChange={handleChange}
      />
      <Input
        className={classes.length}
        name="length"
        label={t('length')}
        value={values.length}
        onChange={handleChange}
      />
      <Input
        className={classes.width}
        name="width"
        label={t('width')}
        value={values.width}
        onChange={handleChange}
      />
      <Input
        className={classes.extColor}
        name="extColor"
        label={t('extColor')}
        value={values.extColor}
        onChange={handleChange}
      />
      <Input
        className={classes.printColor}
        name="printColor"
        label={t('printColor')}
        value={values.printColor}
        onChange={handleChange}
      />
      <Divider className={classes.divider} />
      <div className={classes.buttons}>
        <RoundedButton fullWidth variant="outlined" size="large" onClick={handleReset}>
          {t('common:reset')}
        </RoundedButton>
        <RoundedButton fullWidth color="primary" size="large" type="submit">
          {t('common:search')}
        </RoundedButton>
      </div>
    </form>
  );
};

export default ProductSearch;
