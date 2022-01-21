import { Checkbox, FormControlLabel } from '@mui/material';
import Input from 'components/form/Input';
import { PunchCount } from 'const';
import React from 'react';
import { useFormikContext } from 'formik';
import { useTranslation } from 'react-i18next';
import { ProductFormValues } from 'features/product/interface';

function CuttingForm() {
  const { t } = useTranslation('products');
  const { values, handleChange } = useFormikContext<ProductFormValues>();

  return (
    <div className="tablet:grid tablet:grid-cols-4 tablet:gap-x-3">
      <Input
        className="tablet:col-span-2"
        name="cutPosition"
        label={t('cutPosition')}
        value={values.cutPosition}
        onChange={handleChange}
      />
      <FormControlLabel
        control={
          <Checkbox
            color="primary"
            name="cutIsUltrasonic"
            checked={values.cutIsUltrasonic}
            onChange={handleChange}
          />
        }
        label={t('cutIsUltrasonic') as string}
      />
      <FormControlLabel
        control={
          <Checkbox
            color="primary"
            name="cutIsForPowder"
            checked={values.cutIsForPowder}
            onChange={handleChange}
          />
        }
        label={t('cutIsForPowder') as string}
      />
      <div className="grid grid-cols-[100px_1fr] gap-x-3 tablet:grid-cols-[80px_1fr_2fr] tablet:col-span-4">
        <Input
          type="number"
          name="cutPunchCount"
          label={t('cutPunchCount')}
          value={values.cutPunchCount}
          onChange={handleChange}
          inputProps={{ step: PunchCount.STEP, min: PunchCount.MIN, max: PunchCount.MAX }}
        />
        <Input
          name="cutPunchSize"
          label={t('cutPunchSize')}
          value={values.cutPunchSize}
          onChange={handleChange}
        />
        <Input
          className="col-span-2 tablet:col-span-1"
          name="cutPunchPosition"
          label={t('cutPunchPosition')}
          value={values.cutPunchPosition}
          onChange={handleChange}
        />
      </div>
      <Input
        className="tablet:col-span-4"
        name="cutMemo"
        label={t('cutMemo')}
        value={values.cutMemo}
        onChange={handleChange}
        multiline
      />
    </div>
  );
}

export default CuttingForm;
