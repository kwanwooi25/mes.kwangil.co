import React, { ReactElement, forwardRef } from 'react';
import { Theme, createStyles, fade, makeStyles } from '@material-ui/core';

import classnames from 'classnames';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    iconButtonGroup: {
      background: fade(theme.palette.primary.light, 0.03),
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
