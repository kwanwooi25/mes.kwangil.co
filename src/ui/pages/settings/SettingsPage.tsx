import React from 'react';
import { useTranslation } from 'react-i18next';
import Layout from 'ui/layouts/Layout';

function SettingsPage() {
  const { t } = useTranslation('settings');

  return (
    <Layout pageTitle={t('pageTitle')}>
      <h1>설정페이지</h1>
    </Layout>
  );
}

export default SettingsPage;
