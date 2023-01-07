import { Checkbox, FormControlLabel } from '@mui/material';
import CustomNumberFormat from 'ui/elements/CustomNumberFormat';
import Input from 'ui/elements/Input';
import { DeliveryMethod, PackUnit } from 'const';
import React from 'react';
import { useFormikContext } from 'formik';
import { useTranslation } from 'react-i18next';
import { ProductFormValues } from 'features/product/interface';
import CustomToggleButton from 'ui/elements/CustomToggleButton';

function PackagingForm() {
  const { t } = useTranslation('products');
  const { t: deliveryMethodT } = useTranslation('deliveryMethod');
  const { values, handleChange, setFieldValue } = useFormikContext<ProductFormValues>();

  const deliveryMethodOptions = Object.values(DeliveryMethod).map((value) => ({
    value,
    label: deliveryMethodT(value),
  }));

  const handleChangeDeliveryMethod = (value: DeliveryMethod) => {
    setFieldValue('deliveryMethod', value);
  };

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
        className="col-span-2"
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
      <CustomToggleButton
        className="col-span-2 !py-2"
        label={t('deliveryMethod')}
        value={values.deliveryMethod}
        onChange={handleChangeDeliveryMethod}
        options={deliveryMethodOptions}
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
      <FormControlLabel
        className="col-span-2 tablet:col-span-1"
        control={
          <Checkbox
            color="primary"
            name="shouldKeepRemainder"
            checked={values.shouldKeepRemainder}
            onChange={handleChange}
          />
        }
        label={t('shouldKeepRemainder') as string}
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
