import { CheckCircleOutline, HighlightOff } from '@mui/icons-material';
import React from 'react';

export interface BooleanIconProps {
  value: boolean;
  size?: 'medium' | 'inherit' | 'large' | 'small';
}

function BooleanIcon({ value, size = 'medium' }: BooleanIconProps) {
  return value ? (
    <CheckCircleOutline color="success" fontSize={size} />
  ) : (
    <HighlightOff color="error" fontSize={size} />
  );
}

export default BooleanIcon;
