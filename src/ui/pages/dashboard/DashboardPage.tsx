import React from 'react';
import { useAuth } from 'features/auth/authHook';
import Layout from 'ui/layouts/Layout';
import { useTranslation } from 'react-i18next';

import DeadlineStatusCard from './DeadlineStatusCard';
import PlateStatusCard from './PlateStatusCard';
import WorkOrderSummaryCard from './WorkOrderSummaryCard';

function DashboardPage() {
  const { t } = useTranslation('dashboard');
  const { canViewWorkOrders } = useAuth();

  return (
    <Layout pageTitle={t('pageTitle')}>
      <div className="grid grid-cols-1 gap-4 justify-start items-start p-4 laptop:grid-cols-2 desktop:grid-cols-3">
        {canViewWorkOrders && (
          <>
            <WorkOrderSummaryCard />
            <DeadlineStatusCard />
            <PlateStatusCard />
          </>
        )}
      </div>
    </Layout>
  );
}

export default DashboardPage;
