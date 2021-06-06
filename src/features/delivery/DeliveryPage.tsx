import { useScreenSize } from 'hooks/useScreenSize';
import Layout from 'layouts/Layout';
import React from 'react';
import { useTranslation } from 'react-i18next';

import DeliverySearch from './DeliverySearch';
import MobileDeliveryList from './MobileDeliveryList';
import PaginatedDeliveryList from './PaginatedDeliveryList';

export interface DeliveryPageProps {}

const DeliveryPage = (props: DeliveryPageProps) => {
  const { t } = useTranslation('delivery');
  const { isMobileLayout, isTabletLayout, isDesktopLayout } = useScreenSize();

  return (
    <Layout
      pageTitle={t('pageTitle')}
      SearchPanelContent={<DeliverySearch />}
      searchPanelTitle={`${t('common:delivery')} ${t('common:search')}`}
    >
      {isMobileLayout && <MobileDeliveryList />}
      {(isTabletLayout || isDesktopLayout) && <PaginatedDeliveryList />}
    </Layout>
  );
};

export default DeliveryPage;
