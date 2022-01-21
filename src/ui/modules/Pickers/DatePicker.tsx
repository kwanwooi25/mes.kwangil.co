import { DATE_FORMAT } from 'const';
import {
  addMonths,
  endOfMonth,
  getDate,
  getDay,
  getMonth,
  getYear,
  isAfter,
  isBefore,
  subMonths,
} from 'date-fns';
import { useScreenSize } from 'hooks/useScreenSize';
import React, { forwardRef, ReactNode, Ref, useEffect, useRef } from 'react';
import ReactDatePicker, { CalendarContainer } from 'react-datepicker';
import { useTranslation } from 'react-i18next';
import Input from 'ui/elements/Input';

import { KeyboardArrowLeft, KeyboardArrowRight } from '@mui/icons-material';
import { IconButton, Paper } from '@mui/material';

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

function CustomCalendarContainer({ children }: { children: ReactNode[] }): ReactNode {
  return (
    <Paper className="p-3 !rounded-xl" elevation={4}>
      <CalendarContainer className="flex flex-col">{children}</CalendarContainer>
    </Paper>
  );
}

function DatePicker({
  className,
  selectedDate,
  onChange,
  label,
  minDate,
  maxDate,
  disablePast,
  disableFuture,
}: DatePickerProps) {
  const { t } = useTranslation('common');
  const { isMobileLayout } = useScreenSize();
  const calendarRef = useRef<ReactDatePicker>(null);

  const minimumDate = disablePast ? new Date() : minDate;
  const maximumDate = disableFuture ? new Date() : maxDate;

  const getDayClassName = (date: Date) => {
    const weekday = getDay(date);
    const classNames = {
      0: 'text-red-500 [aria-disabled="true"]:text-red-200',
      1: '',
      2: '',
      3: '',
      4: '',
      5: '',
      6: 'text-indigo-500 [aria-disabled="true"]:text-indigo-200',
    };
    let dayClassName = classNames[weekday];
    if (getMonth(date) !== getMonth(selectedDate)) {
      dayClassName += ` opacity-20`;
    }
    return dayClassName;
  };

  const handleClickPrevMonth = (decreaseMonth: () => void) => () => {
    decreaseMonth();
    const aMonthBefore = subMonths(selectedDate, 1);
    const date = minimumDate && isBefore(aMonthBefore, minimumDate) ? minimumDate : aMonthBefore;
    onChange(date);
  };
  const handleClickNextMonth = (increaseMonth: () => void) => () => {
    increaseMonth();
    const aMonthAfter = addMonths(selectedDate, 1);
    const date = maximumDate && isAfter(aMonthAfter, maximumDate) ? maximumDate : aMonthAfter;
    onChange(date);
  };

  useEffect(() => {
    const inputContainerEl = document.getElementsByClassName(
      'react-datepicker__input-container',
    )[0];
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
      minDate={minimumDate}
      maxDate={maximumDate}
      dayClassName={getDayClassName}
      weekDayClassName={getDayClassName}
      customInput={<CustomInput label={label} />}
      popperProps={{ positionFixed: true }}
      popperModifiers={{ flip: { behavior: ['right'] } }}
      calendarContainer={CustomCalendarContainer}
      renderCustomHeader={({ date, decreaseMonth, increaseMonth }) => {
        const parsedDate = {
          year: getYear(date),
          month: getMonth(date) + 1,
          date: getDate(date),
        };
        const aMonthBefore = endOfMonth(subMonths(date, 1));
        const aMonthAfter = addMonths(date, 1);
        const prevMonthDisabled = minimumDate && isBefore(aMonthBefore, minimumDate);
        const nextMonthDisabled = maximumDate && isAfter(aMonthAfter, maximumDate);

        return (
          <div className="bg-white">
            <div className="flex justify-between items-center">
              <IconButton
                onClick={handleClickPrevMonth(decreaseMonth)}
                disabled={prevMonthDisabled}
              >
                <KeyboardArrowLeft />
              </IconButton>
              <span className="text-xl">{t('yearMonth', parsedDate)}</span>
              <IconButton
                onClick={handleClickNextMonth(increaseMonth)}
                disabled={nextMonthDisabled}
              >
                <KeyboardArrowRight />
              </IconButton>
            </div>
          </div>
        );
      }}
    />
  );
}

export default DatePicker;
