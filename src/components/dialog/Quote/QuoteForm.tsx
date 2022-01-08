/* eslint-disable react/jsx-no-duplicate-props */
import CustomNumberFormat from 'components/form/CustomNumberFormat';
import Input from 'components/form/Input';
import SelectAccount from 'components/form/SelectAccount';
import { ProductLength, ProductThickness, ProductWidth, VariableRate } from 'const';
import { AccountOption } from 'features/account/interface';
import { useFormikContext } from 'formik';
import React, { ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { getPlateCost, getQuote, PlateSizes, QuoteSource } from 'utils/quote';

import { createStyles, makeStyles, Theme } from '@material-ui/core';

import { QuoteFormValues } from 'features/quote/interface';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    quoteForm: {
      display: 'grid',
      gridTemplateColumns: 'repeat(6, 1fr)',
      gridTemplateAreas: `
      "account account account account account account"
      "productName productName productName productName productName productName"
      "thickness thickness length length width width"
      "variableRate variableRate printColorCount printColorCount printCostPerRoll printCostPerRoll"
      "defectiveRate defectiveRate unitPrice unitPrice minQuantity minQuantity"
      "plateRound plateRound plateRound plateLength plateLength plateLength"
      "plateCost plateCost plateCost plateCost plateCount plateCount"
    `,
      gridColumnGap: theme.spacing(1),
      [theme.breakpoints.up('sm')]: {
        gridTemplateAreas: `
        "account account account productName productName productName"
        "thickness length width . variableRate printColorCount"
        "printCostPerRoll printCostPerRoll defectiveRate unitPrice minQuantity minQuantity"
        "plateRound plateLength . plateCost plateCost plateCount"
      `,
      },
    },
    account: { gridArea: 'account' },
    productName: { gridArea: 'productName' },
    thickness: { gridArea: 'thickness' },
    length: { gridArea: 'length' },
    width: { gridArea: 'width' },
    printColorCount: { gridArea: 'printColorCount' },
    variableRate: { gridArea: 'variableRate' },
    printCostPerRoll: { gridArea: 'printCostPerRoll' },
    defectiveRate: { gridArea: 'defectiveRate' },
    plateRound: { gridArea: 'plateRound' },
    plateLength: { gridArea: 'plateLength' },
    unitPrice: { gridArea: 'unitPrice' },
    minQuantity: { gridArea: 'minQuantity' },
    plateCost: { gridArea: 'plateCost' },
    plateCount: { gridArea: 'plateCount' },
  }),
);

