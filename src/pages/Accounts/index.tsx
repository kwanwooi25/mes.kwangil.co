import CreationFab from 'components/CreationFab';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import { IconButton } from '@material-ui/core';
import Layout from 'layouts/Layout';
import MobileAccountList from './MobileAccountList';
import PaginatedAccountList from './PaginatedAccountList';
import React from 'react';
import SelectionPanel from 'components/SelectionPanel';
import { useAccounts } from 'features/account/accountHook';
import { useScreenSize } from 'hooks/useScreenSize';
import { useTranslation } from 'react-i18next';

export interface AccountsPageProps {}

const AccountsPage = (props: AccountsPageProps) => {
  const { t } = useTranslation('accounts');
  const { isMobileLayout } = useScreenSize();
  const { isSelectMode, selectedIds, resetSelection } = useAccounts();

  return (
    <Layout pageTitle={t('pageTitle')} SearchPanelContent={<div></div>}>
      {isMobileLayout ? <MobileAccountList /> : <PaginatedAccountList />}

      <SelectionPanel
        isOpen={isMobileLayout && isSelectMode}
        selectedCount={selectedIds.length}
        onClose={resetSelection}
      >
        <IconButton>
          <DeleteOutlineIcon />
        </IconButton>
      </SelectionPanel>
      <CreationFab show={isMobileLayout && !isSelectMode} onClick={() => {}} />
    </Layout>
  );
};

export default AccountsPage;
