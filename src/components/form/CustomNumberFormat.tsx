import NumberFormat, { NumberFormatProps } from 'react-number-format';

import React from 'react';

interface CustomNumberFormatProps extends NumberFormatProps {
  inputRef: (instance: NumberFormat<HTMLInputElement> | null) => void;
  onChange: (event: { target: { name: string; value: string } }) => void;
  name: string;
}

function CustomNumberFormat(props: CustomNumberFormatProps) {
  const { inputRef, onChange, name, ...other } = props;

  return (
    <NumberFormat
      {...other}
      name={name}
      getInputRef={inputRef}
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
}

export default CustomNumberFormat;
