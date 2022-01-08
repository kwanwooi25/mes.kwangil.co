import { Checkbox, FormControlLabel, Theme, createStyles, makeStyles } from '@material-ui/core';

import CustomNumberFormat from 'components/form/CustomNumberFormat';
import Input from 'components/form/Input';
import { PackUnit } from 'const';
import React from 'react';
import { useFormikContext } from 'formik';
import { useTranslation } from 'react-i18next';
import { ProductFormValues } from 'features/product/interface';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    packaging: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gridTemplateAreas: `
        "packMaterial packUnit"
        "packCanDeliverAll packCanDeliverAll"
        "packMemo packMemo"
      `,
      gridColumnGap: theme.spacing(2),
      [theme.breakpoints.up('sm')]: {
        gridTemplateColumns: 'repeat(3, 1fr)',
        gridTemplateAreas: `
          "packMaterial packUnit packCanDeliverAll"
          "packMemo packMemo packMemo"
        `,
      },
    },
    packMaterial: {
      gridArea: 'packMaterial',
    },
    packUnit: {
      gridArea: 'packUnit',
    },
    packCanDeliverAll: {
      gridArea: 'packCanDeliverAll',
    },
    packMemo: {
      gridArea: 'packMemo',
    },
  }),
);

function PackagingForm() {
  const { t } = useTranslation('products');
  const classes = useStyles();
  const { values, handleChange } = useFormikContext<ProductFormValues>();

  return (
    <div className={classes.packaging}>
      <Input
        className={classes.packMaterial}
        name="packMaterial"
        label={t('packMaterial')}
        value={values.packMaterial}
        onChange={handleChange}
      />
      <Input
        className={classes.packUnit}
        name="packUnit"
        label={t('packUnit')}
        value={values.packUnit}
        onChange={handleChange}
        inputProps={{
          suffix: '매씩',
          step: PackUnit.STEP,
          min: PackUnit.MIN,
          max: PackUnit.MAX,
        }}
        // eslint-disable-next-line react/jsx-no-duplicate-props
        InputProps={{
          inputComponent: CustomNumberFormat as any,
        }}
      />
      <FormControlLabel
        className={classes.packCanDeliverAll}
        control={
          <Checkbox
            color="primary"
            name="packCanDeliverAll"
            checked={values.packCanDeliverAll}
            onChange={handleChange}
          />
        }
        label={t('packCanDeliverAll')}
      />
      <Input
        className={classes.packMemo}
        name="packMemo"
        label={t('packMemo')}
        value={values.packMemo}
        onChange={handleChange}
        multiline
      />
    </div>
  );
}

export default PackagingForm;
