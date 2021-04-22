import React, { ChangeEvent } from 'react';
import classnames from 'classnames';
import { makeStyles, Theme, createStyles, SliderProps, Typography, Slider } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    rangeSlider: {
      padding: theme.spacing(1),
    },
    label: {
      display: 'flex',
      justifyContent: 'space-between',
    },
  })
);

export interface RangeSliderProps extends Omit<SliderProps, 'value' | 'onChange'> {
  className?: string;
  label?: string;
  values?: number[];
  defaultValuesLabel?: string;
  onChange: (newValues: number[]) => void;
  hideValuesDisplay?: boolean;
}

const RangeSlider = ({
  className,
  label,
  values = [],
  onChange,
  hideValuesDisplay = false,
  defaultValuesLabel = '',
  ...props
}: RangeSliderProps) => {
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

  return (
    <div className={classnames([className, classes.rangeSlider])}>
      {label && (
        <div className={classes.label}>
          <Typography variant="subtitle1">{label}</Typography>
          {!hideValuesDisplay && <Typography variant="caption">{getValuesDisplay()}</Typography>}
        </div>
      )}
      <Slider value={values} onChange={handleChange} valueLabelDisplay="auto" {...props} />
    </div>
  );
};

export default RangeSlider;