function QuoteForm() {
  const { t } = useTranslation('quotes');
  const classes = useStyles();

  const { values, touched, errors, handleChange, handleBlur, setFieldValue } =
    useFormikContext<QuoteFormValues>();

  const handleChangeAccount = (e: ChangeEvent<{}>, value: AccountOption | null) => {
    setFieldValue('account', value);
  };

  const handleChangeInput = (key: keyof QuoteSource) => (e: ChangeEvent<HTMLInputElement>) => {
    handleChange(e);

    const quoteSource = {
      thickness: values.thickness,
      length: values.length,
      width: values.width,
      variableRate: values.variableRate,
      printColorCount: values.printColorCount,
      printCostPerRoll: values.printCostPerRoll,
      defectiveRate: values.defectiveRate,
    };
    const { unitPrice, minQuantity } = getQuote({ ...quoteSource, [key]: e.target.value });
    setFieldValue('unitPrice', unitPrice);
    setFieldValue('minQuantity', minQuantity);
  };

  const handleChangePlateSize = (key: keyof PlateSizes) => (e: ChangeEvent<HTMLInputElement>) => {
    handleChange(e);

    const plateSizes = {
      plateRound: values.plateRound as number,
      plateLength: values.plateLength as number,
    };

    const plateCost = getPlateCost({ ...plateSizes, [key]: e.target.value });
    setFieldValue('plateCost', plateCost);
  };

  return (
    <div className={classes.quoteForm}>
      <SelectAccount
        className={classes.account}
        value={values.account}
        onChange={handleChangeAccount}
        onBlur={handleBlur}
        errorMessage={touched.account ? errors.account : ''}
      />
      <Input
        className={classes.productName}
        name="productName"
        label={t('productName')}
        value={values.productName}
        onChange={handleChange}
        onBlur={handleBlur}
        error={touched.productName && Boolean(errors.productName)}
        helperText={touched.productName && errors.productName}
      />
      <Input
        className={classes.thickness}
        type="number"
        name="thickness"
        label={t('thickness')}
        value={values.thickness}
        onChange={handleChangeInput('thickness')}
        onBlur={handleBlur}
        error={touched.thickness && Boolean(errors.thickness)}
        helperText={touched.thickness && errors.thickness}
        inputProps={{
          step: ProductThickness.STEP,
          min: ProductThickness.MIN,
          max: ProductThickness.MAX,
        }}
      />
      <Input
        className={classes.length}
        type="number"
        name="length"
        label={t('length')}
        value={values.length}
        onChange={handleChangeInput('length')}
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
        onChange={handleChangeInput('width')}
        onBlur={handleBlur}
        error={touched.width && Boolean(errors.width)}
        helperText={touched.width && errors.width}
        inputProps={{ step: ProductWidth.STEP, min: ProductWidth.MIN, max: ProductWidth.MAX }}
      />
      <Input
        className={classes.variableRate}
        name="variableRate"
        label={t('variableRate')}
        value={values.variableRate}
        onChange={handleChangeInput('variableRate')}
        inputProps={{
          suffix: '%',
          step: VariableRate.STEP,
          min: VariableRate.MIN,
          max: VariableRate.MAX,
        }}
        InputProps={{
          inputComponent: CustomNumberFormat as any,
        }}
      />
      <Input
        className={classes.printColorCount}
        type="number"
        name="printColorCount"
        label={t('printColorCount')}
        value={values.printColorCount}
        onChange={handleChangeInput('printColorCount')}
        onBlur={handleBlur}
      />
      <Input
        className={classes.printCostPerRoll}
        name="printCostPerRoll"
        label={t('printCostPerRoll')}
        value={values.printCostPerRoll}
        onChange={handleChangeInput('printCostPerRoll')}
        inputProps={{
          suffix: '원/롤',
        }}
        InputProps={{
          inputComponent: CustomNumberFormat as any,
        }}
      />
      <Input
        className={classes.defectiveRate}
        name="defectiveRate"
        label={t('defectiveRate')}
        value={values.defectiveRate}
        onChange={handleChangeInput('defectiveRate')}
        inputProps={{
          suffix: '%',
        }}
        InputProps={{
          inputComponent: CustomNumberFormat as any,
        }}
      />
      <Input
        className={classes.unitPrice}
        name="unitPrice"
        label={t('unitPrice')}
        value={values.unitPrice}
        onChange={handleChange}
        error={touched.unitPrice && Boolean(errors.unitPrice)}
        helperText={touched.unitPrice && errors.unitPrice}
        inputProps={{
          suffix: '원',
        }}
        InputProps={{
          inputComponent: CustomNumberFormat as any,
        }}
      />
      <Input
        className={classes.minQuantity}
        name="minQuantity"
        label={t('minQuantity')}
        value={values.minQuantity}
        onChange={handleChange}
        error={touched.minQuantity && Boolean(errors.minQuantity)}
        helperText={touched.minQuantity && errors.minQuantity}
        inputProps={{
          suffix: '매',
        }}
        InputProps={{
          inputComponent: CustomNumberFormat as any,
        }}
      />
      <Input
        className={classes.plateRound}
        type="number"
        name="plateRound"
        label={t('plateRound')}
        value={values.plateRound}
        onChange={handleChangePlateSize('plateRound')}
        onBlur={handleBlur}
      />
      <Input
        className={classes.plateLength}
        type="number"
        name="plateLength"
        label={t('plateLength')}
        value={values.plateLength}
        onChange={handleChangePlateSize('plateLength')}
        onBlur={handleBlur}
      />
      <Input
        className={classes.plateCost}
        name="plateCost"
        label={t('plateCost')}
        value={values.plateCost}
        onChange={handleChange}
        inputProps={{
          suffix: '원',
        }}
        InputProps={{
          inputComponent: CustomNumberFormat as any,
        }}
      />
      <Input
        className={classes.plateCount}
        name="plateCount"
        label={t('plateCount')}
        value={values.plateCount}
        onChange={handleChange}
      />
    </div>
  );
}

export default QuoteForm;
