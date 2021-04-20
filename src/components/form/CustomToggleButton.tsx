import { Button, ButtonGroup, Theme, Typography, createStyles, makeStyles } from '@material-ui/core';

import React from 'react';
import classnames from 'classnames';

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
}

const CustomToggleButton = <T extends string>({
  label,
  value,
  onChange,
  options,
  className,
  size = 'medium',
  color = 'primary',
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
          >
            {option.label}
          </Button>
        ))}
      </ButtonGroup>
    </div>
  );
};

export default CustomToggleButton;
