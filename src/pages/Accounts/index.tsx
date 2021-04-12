import { Theme, createStyles, makeStyles } from '@material-ui/core';

import AccountList from './AccountList';
import CreationFab from 'components/CreationFab';
import Layout from 'layouts/Layout';
import React from 'react';
import { useTranslation } from 'react-i18next';

const useStyles = makeStyles((theme: Theme) => createStyles({}));

export interface AccountsPageProps {}

const AccountsPage = ({}: AccountsPageProps) => {
  const { t } = useTranslation('accounts');
  const classes = useStyles();

  return (
    <Layout pageTitle={t('pageTitle')}>
      <AccountList />
      <CreationFab show onClick={() => {}} />
    </Layout>
  );
};

export default AccountsPage;
