import { Divider, Theme, createStyles, makeStyles } from '@material-ui/core';
import React, { useEffect } from 'react';

import { GetProductsQuery } from './interface';
import Input from 'components/form/Input';
import RoundedButton from 'components/RoundedButton';
import { useAppDispatch } from 'app/store';
import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import { useUI } from 'features/ui/uiHook';
import { useProducts } from './productHook';
import { ProductLength, ProductThickness, ProductWidth } from 'const';
import RangeSlider from 'components/form/RangeSlider';

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

export interface ProductSearchProps {}

const ProductSearch = (props: ProductSearchProps) => {
  const { t } = useTranslation('products');
  const classes = useStyles();

  const dispatch = useAppDispatch();
  const {
    query: { offset, limit, ...restQuery },
    resetProducts,
    getProducts,
  } = useProducts();
  const { closeSearch } = useUI();

  const initialValues = {
    accountName: '',
    name: '',
    thickness: [ProductThickness.MIN, ProductThickness.MAX],
    length: [ProductLength.MIN, ProductLength.MAX],
    width: [ProductWidth.MIN, ProductWidth.MAX],
    extColor: '',
    printColor: '',
  };

  const { values, setFieldValue, setValues, handleSubmit, handleChange, handleReset } = useFormik<GetProductsQuery>({
    initialValues,
    onReset: () => {
      dispatch(resetProducts());
      dispatch(getProducts({ limit, offset: 0 }));
      dispatch(closeSearch());
    },
    onSubmit: (values) => {
      dispatch(resetProducts());
      dispatch(getProducts({ ...values, limit, offset: 0 }));
      dispatch(closeSearch());
    },
  });

  const handleChangeSlider = (key: keyof GetProductsQuery) => (newValues: number[]) => {
    setFieldValue(key, [...newValues]);
  };

  useEffect(() => {
    setValues({ ...initialValues, ...restQuery });
  }, []);

  return (
    <form onSubmit={handleSubmit} className={classes.productSearch}>
      <Input
        className={classes.accountName}
        name="accountName"
        label={t('accountName')}
        value={values.accountName}
        onChange={handleChange}
        autoFocus
      />
      <Input
        className={classes.productName}
        name="name"
        label={t('name')}
        value={values.name}
        onChange={handleChange}
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
