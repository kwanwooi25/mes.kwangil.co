import CustomToggleButton from 'ui/elements/CustomToggleButton';
import Input from 'ui/elements/Input';
import { PlateLength, PlateMaterial, PlateRound } from 'const';
import { useFormikContext } from 'formik';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Divider, List } from '@mui/material';
import { PlateFormValues } from 'features/plate/interface';
import ProductListItem from './ProductListItem';

function PlateInfoForm() {
  const { t } = useTranslation('plates');
  const { values, touched, errors, setFieldValue, handleChange, handleBlur } =
    useFormikContext<PlateFormValues>();

  const materialOptions = Object.values(PlateMaterial).map((value) => ({
    value,
    label: t(value.toLowerCase()),
  }));

  const handleChangeMaterial = (value: PlateMaterial) => {
    setFieldValue('material', value);
  };

  return (
    <div className="grid grid-cols-2 gap-x-3 items-center tablet:grid-cols-4">
      <List className="col-span-2 tablet:col-span-4">
        {values.products.map((product) => (
          <ProductListItem key={product.id} product={product} />
        ))}
        {!!values.products.length && <Divider className="!my-4" />}
      </List>
      <CustomToggleButton
        className="col-span-2"
        value={values.material}
        onChange={handleChangeMaterial}
        options={materialOptions}
      />
      <Input
        className="col-span-2"
        name="name"
        label={t('name')}
        value={values.name}
        onChange={handleChange}
        onBlur={handleBlur}
        error={touched.name && Boolean(errors.name)}
        helperText={touched.name && errors.name}
      />
      <Input
        type="number"
        name="round"
        label={t('round')}
        value={values.round}
        onChange={handleChange}
        onBlur={handleBlur}
        error={touched.round && Boolean(errors.round)}
        helperText={touched.round && errors.round}
        inputProps={{
          step: PlateRound.STEP,
          min: PlateRound.MIN,
          max: PlateRound.MAX,
          onFocus: (e) => {
            e.target.select();
          },
        }}
        autoFocus
      />
      <Input
        type="number"
        name="length"
        label={t('length')}
        value={values.length}
        onChange={handleChange}
        onBlur={handleBlur}
        error={touched.length && Boolean(errors.length)}
        helperText={touched.length && errors.length}
        inputProps={{
          step: PlateLength.STEP,
          min: PlateLength.MIN,
          max: PlateLength.MAX,
          onFocus: (e) => {
            e.target.select();
          },
        }}
      />
      <Input
        className="col-span-2"
        name="location"
        label={t('location')}
        value={values.location}
        onChange={handleChange}
        onBlur={handleBlur}
        error={touched.location && Boolean(errors.location)}
        helperText={touched.location && errors.location}
      />
      <Input
        className="col-span-2 tablet:col-span-4"
        name="memo"
        label={t('memo')}
        value={values.memo}
        onChange={handleChange}
        onBlur={handleBlur}
        error={touched.memo && Boolean(errors.memo)}
        helperText={touched.memo && errors.memo}
        multiline
      />
    </div>
  );
}

export default PlateInfoForm;
