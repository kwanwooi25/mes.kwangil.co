import { Checkbox, FormControlLabel } from '@mui/material';
import CustomNumberFormat from 'components/form/CustomNumberFormat';
import Input from 'components/form/Input';
import { PackUnit } from 'const';
import React from 'react';
import { useFormikContext } from 'formik';
import { useTranslation } from 'react-i18next';
import { ProductFormValues } from 'features/product/interface';

function PackagingForm() {
  const { t } = useTranslation('products');
  const { values, handleChange } = useFormikContext<ProductFormValues>();

  return (
    <div className="grid grid-cols-2 gap-x-3 tablet:grid-cols-4">
      <Input
        className="col-span-2"
        name="packMaterial"
        label={t('packMaterial')}
        value={values.packMaterial}
        onChange={handleChange}
      />
      <Input
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
        className="col-span-2 tablet:col-span-1"
        control={
          <Checkbox
            color="primary"
            name="packCanDeliverAll"
            checked={values.packCanDeliverAll}
            onChange={handleChange}
          />
        }
        label={t('packCanDeliverAll') as string}
      />
      <Input
        className="col-span-2 tablet:col-span-4"
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
