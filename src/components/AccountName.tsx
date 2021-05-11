import classNames from 'classnames';
import { accountApi } from 'features/account/accountApi';
import { AccountDto } from 'features/account/interface';
import { useAuth } from 'features/auth/authHook';
import { useDialog } from 'features/dialog/dialogHook';
import React, { memo } from 'react';
import { hideText, highlight } from 'utils/string';

import { createStyles, Link, makeStyles, Theme } from '@material-ui/core';

import AccountDetailDialog from './dialog/AccountDetailDialog';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    accountNameLink: {
      maxWidth: '200px',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      textAlign: 'left',
    },
    linkDisabled: {
      cursor: 'default',
      '&:hover': {
        textDecoration: 'none',
      },
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
  const { isUser } = useAuth();

  const accountNameHTML = isUser ? hideText(account.name) : highlight(account.name, searchText);

  const openAccountDetailDialog = async () => {
    if (isUser) {
      return;
    }
    const data = await accountApi.getAccount(account.id);
    openDialog(<AccountDetailDialog account={data} onClose={closeDialog} />);
  };

  return (
    <div className={className}>
      <Link
        className={classNames([classes.accountNameLink, linkClassName, isUser && classes.linkDisabled])}
        component="button"
        variant="h6"
        color="initial"
        onClick={openAccountDetailDialog}
      >
        <span className={classes.accountName} dangerouslySetInnerHTML={{ __html: accountNameHTML }} />
      </Link>
    </div>
  );
};

export default memo(AccountName);
