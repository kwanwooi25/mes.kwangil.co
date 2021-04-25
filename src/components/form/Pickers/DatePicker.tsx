import { IconButton, Paper, Theme, Typography, createStyles, makeStyles } from '@material-ui/core';
import React, { Ref, forwardRef, useEffect, useRef } from 'react';
import ReactDatePicker, { CalendarContainer } from 'react-datepicker';
import { addMonths, endOfMonth, getDate, getDay, getMonth, getYear, isAfter, isBefore, subMonths } from 'date-fns';
import { indigo, red } from '@material-ui/core/colors';

import { DATE_FORMAT } from 'const';
import Input from '../Input';
import KeyboardArrowLeftIcon from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import { useScreenSize } from 'hooks/useScreenSize';
import { useTranslation } from 'react-i18next';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      borderRadius: theme.spacing(2),
      padding: theme.spacing(2),
      position: 'relative',
    },
    calendarContainer: {
      display: 'flex',
      flexDirection: 'column',
    },
    calendarHeader: {
      background: theme.palette.background.paper,
    },
    selectedDate: {
      background: theme.palette.primary.main,
      color: theme.palette.primary.contrastText,
      padding: theme.spacing(1),
      borderRadius: theme.spacing(2),
      fontWeight: 'bold',
    },
    monthDisplay: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    divider: {
      margin: theme.spacing(0, 0, 2),
    },
    buttonContainer: {
      display: 'flex',
      justifyContent: 'space-between',
    },
    sunday: {
      color: red[500],
      '&.react-datepicker__day--disabled': {
        color: red[200],
      },
    },
    saturday: {
      color: indigo[500],
      '&.react-datepicker__day--disabled': {
        color: indigo[200],
      },
    },
    notThisMonth: {
      opacity: 0.2,
    },
  })
);

export interface DatePickerProps {
  className?: string;
  selectedDate: Date;
  onChange: (date: Date) => void;
  label?: string;
  minDate?: Date;
  maxDate?: Date;
  disablePast?: boolean;
  disableFuture?: boolean;
}

const CustomInput = forwardRef(({ label, value, onClick }: any, ref: Ref<HTMLInputElement>) => (
  <Input ref={ref} onClick={onClick} label={label} value={value} />
));

const DatePicker = ({
  className,
  selectedDate,
  onChange,
  label,
  minDate,
  maxDate,
  disablePast,
  disableFuture,
}: DatePickerProps) => {
  const { t } = useTranslation('common');
  const classes = useStyles();
  const { isMobileLayout } = useScreenSize();
  const calendarRef = useRef<ReactDatePicker>(null);

  minDate = disablePast ? new Date() : minDate;
  maxDate = disableFuture ? new Date() : maxDate;

  const getDayClassName = (date: Date) => {
    const weekday = getDay(date);
    const classNames = {
      0: classes.sunday,
      1: '',
      2: '',
      3: '',
      4: '',
      5: '',
      6: classes.saturday,
    };
    let className = classNames[weekday];
    if (getMonth(date) !== getMonth(selectedDate)) {
      className += ` ${classes.notThisMonth}`;
    }
    return className;
  };

  const handleClickPrevMonth = (decreaseMonth: () => void) => () => {
    decreaseMonth();
    const aMonthBefore = subMonths(selectedDate, 1);
    const date = minDate && isBefore(aMonthBefore, minDate) ? minDate : aMonthBefore;
    onChange(date);
  };
  const handleClickNextMonth = (increaseMonth: () => void) => () => {
    increaseMonth();
    const aMonthAfter = addMonths(selectedDate, 1);
    const date = maxDate && isAfter(aMonthAfter, maxDate) ? maxDate : aMonthAfter;
    onChange(date);
  };

  useEffect(() => {
    const inputContainerEl = document.getElementsByClassName('react-datepicker__input-container')[0];
    const containerEl = inputContainerEl?.parentElement;
    if (containerEl && className) {
      containerEl.className = className;
    }
  }, [isMobileLayout]);

  return (
    <ReactDatePicker
      ref={calendarRef}
      withPortal={isMobileLayout}
      locale="ko"
      dateFormat={DATE_FORMAT}
      selected={selectedDate}
      onChange={onChange}
      minDate={minDate}
      maxDate={maxDate}
      dayClassName={getDayClassName}
      weekDayClassName={getDayClassName}
      customInput={<CustomInput label={label} />}
      calendarContainer={({ children }) => {
        return (
          <Paper className={classes.root} elevation={2}>
            <CalendarContainer className={classes.calendarContainer}>{children}</CalendarContainer>
          </Paper>
        );
      }}
      renderCustomHeader={({ date, decreaseMonth, increaseMonth }) => {
        const parsedDate = {
          year: getYear(date),
          month: getMonth(date) + 1,
          date: getDate(date),
        };
        const aMonthBefore = endOfMonth(subMonths(date, 1));
        const aMonthAfter = addMonths(date, 1);
        const prevMonthDisabled = minDate && isBefore(aMonthBefore, minDate);
        const nextMonthDisabled = maxDate && isAfter(aMonthAfter, maxDate);

        return (
          <div className={classes.calendarHeader}>
            <div className={classes.monthDisplay}>
              <IconButton onClick={handleClickPrevMonth(decreaseMonth)} disabled={prevMonthDisabled}>
                <KeyboardArrowLeftIcon />
              </IconButton>
              <Typography variant="h6">{t('yearMonth', parsedDate)}</Typography>
              <IconButton onClick={handleClickNextMonth(increaseMonth)} disabled={nextMonthDisabled}>
                <KeyboardArrowRightIcon />
              </IconButton>
            </div>
          </div>
        );
      }}
    />
  );
};

export default DatePicker;
