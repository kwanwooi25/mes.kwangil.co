import Layout from 'layouts/Layout';
import MobilePlateList from './MobilePlateList';
import PaginatedPlateList from './PaginatedPlateList';
import React from 'react';
import { useScreenSize } from 'hooks/useScreenSize';
import { useTranslation } from 'react-i18next';

export interface PlatePageProps {}

const PlatePage = (props: PlatePageProps) => {
  const { t } = useTranslation('plates');
  const { isMobileLayout, isTabletLayout, isDesktopLayout } = useScreenSize();

  return (
    <Layout
      pageTitle={t('pageTitle')}
      // TODO: search panel content
      SearchPanelContent={<div></div>}
      searchPanelTitle={`${t('common:plate')} ${t('common:search')}`}
    >
      {isMobileLayout && <MobilePlateList />}
      {(isTabletLayout || isDesktopLayout) && <PaginatedPlateList />}
    </Layout>
  );
};

export default PlatePage;
