import CreationFab from 'components/CreationFab';
import Layout from 'layouts/Layout';
import MobileAccountList from './MobileAccountList';
import PaginatedAccountList from './PaginatedAccountList';
import React from 'react';
import { useScreenSize } from 'hooks/useScreenSize';
import { useTranslation } from 'react-i18next';

export interface AccountsPageProps {}

const AccountsPage = (props: AccountsPageProps) => {
  const { t } = useTranslation('accounts');
  const { isMobileLayout } = useScreenSize();

  return (
    <Layout pageTitle={t('pageTitle')} SearchPanelContent={<div></div>}>
      {isMobileLayout ? <MobileAccountList /> : <PaginatedAccountList />}
      <CreationFab show={isMobileLayout} onClick={() => {}} />
    </Layout>
  );
};

export default AccountsPage;
