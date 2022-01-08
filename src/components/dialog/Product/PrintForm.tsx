import { PrintColorCount, PrintSide } from 'const';
import { Theme, createStyles, makeStyles } from '@material-ui/core';

import CustomToggleButton from 'components/form/CustomToggleButton';
import Input from 'components/form/Input';
import React from 'react';
import { capitalize } from 'lodash';
import classnames from 'classnames';
import { useFormikContext } from 'formik';
import { useTranslation } from 'react-i18next';
import { ProductFormValues } from 'features/product/interface';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    print: {},
    printSide: {
      padding: theme.spacing(1, 0),
    },
    printFront: {},
    printBack: {},
    printMemo: {},
    printDetail: {
      display: 'grid',
      gridTemplateColumns: '100px 1fr',
      gridTemplateAreas: `
        "printColorCount printColor"
        "printPosition printPosition"
      `,
      gridColumnGap: theme.spacing(2),
      [theme.breakpoints.up('sm')]: {
        gridTemplateColumns: '80px 1fr 2fr',
        gridTemplateAreas: `
          "printColorCount printColor printPosition"
        `,
      },
    },
    printColorCount: {
      gridArea: 'printColorCount',
    },
    printColor: {
      gridArea: 'printColor',
    },
    printPosition: {
      gridArea: 'printPosition',
    },
  }),
);

function PrintForm() {
  const { t } = useTranslation('products');
  const classes = useStyles();
  const { values, handleChange, setFieldValue } = useFormikContext<ProductFormValues>();

  const printSideOptions = Object.values(PrintSide).map((value) => ({
    value,
    label: t(`print${capitalize(value)}`),
  }));

  const handleChangePrintSide = (value: PrintSide) => {
    setFieldValue('printSide', value);
  };

  return (
    <div className={classes.print}>
      <CustomToggleButton
        className={classes.printSide}
        value={values.printSide}
        onChange={handleChangePrintSide}
        options={printSideOptions}
      />
      <div className={classnames([classes.printDetail, classes.printFront])}>
        <Input
          className={classes.printColorCount}
          type="number"
          name="printFrontColorCount"
          label={t('printFrontColorCount')}
          value={values.printFrontColorCount}
          onChange={handleChange}
          inputProps={{
            step: PrintColorCount.STEP,
            min: PrintColorCount.MIN,
            max: PrintColorCount.MAX,
          }}
          disabled={values.printSide === PrintSide.NONE}
        />
        <Input
          className={classes.printColor}
          name="printFrontColor"
          label={t('printFrontColor')}
          value={values.printFrontColor}
          onChange={handleChange}
          disabled={values.printSide === PrintSide.NONE}
        />
        <Input
          className={classes.printPosition}
          name="printFrontPosition"
          label={t('printFrontPosition')}
          value={values.printFrontPosition}
          onChange={handleChange}
          disabled={values.printSide === PrintSide.NONE}
        />
      </div>
      <div className={classnames([classes.printDetail, classes.printBack])}>
        <Input
          className={classes.printColorCount}
          type="number"
          name="printBackColorCount"
          label={t('printBackColorCount')}
          value={values.printBackColorCount}
          onChange={handleChange}
          inputProps={{
            step: PrintColorCount.STEP,
            min: PrintColorCount.MIN,
            max: PrintColorCount.MAX,
          }}
          disabled={values.printSide !== PrintSide.DOUBLE}
        />
        <Input
          className={classes.printColor}
          name="printBackColor"
          label={t('printBackColor')}
          value={values.printBackColor}
          onChange={handleChange}
          disabled={values.printSide !== PrintSide.DOUBLE}
        />
        <Input
          className={classes.printPosition}
          name="printBackPosition"
          label={t('printBackPosition')}
          value={values.printBackPosition}
          onChange={handleChange}
          disabled={values.printSide !== PrintSide.DOUBLE}
        />
      </div>
      <Input
        className={classes.printMemo}
        name="printMemo"
        label={t('printMemo')}
        value={values.printMemo}
        onChange={handleChange}
        disabled={values.printSide === PrintSide.NONE}
        multiline
      />
    </div>
  );
}

export default PrintForm;
