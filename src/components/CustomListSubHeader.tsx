import {
  ListSubheader,
  ListSubheaderProps,
  Theme,
  createStyles,
  lighten,
  makeStyles,
} from '@material-ui/core';

import React from 'react';
import classnames from 'classnames';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    listSubHeader: {
      background: lighten(theme.palette.primary.light, 0.95),
      borderRadius: '24px',
      margin: theme.spacing(1, 0),
      padding: theme.spacing(0, 3),
      display: 'flex',
      justifyContent: 'space-between',
    },
  }),
);

export interface CustomListSubHeaderProps extends ListSubheaderProps {}

function CustomListSubHeader({ className, children, ...props }: CustomListSubHeaderProps) {
  const classes = useStyles();

  return (
    <ListSubheader className={classnames([className, classes.listSubHeader])} {...props}>
      {children}
    </ListSubheader>
  );
}

export default CustomListSubHeader;
