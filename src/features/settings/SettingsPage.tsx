import Layout from 'layouts/Layout';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { Typography } from '@material-ui/core';

function SettingsPage() {
  const { t } = useTranslation('settings');

  return (
    <Layout pageTitle={t('pageTitle')}>
      <Typography>설정페이지</Typography>
    </Layout>
  );
}

export default SettingsPage;
