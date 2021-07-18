import { useAppDispatch } from 'app/store';
import Input from 'components/form/Input';
import RangeSlider from 'components/form/RangeSlider';
import RoundedButton from 'components/RoundedButton';
import { ProductLength, ProductThickness, ProductWidth } from 'const';
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
      gridTemplateColumns: 'repeat(2, 1fr)',
      gridColumnGap: theme.spacing(2),
      gridTemplateAreas: `
        "accountName accountName"
        "productName productName"
        "thickness thickness"
        "length length"
        "width width"
        "extColor printColor"
        "divider divider"
        "buttons buttons"
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
  })
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
  const { isUser } = useAuth();

  const initialValues = { ...DEFAULT_PRODUCT_FILTER };

  const { values, setFieldValue, setValues, handleSubmit, handleChange, handleReset } = useFormik<ProductFilter>({
    initialValues,
    onReset: () => {
      onChange({ ...DEFAULT_PRODUCT_FILTER });
      dispatch(closeSearch());
    },
    onSubmit: (values) => {
      onChange({ ...values });
      dispatch(closeSearch());
    },
  });

  const handleChangeSlider = (key: keyof ProductFilter) => (newValues: number[]) => {
    setFieldValue(key, [...newValues]);
  };

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
        disabled={isUser}
        autoFocus
      />
      <Input
        className={classes.productName}
        name="name"
        label={t('name')}
        value={values.name}
        onChange={handleChange}
        autoFocus={isUser}
      />
      <RangeSlider
        className={classes.thickness}
        label={t('thickness')}
        values={[...(values.thickness as number[])]}
        defaultValuesLabel={t('common:all')}
        onChange={handleChangeSlider('thickness')}
        min={ProductThickness.MIN}
        max={ProductThickness.MAX}
        step={ProductThickness.STEP}
      />
      <RangeSlider
        className={classes.length}
        label={t('length')}
        values={[...(values.length as number[])]}
        defaultValuesLabel={t('common:all')}
        onChange={handleChangeSlider('length')}
        min={ProductLength.MIN}
        max={ProductLength.MAX}
        step={ProductLength.STEP}
      />
      <RangeSlider
        className={classes.width}
        label={t('width')}
        values={[...(values.width as number[])]}
        defaultValuesLabel={t('common:all')}
        onChange={handleChangeSlider('width')}
        min={ProductWidth.MIN}
        max={ProductWidth.MAX}
        step={ProductWidth.STEP}
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
