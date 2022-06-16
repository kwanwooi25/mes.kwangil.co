import { useAppDispatch } from 'app/store';
import Input from 'ui/elements/Input';
import RangeSlider from 'ui/elements/RangeSlider';
import RoundedButton from 'ui/elements/RoundedButton';
import { PlateLength, PlateRound, DEFAULT_PLATE_FILTER } from 'const';
import { useAuth } from 'features/auth/authHook';
import { useUI } from 'features/ui/uiHook';
import { useFormik } from 'formik';
import { useScreenSize } from 'hooks/useScreenSize';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { PlateFilter } from 'features/plate/interface';
import { Divider } from '@mui/material';

export interface PlateSearchProps {
  filter: PlateFilter;
  onChange: (filter: PlateFilter) => any;
}

function PlateSearch({ filter, onChange }: PlateSearchProps) {
  const { t } = useTranslation('plates');
  const { isDesktopLayout } = useScreenSize();

  const dispatch = useAppDispatch();
  const { closeSearch } = useUI();
  const { canViewAccounts } = useAuth();

  const initialValues = { ...DEFAULT_PLATE_FILTER };

  const { values, setFieldValue, setValues, handleChange, handleSubmit, handleReset } =
    useFormik<PlateFilter>({
      initialValues,
      onReset: () => {
        onChange({ ...DEFAULT_PLATE_FILTER });
      },
      onSubmit: (submitValues) => {
        onChange({ ...submitValues });
        dispatch(closeSearch());
      },
    });

  const handleChangeSlider = (key: keyof PlateFilter) => (newValues: number[]) => {
    setFieldValue(key, [...newValues]);
  };

  useEffect(() => {
    setValues({ ...initialValues, ...filter });
  }, []);

  return (
    <form onSubmit={handleSubmit} className="flex flex-col w-full" noValidate>
      <Input name="id" label={t('id')} value={values.id} onChange={handleChange} />
      <Input name="code" label={t('code')} value={values.code} onChange={handleChange} />
      <Input
        name="accountName"
        label={t('accountName')}
        value={values.accountName}
        onChange={handleChange}
        disabled={!canViewAccounts}
        autoFocus
      />
      <Input
        name="productName"
        label={t('productName')}
        value={values.productName}
        onChange={handleChange}
        autoFocus={!canViewAccounts}
      />
      <Input name="name" label={t('name')} value={values.name} onChange={handleChange} />
      <RangeSlider
        label={t('round')}
        values={[...(values.round as number[])]}
        defaultValuesLabel={t('common:all')}
        onChange={handleChangeSlider('round')}
        min={PlateRound.MIN}
        max={PlateRound.MAX}
        step={PlateRound.STEP}
        showNumberInput={isDesktopLayout}
      />
      <RangeSlider
        label={t('length')}
        values={[...(values.length as number[])]}
        defaultValuesLabel={t('common:all')}
        onChange={handleChangeSlider('length')}
        min={PlateLength.MIN}
        max={PlateLength.MAX}
        step={PlateLength.STEP}
        showNumberInput={isDesktopLayout}
      />
      <Divider className="!my-4" />
      <div className="flex gap-x-4 py-2">
        <RoundedButton fullWidth variant="outlined" size="large" onClick={handleReset}>
          {t('common:reset')}
        </RoundedButton>
        <RoundedButton fullWidth color="primary" size="large" type="submit">
          {t('common:search')}
        </RoundedButton>
      </div>
    </form>
  );
}

export default PlateSearch;
