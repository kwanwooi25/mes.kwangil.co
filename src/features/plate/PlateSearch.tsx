import { Divider, Theme, createStyles, makeStyles } from '@material-ui/core';
import { PlateLength, PlateRound } from 'const';
import React, { useEffect } from 'react';
import { plateActions, plateSelectors } from './plateSlice';
import { useAppDispatch, useAppSelector } from 'app/store';

import { BaseQuery } from 'types/api';
import { GetPlatesQuery } from './interface';
import Input from 'components/form/Input';
import RangeSlider from 'components/form/RangeSlider';
import RoundedButton from 'components/RoundedButton';
import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import { useUI } from 'features/ui/uiHook';

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
  })
);

export interface PlateSearchProps {
  onSubmit?: () => void;
  onReset?: () => void;
}

const PlateSearch = ({ onSubmit, onReset }: PlateSearchProps) => {
  const { t } = useTranslation('plates');
  const classes = useStyles();

  const dispatch = useAppDispatch();
  const { offset, limit, ...restQuery } = useAppSelector(plateSelectors.query);
  const { getList: getPlates, resetList: resetPlates } = plateActions;
  const { closeSearch } = useUI();

  const initialValues = {
    accountName: '',
    productName: '',
    name: '',
    round: [PlateRound.MIN, PlateRound.MAX],
    length: [PlateLength.MIN, PlateLength.MAX],
  };

  const { values, setFieldValue, setValues, handleChange, handleSubmit, handleReset } = useFormik<
    Omit<GetPlatesQuery, keyof BaseQuery>
  >({
    initialValues,
    onReset: () => {
      dispatch(resetPlates());
      dispatch(getPlates({ limit, offset: 0 }));
      dispatch(closeSearch());
    },
    onSubmit: (values) => {
      dispatch(resetPlates());
      dispatch(getPlates({ ...values, limit, offset: 0 }));
      dispatch(closeSearch());
    },
  });

  const handleChangeSlider = (key: keyof GetPlatesQuery) => (newValues: number[]) => {
    setFieldValue(key, newValues);
  };

  useEffect(() => {
    setValues({ ...initialValues, ...restQuery });
  }, []);

  return (
    <form onSubmit={handleSubmit} className={classes.plateSearch} noValidate>
      <Input
        className={classes.accountName}
        name="accountName"
        label={t('accountName')}
        value={values.accountName}
        onChange={handleChange}
        autoFocus
      />
      <Input
        className={classes.productName}
        name="productName"
        label={t('productName')}
        value={values.productName}
        onChange={handleChange}
      />
      <Input className={classes.plateName} name="name" label={t('name')} value={values.name} onChange={handleChange} />
      <RangeSlider
        className={classes.round}
        label={t('round')}
        values={[...(values.round as number[])]}
        defaultValuesLabel={t('common:all')}
        onChange={handleChangeSlider('round')}
        min={PlateRound.MIN}
        max={PlateRound.MAX}
        step={PlateRound.STEP}
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
