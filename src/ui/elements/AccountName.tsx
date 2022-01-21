import classNames from 'classnames';
import { AccountDto } from 'features/account/interface';
import { useAccount } from 'features/account/useAccounts';
import { useAuth } from 'features/auth/authHook';
import { useDialog } from 'features/dialog/dialogHook';
import React, { memo } from 'react';
import { hideText, highlight } from 'utils/string';

import AccountDetailDialog from 'components/dialog/AccountDetailDialog';
import { LoadingButton } from '@mui/lab';

export interface AccountNameProps {
  className?: string;
  linkClassName?: string;
  account: AccountDto;
  searchText?: string;
}

function AccountName({ account, className, linkClassName, searchText = '' }: AccountNameProps) {
  const { openDialog, closeDialog } = useDialog();
  const { canViewAccounts } = useAuth();
  const { refetch, isFetching } = useAccount(account.id);

  const accountNameHTML = canViewAccounts
    ? highlight(account.name, searchText)
    : hideText(account.name);

  const openAccountDetailDialog = async () => {
    if (canViewAccounts) {
      refetch().then((res) =>
        openDialog(<AccountDetailDialog account={res.data} onClose={closeDialog} />),
      );
    }
  };

  return (
    <LoadingButton
      className={classNames('!justify-start !min-w-0 max-w-max', className)}
      onClick={openAccountDetailDialog}
      disabled={isFetching}
      loading={isFetching}
      loadingPosition="end"
      endIcon={<span />}
      color="inherit"
    >
      <p
        className={classNames('truncate', linkClassName)}
        dangerouslySetInnerHTML={{ __html: accountNameHTML }}
      />
    </LoadingButton>
  );
}

export default memo(AccountName);
