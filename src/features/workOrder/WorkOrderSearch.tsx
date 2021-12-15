import { useAppDispatch } from 'app/store';
import Input from 'components/form/Input';
import { DatePicker } from 'components/form/Pickers';
import RoundedButton from 'components/RoundedButton';
import { DATE_FORMAT } from 'const';
import { addDays, format, subDays, subMonths, subWeeks } from 'date-fns';
import { useAuth } from 'features/auth/authHook';
import { useUI } from 'features/ui/uiHook';
import { useFormik } from 'formik';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import {
  Checkbox,
  createStyles,
  Divider,
  FormControlLabel,
  makeStyles,
  Theme,
} from '@material-ui/core';

import { WorkOrderFilter } from './interface';
import { DEFAULT_WORK_ORDER_FILTER } from './WorkOrderPage';

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
    searchInputs: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gridColumnGap: theme.spacing(2),
      gridTemplateAreas: `
        "accountName accountName accountName"
        "productName productName productName"
        "thickness length width"
      `,
      '& > .accountName': { gridArea: 'accountName' },
      '& > .productName': { gridArea: 'productName' },
      '& > .thickness': { gridArea: 'thickness' },
      '& > .length': { gridArea: 'length' },
      '& > .width': { gridArea: 'width' },
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

export interface WorkOrderSearchProps {
  filter: WorkOrderFilter;
  onChange: (filter: WorkOrderFilter) => any;
}

const WorkOrderSearch = ({ filter, onChange }: WorkOrderSearchProps) => {
  const { t } = useTranslation('workOrders');
  const classes = useStyles();

  const dispatch = useAppDispatch();
  const { closeSearch } = useUI();
  const { canViewAccounts } = useAuth();

  const initialValues = { ...DEFAULT_WORK_ORDER_FILTER };

  const { values, setFieldValue, setValues, handleSubmit, handleReset, handleChange } =
    useFormik<WorkOrderFilter>({
      initialValues,
      onReset: () => {
        onChange({ ...DEFAULT_WORK_ORDER_FILTER });
      },
      onSubmit: (values) => {
        onChange({ ...values });
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
    setValues({ ...initialValues, ...filter });
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
          {t('common:yearsCount', { years: 1 })}
        </RoundedButton>
      </div>
      <Divider className={classes.divider} />
      <div className={classes.searchInputs}>
        <Input
          className="accountName"
          name="accountName"
          label={t('accountName')}
          value={values.accountName}
          onChange={handleChange}
          disabled={!canViewAccounts}
        />
        <Input
          className="productName"
          name="productName"
          label={t('productName')}
          value={values.productName}
          onChange={handleChange}
        />
        <Input
          className="thickness"
          name="thickness"
          label={t('products:thickness')}
          value={values.thickness}
          onChange={handleChange}
        />
        <Input
          className="length"
          name="length"
          label={t('products:length')}
          value={values.length}
          onChange={handleChange}
        />
        <Input
          className="width"
          name="width"
          label={t('products:width')}
          value={values.width}
          onChange={handleChange}
        />
      </div>
      <FormControlLabel
        control={
          <Checkbox
            color="primary"
            name="includeCompleted"
            checked={values.includeCompleted}
            onChange={handleChange}
          />
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
