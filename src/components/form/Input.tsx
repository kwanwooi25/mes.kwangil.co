import React, { forwardRef } from 'react';
import { TextField, TextFieldProps } from '@material-ui/core';

const Input = forwardRef<HTMLInputElement, TextFieldProps>((props, ref) => {
  return <TextField ref={ref} variant="outlined" margin="normal" fullWidth {...props} />;
});

export default Input;
