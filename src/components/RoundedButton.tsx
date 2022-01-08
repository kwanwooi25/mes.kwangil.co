import { Button, ButtonProps } from '@material-ui/core';

import React from 'react';

export interface RoundedButtonProps extends ButtonProps {}

const BORDER_RADIUS = {
  small: 15,
  medium: 18,
  large: 21,
};

function RoundedButton({ children, ...props }: RoundedButtonProps) {
  const borderRadius = BORDER_RADIUS[props.size || 'medium'];

  return (
    <Button style={{ borderRadius }} variant="contained" disableElevation {...props}>
      {children}
    </Button>
  );
}

export default RoundedButton;
