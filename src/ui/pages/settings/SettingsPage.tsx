import Layout from 'ui/layouts/Layout';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { Typography } from '@mui/material';

function SettingsPage() {
  const { t } = useTranslation('settings');

  return (
    <Layout pageTitle={t('pageTitle')}>
      <Typography>설정페이지</Typography>
    </Layout>
  );
}

export default SettingsPage;
