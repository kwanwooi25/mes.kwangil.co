import { useAppDispatch } from 'app/store';
import Input from 'components/form/Input';
import { DatePicker } from 'components/form/Pickers';
import RoundedButton from 'components/RoundedButton';
import { DATE_FORMAT, DEFAULT_WORK_ORDER_FILTER } from 'const';
import { addDays, format, subDays, subMonths, subWeeks } from 'date-fns';
import { useAuth } from 'features/auth/authHook';
import { useUI } from 'features/ui/uiHook';
import { useFormik } from 'formik';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Checkbox, Divider, FormControlLabel } from '@mui/material';
import { WorkOrderFilter } from 'features/workOrder/interface';

export interface WorkOrderSearchProps {
  filter: WorkOrderFilter;
  onChange: (filter: WorkOrderFilter) => any;
}

function WorkOrderSearch({ filter, onChange }: WorkOrderSearchProps) {
  const { t } = useTranslation('workOrders');

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
      onSubmit: (submitValues) => {
        onChange({ ...submitValues });
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
    <form onSubmit={handleSubmit} className="w-full" noValidate>
      <div className="flex justify-between items-center">
        <DatePicker
          selectedDate={new Date(values.orderedAt[0])}
          onChange={handleChangeOrderedAtStart}
          label={t('searchStartDate')}
          maxDate={new Date(values.orderedAt[1])}
        />
        <span className="mx-2">~</span>
        <DatePicker
          selectedDate={new Date(values.orderedAt[1])}
          onChange={handleChangeOrderedAtEnd}
          label={t('searchEndDate')}
          minDate={new Date(values.orderedAt[0])}
        />
      </div>
      <div className="grid grid-cols-4 gap-2 py-2">
        <RoundedButton className="text-xs" variant="outlined" onClick={searchForYesterday}>
          {t('common:yesterday')}
        </RoundedButton>
        <RoundedButton className="text-xs" variant="outlined" onClick={searchForToday}>
          {t('common:today')}
        </RoundedButton>
        <RoundedButton className="text-xs" variant="outlined" onClick={searchForWeeks(1)}>
          {t('common:weeksCount', { weeks: 1 })}
        </RoundedButton>
        <RoundedButton className="text-xs" variant="outlined" onClick={searchForWeeks(2)}>
          {t('common:weeksCount', { weeks: 2 })}
        </RoundedButton>
        <RoundedButton className="text-xs" variant="outlined" onClick={searchForMonths(1)}>
          {t('common:monthsCount', { months: 1 })}
        </RoundedButton>
        <RoundedButton className="text-xs" variant="outlined" onClick={searchForMonths(3)}>
          {t('common:monthsCount', { months: 3 })}
        </RoundedButton>
        <RoundedButton className="text-xs" variant="outlined" onClick={searchForMonths(6)}>
          {t('common:monthsCount', { months: 6 })}
        </RoundedButton>
        <RoundedButton className="text-xs" variant="outlined" onClick={searchForMonths(12)}>
          {t('common:yearsCount', { years: 1 })}
        </RoundedButton>
      </div>
      <Divider className="!my-4" />
      <div className="grid grid-cols-3 gap-x-3">
        <Input
          className="col-span-3"
          name="accountName"
          label={t('accountName')}
          value={values.accountName}
          onChange={handleChange}
          disabled={!canViewAccounts}
        />
        <Input
          className="col-span-3"
          name="productName"
          label={t('productName')}
          value={values.productName}
          onChange={handleChange}
        />
        <Input
          name="thickness"
          label={t('products:thickness')}
          value={values.thickness}
          onChange={handleChange}
        />
        <Input
          name="length"
          label={t('products:length')}
          value={values.length}
          onChange={handleChange}
        />
        <Input
          name="width"
          label={t('products:width')}
          value={values.width}
          onChange={handleChange}
        />
      </div>
      <FormControlLabel
        className="col-span-3"
        control={
          <Checkbox
            color="primary"
            name="includeCompleted"
            checked={values.includeCompleted}
            onChange={handleChange}
          />
        }
        label={t('includeCompleted') as string}
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

export default WorkOrderSearch;
