import { Checkbox, Divider, FormControlLabel, Theme, createStyles, makeStyles } from '@material-ui/core';
import React, { useEffect } from 'react';
import { format, subDays, subMonths, subWeeks } from 'date-fns';
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
      gridTemplateColumns: 'repeat(5, 1fr)',
      gridColumnGap: theme.spacing(1),
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
  const searchForYesterday = () => searchForADay(subDays(new Date(), 1));
  const searchForToday = () => searchForADay(new Date());
  const searchForTwoWeeks = () => {
    const today = format(new Date(), DATE_FORMAT);
    const twoWeeksBefore = format(subWeeks(new Date(), 2), DATE_FORMAT);
    setFieldValue('orderedAt', [twoWeeksBefore, today]);
  };
  const searchForOneMonth = () => {
    const today = format(new Date(), DATE_FORMAT);
    const oneMonthBefore = format(subMonths(new Date(), 1), DATE_FORMAT);
    setFieldValue('orderedAt', [oneMonthBefore, today]);
  };
  const searchForThreeMonths = () => {
    const today = format(new Date(), DATE_FORMAT);
    const threeMonthsBefore = format(subMonths(new Date(), 3), DATE_FORMAT);
    setFieldValue('orderedAt', [threeMonthsBefore, today]);
  };

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
        <RoundedButton variant="outlined" size="small" onClick={searchForYesterday}>
          {t('common:yesterday')}
        </RoundedButton>
        <RoundedButton variant="outlined" size="small" onClick={searchForToday}>
          {t('common:today')}
        </RoundedButton>
        <RoundedButton variant="outlined" size="small" onClick={searchForTwoWeeks}>
          {t('common:twoWeeks')}
        </RoundedButton>
        <RoundedButton variant="outlined" size="small" onClick={searchForOneMonth}>
          {t('common:oneMonth')}
        </RoundedButton>
        <RoundedButton variant="outlined" size="small" onClick={searchForThreeMonths}>
          {t('common:threeMonths')}
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
