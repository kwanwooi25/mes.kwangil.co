import { ListItem, Theme, Typography, createStyles, makeStyles } from '@material-ui/core';
import React, { ReactElement } from 'react';

import BooleanIcon from 'components/BooleanIcon';
import { isBoolean } from 'lodash';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    detailField: {
      display: 'grid',
      gridTemplateColumns: 'minmax(120px, 1fr) 2fr',
      gridGap: theme.spacing(2),
      alignItems: 'start',
      padding: theme.spacing(0.5, 3),
      width: '100%',
    },
    value: {
      whiteSpace: 'pre-wrap',
    },
  }),
);

export interface DetailFieldProps {
  label: string;
  value?: string | number | boolean | ReactElement;
}

function DetailField({ label, value }: DetailFieldProps) {
  const classes = useStyles();

  return (
    <ListItem className={classes.detailField}>
      <Typography component="label" variant="subtitle1">
        {label}
      </Typography>
      {isBoolean(value) ? (
        <BooleanIcon value={value} />
      ) : (
        <Typography className={classes.value} component="span" variant="h6">
          {value}
        </Typography>
      )}
    </ListItem>
  );
}

export default DetailField;
