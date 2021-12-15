import { useAppDispatch } from 'app/store';
import Input from 'components/form/Input';
import RangeSlider from 'components/form/RangeSlider';
import RoundedButton from 'components/RoundedButton';
import { PlateLength, PlateRound } from 'const';
import { useAuth } from 'features/auth/authHook';
import { useUI } from 'features/ui/uiHook';
import { useFormik } from 'formik';
import { useScreenSize } from 'hooks/useScreenSize';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { createStyles, Divider, makeStyles, Theme } from '@material-ui/core';

import { PlateFilter } from './interface';
import { DEFAULT_PLATE_FILTER } from './PlatePage';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    plateSearch: {
      width: '100%',
      display: 'grid',
      gridTemplateColumns: '1fr',
      gridTemplateAreas: `
        "accountName"
        "productName"
        "plateName"
        "round"
        "length"
        "divider"
        "buttons"
      `,
    },
    accountName: {
      gridArea: 'accountName',
    },
    productName: {
      gridArea: 'productName',
    },
    plateName: {
      gridArea: 'plateName',
    },
    round: {
      gridArea: 'round',
    },
    length: {
      gridArea: 'length',
    },
    divider: {
      gridArea: 'divider',
      margin: theme.spacing(2, 0),
    },
    buttons: {
      gridArea: 'buttons',
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gridGap: theme.spacing(2),
      padding: theme.spacing(1, 0),
    },
  }),
);

export interface PlateSearchProps {
  filter: PlateFilter;
  onChange: (filter: PlateFilter) => any;
}

const PlateSearch = ({ filter, onChange }: PlateSearchProps) => {
  const { t } = useTranslation('plates');
  const classes = useStyles();
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
      onSubmit: (values) => {
        onChange({ ...values });
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
    <form onSubmit={handleSubmit} className={classes.plateSearch} noValidate>
      <Input
        className={classes.accountName}
        name="accountName"
        label={t('accountName')}
        value={values.accountName}
        onChange={handleChange}
        disabled={!canViewAccounts}
        autoFocus
      />
      <Input
        className={classes.productName}
        name="productName"
        label={t('productName')}
        value={values.productName}
        onChange={handleChange}
        autoFocus={!canViewAccounts}
      />
      <Input
        className={classes.plateName}
        name="name"
        label={t('name')}
        value={values.name}
        onChange={handleChange}
      />
      <RangeSlider
        className={classes.round}
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
        className={classes.length}
        label={t('length')}
        values={[...(values.length as number[])]}
        defaultValuesLabel={t('common:all')}
        onChange={handleChangeSlider('length')}
        min={PlateLength.MIN}
        max={PlateLength.MAX}
        step={PlateLength.STEP}
        showNumberInput={isDesktopLayout}
      />
      <Divider className={classes.divider} />
      <div className={classes.buttons}>
        <RoundedButton fullWidth variant="outlined" size="large" onClick={handleReset}>
          {t('common:reset')}
        </RoundedButton>
        <RoundedButton fullWidth color="primary" size="large" type="submit">
          {t('common:search')}
        </RoundedButton>
      </div>
    </form>
  );
};

export default PlateSearch;
