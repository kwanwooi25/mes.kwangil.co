import React, { forwardRef } from 'react';
import { TextField, TextFieldProps } from '@mui/material';

const Input = forwardRef<HTMLInputElement, TextFieldProps>((props, ref) => (
  <TextField ref={ref} variant="outlined" margin="dense" fullWidth {...props} />
));

export default Input;
