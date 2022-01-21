import classnames from 'classnames';
import React, { ChangeEvent } from 'react';
import { Slider, SliderProps } from '@mui/material';
import Input from './Input';

export interface RangeSliderProps extends Omit<SliderProps, 'value' | 'onChange'> {
  className?: string;
  label?: string;
  values?: number[];
  defaultValuesLabel?: string;
  onChange: (newValues: number[]) => void;
  hideValuesDisplay?: boolean;
  showNumberInput?: boolean;
}

function RangeSlider({
  className,
  label,
  values = [],
  onChange,
  hideValuesDisplay = false,
  defaultValuesLabel = '',
  showNumberInput = false,
  ...props
}: RangeSliderProps) {
  const getValuesDisplay = () => {
    if (!values || !props.min || !props.max) {
      return '';
    }
    const [min, max] = values;
    if (min <= props.min && max >= props.max) {
      return defaultValuesLabel;
    }
    return `${min} ~ ${max}`;
  };

  const handleChange = (e: Event, newValue: number | number[]) => {
    onChange(newValue as number[]);
  };

  const handleChangeInput = (index: number) => (e: ChangeEvent<HTMLInputElement>) => {
    const newValues = [...values];
    newValues[index] = +e.target.value;
    onChange(newValues);
  };

  return (
    <div className={classnames('p-2', className)}>
      {label && (
        <div className="flex justify-between">
          <span>{label}</span>
          {!hideValuesDisplay && <span className="text-xs">{getValuesDisplay()}</span>}
        </div>
      )}
      {showNumberInput && (
        <div className="flex justify-between items-center">
          <Input
            type="number"
            value={values[0]}
            onChange={handleChangeInput(0)}
            inputProps={{ step: props.step, min: props.min, max: props.max }}
            size="small"
            margin="dense"
          />
          <span style={{ margin: '0 8px' }}>~</span>
          <Input
            type="number"
            value={values[1]}
            onChange={handleChangeInput(1)}
            inputProps={{ step: props.step, min: props.min, max: props.max }}
            size="small"
            margin="dense"
          />
        </div>
      )}
      <Slider value={values} onChange={handleChange} valueLabelDisplay="auto" {...props} />
    </div>
  );
}

export default RangeSlider;
