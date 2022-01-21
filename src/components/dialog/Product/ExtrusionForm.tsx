import { Checkbox, FormControlLabel } from '@mui/material';
import Input from 'components/form/Input';
import React from 'react';
import { useFormikContext } from 'formik';
import { useTranslation } from 'react-i18next';
import { ProductFormValues } from 'features/product/interface';

function ExtrusionForm() {
  const { t } = useTranslation('products');
  const { values, touched, errors, handleChange, handleBlur } =
    useFormikContext<ProductFormValues>();

  return (
    <div className="grid grid-cols-[1fr_auto] gap-x-3">
      <Input
        name="extColor"
        label={t('extColor')}
        value={values.extColor}
        onChange={handleChange}
        onBlur={handleBlur}
        error={touched.extColor && Boolean(errors.extColor)}
        helperText={touched.extColor && errors.extColor}
      />
      <FormControlLabel
        control={
          <Checkbox
            color="primary"
            name="extIsAntistatic"
            checked={values.extIsAntistatic}
            onChange={handleChange}
          />
        }
        label={t('extIsAntistatic') as string}
      />
      <Input
        className="col-span-2"
        name="extMemo"
        label={t('extMemo')}
        value={values.extMemo}
        onChange={handleChange}
        multiline
      />
    </div>
  );
}

export default ExtrusionForm;
