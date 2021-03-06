import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  SelectProps,
} from '@mui/material';
import React from 'react';

import { WorkOrderStatus } from 'const';

export interface SelectWorkOrderStatusProps extends Omit<SelectProps, 'onChange'> {
  className?: string;
  label?: string;
  name?: string;
  value: WorkOrderStatus;
  isNative?: boolean;
  options: { label: string; value: WorkOrderStatus }[];
  onChange: (value: WorkOrderStatus) => void;
}

function SelectWorkOrderStatus({
  className,
  label,
  name,
  value,
  isNative = false,
  options,
  onChange,
  ...props
}: SelectWorkOrderStatusProps) {
  const handleChange = (e: SelectChangeEvent<unknown>) => {
    onChange(e.target.value as WorkOrderStatus);
  };

  const MenuItemComponent = isNative ? 'option' : MenuItem;

  return (
    <FormControl variant="outlined" className={className}>
      {label && <InputLabel>{label}</InputLabel>}
      <Select
        {...props}
        native={isNative}
        value={value}
        onChange={handleChange}
        label={label}
        inputProps={{ name }}
      >
        {options.map((option) => (
          <MenuItemComponent key={option.value} value={option.value}>
            {option.label}
          </MenuItemComponent>
        ))}
      </Select>
    </FormControl>
  );
}

export default SelectWorkOrderStatus;
