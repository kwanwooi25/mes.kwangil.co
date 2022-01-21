import classnames from 'classnames';
import React from 'react';

import { Button, ButtonGroup } from '@mui/material';

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
  color?: 'inherit' | 'primary' | 'secondary';
  disabled?: boolean;
}

function CustomToggleButton<T extends string>({
  label,
  value,
  onChange,
  options,
  className,
  size = 'medium',
  color = 'primary',
  disabled = false,
}: CustomToggleButtonProps<T>) {
  return (
    <div className={classnames(['flex flex-col', className])}>
      {!!label && <span className="px-2 text-sm">{label}</span>}
      <ButtonGroup size={size} color={color}>
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
}

export default CustomToggleButton;
