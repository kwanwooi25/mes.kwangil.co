import classnames from 'classnames';
import React from 'react';

import {
    Button, ButtonGroup, createStyles, makeStyles, Theme, Typography
} from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    customToggleButton: {
      display: 'flex',
      flexDirection: 'column',
    },
    label: {
      padding: theme.spacing(0, 1),
    },
    buttons: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(80px, 1fr))',
    },
  })
);

export interface ToggleButtonOption<T> {
  value: T;
  label: string;
}

export interface CustomToggleButtonProps<T> {
  label?: string;
  value: T;
  onChange: (value: T) => void;
  options: ToggleButtonOption<T>[];
  className?: string;
  size?: 'small' | 'medium' | 'large';
  color?: 'default' | 'inherit' | 'primary' | 'secondary';
  disabled?: boolean;
}

const CustomToggleButton = <T extends string>({
  label,
  value,
  onChange,
  options,
  className,
  size = 'medium',
  color = 'primary',
  disabled = false,
}: CustomToggleButtonProps<T>) => {
  const classes = useStyles();

  return (
    <div className={classnames([classes.customToggleButton, className])}>
      {!!label && (
        <Typography variant="overline" className={classes.label}>
          {label}
        </Typography>
      )}
      <ButtonGroup className={classes.buttons} size={size} color={color}>
        {options.map((option) => (
          <Button
            key={option.value}
            variant={option.value === value ? 'contained' : 'outlined'}
            disableElevation
            onClick={() => onChange(option.value)}
            disabled={disabled}
          >
            {option.label}
          </Button>
        ))}
      </ButtonGroup>
    </div>
  );
};

export default CustomToggleButton;
