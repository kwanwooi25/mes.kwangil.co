import { Theme, Typography, createStyles, makeStyles } from '@material-ui/core';

import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
import React from 'react';
import { useTranslation } from 'react-i18next';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    listEmpty: {
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: theme.spacing(8, 4),
    },
    icon: {
      fontSize: theme.typography.h3.fontSize,
    },
  })
);

export interface ListEmptyProps {
  message?: string;
}

const ListEmpty = ({ message }: ListEmptyProps) => {
  const classes = useStyles();
  const { t } = useTranslation('common');

  return (
    <div className={classes.listEmpty}>
      <ErrorOutlineIcon className={classes.icon} color="primary" />
      <Typography variant="body1" component="p" color="primary">
        {message || t('listEmpty')}
      </Typography>
    </div>
  );
};

export default ListEmpty;
