import { Link, Theme, createStyles, makeStyles } from '@material-ui/core';
import React, { memo } from 'react';

import AccountDetailDialog from './dialog/AccountDetailDialog';
import { AccountDto } from 'features/account/interface';
import { accountApi } from 'features/account/accountApi';
import classNames from 'classnames';
import { highlight } from 'utils/string';
import { useDialog } from 'features/dialog/dialogHook';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    accountNameLink: {
      maxWidth: '200px',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      textAlign: 'left',
    },
    accountName: {},
  })
);

export interface AccountNameProps {
  className?: string;
  linkClassName?: string;
  account: AccountDto;
  searchText?: string;
}

const AccountName = ({ account, className, linkClassName, searchText = '' }: AccountNameProps) => {
  const classes = useStyles();
  const { openDialog, closeDialog } = useDialog();

  const openAccountDetailDialog = async () => {
    const data = await accountApi.getAccount(account.id);
    openDialog(<AccountDetailDialog account={data} onClose={closeDialog} />);
  };

  return (
    <div className={className}>
      <Link
        className={classNames(classes.accountNameLink, linkClassName)}
        component="button"
        variant="h6"
        color="initial"
        onClick={openAccountDetailDialog}
      >
        <span
          className={classes.accountName}
          dangerouslySetInnerHTML={{ __html: highlight(account.name, searchText) }}
        />
      </Link>
    </div>
  );
};

export default memo(AccountName);
