import Layout from 'layouts/Layout';
import { useTranslation } from 'react-i18next';

import { createStyles, makeStyles, Theme } from '@material-ui/core';

import DeadlineStatusCard from './DeadlineStatusCard';
import WorkOrderSummaryCard from './WorkOrderSummaryCard';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    dashboardCardContainer: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: theme.spacing(1),
      '& > div + div': {
        marginTop: theme.spacing(1),
      },

      [theme.breakpoints.up('md')]: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        '& > div + div': {
          margin: theme.spacing(0, 0, 0, 1),
        },
      },
    },
  })
);

const DashboardPage = () => {
  const { t } = useTranslation('dashboard');
  const classes = useStyles();

  return (
    <Layout pageTitle={t('pageTitle')}>
      <div className={classes.dashboardCardContainer}>
        <WorkOrderSummaryCard />
        <DeadlineStatusCard />
      </div>
    </Layout>
  );
};

export default DashboardPage;
