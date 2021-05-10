import { DASHBOARD_CARD_MAX_WIDTH } from 'const';
import React, { ReactElement } from 'react';

import {
    createStyles, IconButton, lighten, makeStyles, Theme, Typography
} from '@material-ui/core';
import RefreshIcon from '@material-ui/icons/Refresh';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      border: `1px solid ${lighten(theme.palette.primary.dark, 0.85)}`,
      borderRadius: theme.spacing(1),
      width: '100%',
      maxWidth: DASHBOARD_CARD_MAX_WIDTH,
    },
    cardHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: theme.spacing(1),
      background: lighten(theme.palette.primary.main, 0.95),
      borderBottom: `1px solid ${lighten(theme.palette.primary.dark, 0.9)}`,
      borderTopLeftRadius: theme.spacing(1),
      borderTopRightRadius: theme.spacing(1),
    },
    cardTitle: {
      display: 'flex',
      alignItems: 'center',
      '& > *': {
        marginRight: theme.spacing(1),
      },
    },
    cardContent: {
      padding: theme.spacing(1),
    },
  })
);

export interface DashboardCardProps {
  title: string;
  onRefresh?: () => void;
  headerButton?: ReactElement;
  children?: ReactElement | ReactElement[];
}

const DashboardCard = ({ title, onRefresh, headerButton, children }: DashboardCardProps) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <div className={classes.cardHeader}>
        <div className={classes.cardTitle}>
          <Typography component="h3" variant="h6">
            {title}
          </Typography>
          {!!onRefresh && (
            <IconButton size="small" onClick={onRefresh}>
              <RefreshIcon />
            </IconButton>
          )}
        </div>
        {headerButton}
      </div>
      <div className={classes.cardContent}>{children}</div>
    </div>
  );
};

export default DashboardCard;
