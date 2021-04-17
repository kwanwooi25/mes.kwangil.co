import Layout from 'layouts/Layout';
import MobileAccountList from './MobileAccountList';
import PaginatedAccountList from './PaginatedAccountList';
import React from 'react';
import { useScreenSize } from 'hooks/useScreenSize';
import { useTranslation } from 'react-i18next';

export interface AccountPageProps {}

const AccountPage = (props: AccountPageProps) => {
  const { t } = useTranslation('accounts');
  const { isMobileLayout, isPadLayout, isDesktopLayout } = useScreenSize();

  return (
    <Layout pageTitle={t('pageTitle')} SearchPanelContent={<div></div>}>
      {isMobileLayout && <MobileAccountList />}
      {(isPadLayout || isDesktopLayout) && <PaginatedAccountList />}
    </Layout>
  );
};

export default AccountPage;
