import classnames from 'classnames';
import React, { ChangeEvent } from 'react';

import {
  createStyles,
  makeStyles,
  Slider,
  SliderProps,
  Theme,
  Typography,
} from '@material-ui/core';

import Input from './Input';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    rangeSlider: {
      padding: theme.spacing(1),
    },
    label: {
      display: 'flex',
      justifyContent: 'space-between',
    },
    numberInputs: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
  }),
);

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
  const classes = useStyles();

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

  const handleChange = (e: ChangeEvent<{}>, newValue: number | number[]) => {
    onChange(newValue as number[]);
  };

  const handleChangeInput = (index: number) => (e: ChangeEvent<HTMLInputElement>) => {
    const newValues = [...values];
    newValues[index] = +e.target.value;
    onChange(newValues);
  };

  return (
    <div className={classnames([className, classes.rangeSlider])}>
      {label && (
        <div className={classes.label}>
          <Typography variant="subtitle1">{label}</Typography>
          {!hideValuesDisplay && <Typography variant="caption">{getValuesDisplay()}</Typography>}
        </div>
      )}
      {showNumberInput && (
        <div className={classes.numberInputs}>
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
