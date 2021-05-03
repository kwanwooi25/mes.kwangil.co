import { Checkbox, Divider, FormControlLabel, Theme, createStyles, makeStyles } from '@material-ui/core';
import React, { useEffect } from 'react';
import { addDays, format, subDays, subMonths, subWeeks } from 'date-fns';
import { initialState, workOrderActions, workOrderSelectors } from './workOrderSlice';
import { useAppDispatch, useAppSelector } from 'app/store';

import { BaseQuery } from 'types/api';
import { DATE_FORMAT } from 'const';
import { DatePicker } from 'components/form/Pickers';
import { GetWorkOrdersQuery } from './interface';
import Input from 'components/form/Input';
import RoundedButton from 'components/RoundedButton';
import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import { useUI } from 'features/ui/uiHook';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    workOrderSearch: {
      width: '100%',
    },
    searchDates: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    searchDatesPresets: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gridGap: theme.spacing(1),
      padding: theme.spacing(1, 0),
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

export interface WorkOrderSearchProps {
  onSubmit?: () => void;
  onReset?: () => void;
}

const WorkOrderSearch = ({ onSubmit, onReset }: WorkOrderSearchProps) => {
  const { t } = useTranslation('workOrders');
  const classes = useStyles();

  const dispatch = useAppDispatch();
  const { offset, limit, ...restQuery } = useAppSelector(workOrderSelectors.query);
  const { getList, resetList } = workOrderActions;
  const { closeSearch } = useUI();

  const initialValues = {
    orderedAt: [...initialState.query.orderedAt],
    accountName: '',
    productName: '',
    includeCompleted: false,
  };

  const { values, setFieldValue, setValues, handleSubmit, handleReset, handleChange } = useFormik<
    Omit<GetWorkOrdersQuery, keyof BaseQuery>
  >({
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

  const handleChangeOrderedAtStart = (date: Date) => {
    const startDate = format(date, DATE_FORMAT);
    setFieldValue('orderedAt', [startDate, values.orderedAt[1]]);
  };

  const handleChangeOrderedAtEnd = (date: Date) => {
    const endDate = format(date, DATE_FORMAT);
    setFieldValue('orderedAt', [values.orderedAt[0], endDate]);
  };

  const searchForADay = (date: Date) => {
    const targetDate = format(date, DATE_FORMAT);
    setFieldValue('orderedAt', [targetDate, targetDate]);
  };
  const searchForWeeks = (weeks: number) => () => {
    const today = format(new Date(), DATE_FORMAT);
    const start = format(addDays(subWeeks(new Date(), weeks), 1), DATE_FORMAT);
    setFieldValue('orderedAt', [start, today]);
  };
  const searchForMonths = (months: number) => () => {
    const today = format(new Date(), DATE_FORMAT);
    const start = format(addDays(subMonths(new Date(), months), 1), DATE_FORMAT);
    setFieldValue('orderedAt', [start, today]);
  };
  const searchForYesterday = () => searchForADay(subDays(new Date(), 1));
  const searchForToday = () => searchForADay(new Date());

  useEffect(() => {
    setValues({ ...initialValues, ...restQuery });
  }, []);

  return (
    <form onSubmit={handleSubmit} className={classes.workOrderSearch} noValidate>
      <div className={classes.searchDates}>
        <DatePicker
          selectedDate={new Date(values.orderedAt[0])}
          onChange={handleChangeOrderedAtStart}
          label={t('searchStartDate')}
          maxDate={new Date(values.orderedAt[1])}
        />
        <span style={{ margin: '0 16px' }}>~</span>
        <DatePicker
          selectedDate={new Date(values.orderedAt[1])}
          onChange={handleChangeOrderedAtEnd}
          label={t('searchEndDate')}
          minDate={new Date(values.orderedAt[0])}
        />
      </div>
      <div className={classes.searchDatesPresets}>
        <RoundedButton variant="outlined" onClick={searchForYesterday}>
          {t('common:yesterday')}
        </RoundedButton>
        <RoundedButton variant="outlined" onClick={searchForToday}>
          {t('common:today')}
        </RoundedButton>
        <RoundedButton variant="outlined" onClick={searchForWeeks(1)}>
          {t('common:weeksCount', { weeks: 1 })}
        </RoundedButton>
        <RoundedButton variant="outlined" onClick={searchForWeeks(2)}>
          {t('common:weeksCount', { weeks: 2 })}
        </RoundedButton>
        <RoundedButton variant="outlined" onClick={searchForMonths(1)}>
          {t('common:monthsCount', { months: 1 })}
        </RoundedButton>
        <RoundedButton variant="outlined" onClick={searchForMonths(3)}>
          {t('common:monthsCount', { months: 3 })}
        </RoundedButton>
        <RoundedButton variant="outlined" onClick={searchForMonths(6)}>
          {t('common:monthsCount', { months: 6 })}
        </RoundedButton>
        <RoundedButton variant="outlined" onClick={searchForMonths(12)}>
          {t('common:monthsCount', { months: 12 })}
        </RoundedButton>
      </div>
      <Divider className={classes.divider} />
      <Input name="accountName" label={t('accountName')} value={values.accountName} onChange={handleChange} />
      <Input name="productName" label={t('productName')} value={values.productName} onChange={handleChange} />
      <FormControlLabel
        control={
          <Checkbox color="primary" name="includeCompleted" checked={values.includeCompleted} onChange={handleChange} />
        }
        label={t('includeCompleted')}
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

export default WorkOrderSearch;
