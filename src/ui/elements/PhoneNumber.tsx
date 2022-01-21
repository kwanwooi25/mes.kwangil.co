import { Link } from '@mui/material';
import React, { ReactElement } from 'react';

export interface PhoneNumberProps {
  icon?: ReactElement;
  number: string;
}

function PhoneNumber({ icon, number }: PhoneNumberProps) {
  return (
    <div className="flex items-center text-sm">
      {icon}
      <Link href={`tel:${number}`} underline="hover" color="inherit">
        {number}
      </Link>
    </div>
  );
}

export default PhoneNumber;
