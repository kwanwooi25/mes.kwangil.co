import AccountDialog from 'components/dialog/Account';
import CreationFab from 'components/CreationFab';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import { IconButton } from '@material-ui/core';
import Layout from 'layouts/Layout';
import MobileAccountList from './MobileAccountList';
import PaginatedAccountList from './PaginatedAccountList';
import React from 'react';
import SelectionPanel from 'components/SelectionPanel';
import { useAccounts } from 'features/account/accountHook';
import { useAppDispatch } from 'app/store';
import { useDialog } from 'features/dialog/dialogHook';
import { useScreenSize } from 'hooks/useScreenSize';
import { useTranslation } from 'react-i18next';

export interface AccountPageProps {}

const AccountPage = (props: AccountPageProps) => {
  const { t } = useTranslation('accounts');
  const { isMobileLayout, isPadLayout, isDesktopLayout } = useScreenSize();
  const dispatch = useAppDispatch();
  const { isSelectMode, selectedIds, resetSelection } = useAccounts();
  const { openDialog, closeDialog } = useDialog();

  const handleCloseSelectionPanel = () => {
    dispatch(resetSelection());
  };

  const openAccountDialog = () => {
    openDialog(<AccountDialog onClose={closeDialog} />);
  };

  return (
    <Layout pageTitle={t('pageTitle')} SearchPanelContent={<div></div>}>
      {isMobileLayout && <MobileAccountList />}
      {(isPadLayout || isDesktopLayout) && <PaginatedAccountList />}

      <SelectionPanel
        isOpen={isMobileLayout && isSelectMode}
        selectedCount={selectedIds.length}
        onClose={handleCloseSelectionPanel}
      >
        <IconButton>
          <DeleteOutlineIcon />
        </IconButton>
      </SelectionPanel>
      <CreationFab show={isMobileLayout && !isSelectMode} onClick={openAccountDialog} />
    </Layout>
  );
};

export default AccountPage;
