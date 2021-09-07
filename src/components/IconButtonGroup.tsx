import classnames from 'classnames';
import React, { forwardRef, ReactElement } from 'react';

import { alpha, createStyles, makeStyles, Theme } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    iconButtonGroup: {
      background: alpha(theme.palette.primary.light, 0.03),
      borderRadius: '24px',
    },
  })
);

export interface IconButtonGroupProps {
  className?: string;
  children?: ReactElement | ReactElement[];
}

const IconButtonGroup = forwardRef(({ children, className }: IconButtonGroupProps, ref: any) => {
  const classes = useStyles();

  return (
    <div ref={ref} className={classnames([className, classes.iconButtonGroup])}>
      {children}
    </div>
  );
});

export default IconButtonGroup;
