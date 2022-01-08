import { Link, Theme, createStyles, makeStyles } from '@material-ui/core';
import React, { ReactElement } from 'react';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    phoneNumber: {
      display: 'flex',
      alignItems: 'center',
      '& a': {
        color: theme.palette.text.primary,
        fontSize: theme.typography.body1.fontSize,
      },
      '& svg + a': {
        marginLeft: theme.spacing(1),
      },
    },
  }),
);

export interface PhoneNumberProps {
  icon?: ReactElement;
  number: string;
}

function PhoneNumber({ icon, number }: PhoneNumberProps) {
  const classes = useStyles();

  return (
    <div className={classes.phoneNumber}>
      {icon}
      <Link href={`tel:${number}`}>{number}</Link>
    </div>
  );
}

export default PhoneNumber;
