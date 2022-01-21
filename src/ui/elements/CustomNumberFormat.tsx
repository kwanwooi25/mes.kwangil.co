import NumberFormat, { NumberFormatProps } from 'react-number-format';
import React, { forwardRef } from 'react';
import { OutlinedInputProps } from '@mui/material';

interface CustomNumberFormatProps extends NumberFormatProps {
  onChange: (event: { target: { name: string; value: string } }) => void;
  name: string;
}

const CustomNumberFormat = forwardRef<NumberFormat<OutlinedInputProps>, CustomNumberFormatProps>(
  (props, ref) => {
    const { onChange, name, ...other } = props;

    return (
      <NumberFormat
        {...other}
        name={name}
        getInputRef={ref}
        onValueChange={({ value }) => {
          onChange({
            target: {
              name,
              value,
            },
          });
        }}
        thousandSeparator
      />
    );
  },
);

export default CustomNumberFormat;
