import React from 'react';
import { Button, ButtonProps } from '@mui/material';

export interface RoundedButtonProps extends ButtonProps {}

function RoundedButton({ children, ...props }: RoundedButtonProps) {
  return (
    <Button className="rounded-full" variant="contained" disableElevation {...props}>
      {children}
    </Button>
  );
}

export default RoundedButton;
