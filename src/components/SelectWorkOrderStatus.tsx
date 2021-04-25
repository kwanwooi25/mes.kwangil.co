import { FormControl, InputLabel, MenuItem, Select } from '@material-ui/core';
import React, { ChangeEvent } from 'react';

import { WorkOrderStatus } from 'const';

export interface SelectWorkOrderStatusProps {
  className?: string;
  label?: string;
  name?: string;
  value: WorkOrderStatus;
  isNative?: boolean;
  options: { label: string; value: WorkOrderStatus }[];
  onChange: (value: WorkOrderStatus) => void;
}

const SelectWorkOrderStatus = ({
  className,
  label,
  name,
  value,
  isNative = false,
  options,
  onChange,
}: SelectWorkOrderStatusProps) => {
  const handleChange = (e: ChangeEvent<{ name?: string; value: unknown }>) => {
    onChange(e.target.value as WorkOrderStatus);
  };

  const MenuItemComponent = isNative ? 'option' : MenuItem;

  return (
    <FormControl variant="outlined" className={className}>
      {label && <InputLabel>{label}</InputLabel>}
      <Select
        native={isNative}
        value={value}
        onChange={handleChange}
        label={label}
        inputProps={{
          name,
        }}
      >
        {options.map(({ label, value }) => (
          <MenuItemComponent key={value} value={value}>
            {label}
          </MenuItemComponent>
        ))}
      </Select>
    </FormControl>
  );
};

export default SelectWorkOrderStatus;
