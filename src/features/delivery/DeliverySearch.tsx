import { useAppDispatch, useAppSelector } from 'app/store';
import CustomToggleButton from 'components/form/CustomToggleButton';
import { DatePicker } from 'components/form/Pickers';
import RoundedButton from 'components/RoundedButton';
import { DeliveryMethod } from 'const';
import { addDays, subDays } from 'date-fns';
import { useUI } from 'features/ui/uiHook';
import { useFormik } from 'formik';
import { capitalize } from 'lodash';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { formatDate } from 'utils/date';

import { createStyles, Divider, makeStyles, Theme } from '@material-ui/core';

import { deliveryActions, deliverySelector, initialState } from './deliverySlice';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    deliverySearch: {
      width: '100%',
    },
    searchDate: {},
    searchDatePresets: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gridGap: theme.spacing(1),
      padding: theme.spacing(1, 0),
    },
    divider: {
      margin: theme.spacing(2, 0),
    },
    buttons: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gridGap: theme.spacing(2),
      padding: theme.spacing(1, 0),
    },
  })
);

export interface DeliverySearchProps {
  onSubmit?: () => void;
  onReset?: () => void;
}

const DeliverySearch = ({ onSubmit, onReset }: DeliverySearchProps) => {
  const { t } = useTranslation('delivery');
  const classes = useStyles();

  const dispatch = useAppDispatch();
  const { offset, limit, ...restQuery } = useAppSelector(deliverySelector.query);
  const { getList, resetList } = deliveryActions;
  const { closeSearch } = useUI();

  const deliveryMethodOptions = Object.values(DeliveryMethod)
    .filter((method) => method !== DeliveryMethod.TBD)
    .map((value) => ({
      value,
      label: t(`workOrders:deliveryMethod${capitalize(value)}`),
    }));

  const initialValues: typeof restQuery = { ...initialState.query };

  const { values, setFieldValue, setValues, handleSubmit, handleReset } = useFormik<typeof restQuery>({
    initialValues,
    onReset: () => {
      dispatch(resetList());
      dispatch(getList({ ...initialState.query, limit, offset: 0 }));
      dispatch(closeSearch());
    },
    onSubmit: (values) => {
      dispatch(resetList());
      dispatch(getList({ ...values, limit, offset: 0 }));
      dispatch(closeSearch());
    },
  });

  const handleChangeDate = (date: Date) => {
    setFieldValue('date', formatDate(date));
  };
  const searchForYesterday = () => handleChangeDate(subDays(new Date(), 1));
  const searchForToday = () => handleChangeDate(new Date());
  const searchForTomorrow = () => handleChangeDate(addDays(new Date(), 1));

  const handleChangeDeliveryMethod = (value: DeliveryMethod) => {
    setFieldValue('method', value);
  };

  useEffect(() => {
    setValues({ ...initialValues, ...restQuery });
  }, []);

  return (
    <form onSubmit={handleSubmit} className={classes.deliverySearch} noValidate>
      <div className={classes.searchDate}>
        <DatePicker
          selectedDate={new Date(values.date as string)}
          onChange={handleChangeDate}
          label={t('deliveryDate')}
        />
      </div>
      <div className={classes.searchDatePresets}>
        <RoundedButton variant="outlined" onClick={searchForYesterday}>
          {t('common:yesterday')}
        </RoundedButton>
        <RoundedButton variant="outlined" onClick={searchForToday}>
          {t('common:today')}
        </RoundedButton>
        <RoundedButton variant="outlined" onClick={searchForTomorrow}>
          {t('common:tomorrow')}
        </RoundedButton>
      </div>
      <CustomToggleButton
        label={t('deliveryMethod')}
        value={values.method as DeliveryMethod}
        onChange={handleChangeDeliveryMethod}
        options={deliveryMethodOptions}
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

export default DeliverySearch;
