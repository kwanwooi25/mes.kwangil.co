import Layout from 'layouts/Layout';
import MobileProductList from './MobileProductList';
import PaginatedProductList from './PaginatedProductList';
import React from 'react';
import { useScreenSize } from 'hooks/useScreenSize';
import { useTranslation } from 'react-i18next';

export interface ProductPageProps {}

const ProductPage = (props: ProductPageProps) => {
  const { t } = useTranslation('products');
  const { isMobileLayout, isPadLayout, isDesktopLayout } = useScreenSize();

  return (
    <Layout
      pageTitle={t('pageTitle')}
      SearchPanelContent={<div></div>}
      searchPanelTitle={`${t('common:product')} ${t('common:search')}`}
    >
      {isMobileLayout && <MobileProductList />}
      {(isPadLayout || isDesktopLayout) && <PaginatedProductList />}
    </Layout>
  );
};

export default ProductPage;
