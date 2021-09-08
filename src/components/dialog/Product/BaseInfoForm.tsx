import Input from 'components/form/Input';
import SelectAccount from 'components/form/SelectAccount';
import { ProductLength, ProductThickness, ProductWidth } from 'const';
import { AccountOption } from 'features/account/interface';
import { useFormikContext } from 'formik';
import React, { ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';

import { createStyles, makeStyles, Theme } from '@material-ui/core';

import { ProductFormValues } from './';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    baseInfo: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gridTemplateAreas: `
      "account account account"
      "name name name"
      "thickness length width"
      `,
      gridColumnGap: theme.spacing(2),
      [theme.breakpoints.up('sm')]: {
        gridTemplateColumns: 'repeat(6, 1fr)',
        gridTemplateAreas: `
          "account account account name name name"
          "thickness thickness length length width width"
        `,
      },
    },
    account: {
      gridArea: 'account',
    },
    name: {
      gridArea: 'name',
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
  })
);

export interface BaseInfoFormProps {}

const BaseInfoForm = (props: BaseInfoFormProps) => {
  const classes = useStyles();
  const { t } = useTranslation('products');
  const { values, touched, errors, handleChange, handleBlur, setFieldValue } = useFormikContext<ProductFormValues>();

  const handleChangeAccount = (e: ChangeEvent<{}>, value: AccountOption | null) => {
    setFieldValue('account', value);
  };

  return (
    <div className={classes.baseInfo}>
      <SelectAccount
        className={classes.account}
        value={values.account}
        onChange={handleChangeAccount}
        onBlur={handleBlur}
        errorMessage={touched.account ? errors.account : ''}
      />
      <Input
        className={classes.name}
        name="name"
        label={t('name')}
        value={values.name}
        onChange={handleChange}
        onBlur={handleBlur}
        error={touched.name && Boolean(errors.name)}
        helperText={touched.name && errors.name}
      />
      <Input
        className={classes.thickness}
        type="number"
        name="thickness"
        label={t('thickness')}
        value={values.thickness}
        onChange={handleChange}
        onBlur={handleBlur}
        error={touched.thickness && Boolean(errors.thickness)}
        helperText={touched.thickness && errors.thickness}
        inputProps={{ step: ProductThickness.STEP, min: ProductThickness.MIN, max: ProductThickness.MAX }}
      />
      <Input
        className={classes.length}
        type="number"
        name="length"
        label={t('length')}
        value={values.length}
        onChange={handleChange}
        onBlur={handleBlur}
        error={touched.length && Boolean(errors.length)}
        helperText={touched.length && errors.length}
        inputProps={{ step: ProductLength.STEP, min: ProductLength.MIN, max: ProductLength.MAX }}
      />
      <Input
        className={classes.width}
        type="number"
        name="width"
        label={t('width')}
        value={values.width}
        onChange={handleChange}
        onBlur={handleBlur}
        error={touched.width && Boolean(errors.width)}
        helperText={touched.width && errors.width}
        inputProps={{ step: ProductWidth.STEP, min: ProductWidth.MIN, max: ProductWidth.MAX }}
      />
    </div>
  );
};

export default BaseInfoForm;
