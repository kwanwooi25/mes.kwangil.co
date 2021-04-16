import { Link, Theme, createStyles, makeStyles } from '@material-ui/core';
import React, { memo } from 'react';

import { AccountDto } from 'features/account/interface';
import classNames from 'classnames';
import { highlight } from 'utils/string';

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

  return (
    <div className={className}>
      <Link
        className={classNames(classes.accountNameLink, linkClassName)}
        component="button"
        variant="h6"
        color="initial"
        onClick={() => {}}
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
