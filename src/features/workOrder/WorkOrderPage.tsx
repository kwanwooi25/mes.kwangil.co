import Layout from 'layouts/Layout';
import MobileWorkOrderList from './MobileWorkOrderList';
import PaginatedWorkOrderList from './PaginatedWorkOrderList';
import React from 'react';
import { useScreenSize } from 'hooks/useScreenSize';
import { useTranslation } from 'react-i18next';

export interface WorkOrderPageProps {}

const WorkOrderPage = (props: WorkOrderPageProps) => {
  const { t } = useTranslation('workOrders');
  const { isMobileLayout, isTabletLayout, isDesktopLayout } = useScreenSize();

  return (
    <Layout
      pageTitle={t('pageTitle')}
      SearchPanelContent={<div></div>}
      searchPanelTitle={`${t('common:workOrder')} ${t('common:search')}`}
    >
      {isMobileLayout && <MobileWorkOrderList />}
      {(isTabletLayout || isDesktopLayout) && <PaginatedWorkOrderList />}
    </Layout>
  );
};

export default WorkOrderPage;
