import { DASHBOARD_CARD_MIN_WIDTH } from 'const';
import Layout from 'layouts/Layout';
import { useTranslation } from 'react-i18next';

import { createStyles, makeStyles, Theme } from '@material-ui/core';

import DeadlineStatusCard from './DeadlineStatusCard';
import PlateStatusCard from './PlateStatusCard';
import WorkOrderSummaryCard from './WorkOrderSummaryCard';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    dashboardCardContainer: {
      display: 'grid',
      gridTemplateColumns: `repeat(auto-fit, minmax(${DASHBOARD_CARD_MIN_WIDTH}px, 1fr))`,
      alignItems: 'start',
      justifyItems: 'start',
      gridAutoFlow: 'dense',
      gridGap: theme.spacing(2),
      padding: theme.spacing(2),
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
        <PlateStatusCard />
      </div>
    </Layout>
  );
};

export default DashboardPage;
