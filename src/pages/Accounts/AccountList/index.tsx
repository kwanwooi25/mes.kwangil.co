import { Theme, createStyles, makeStyles } from '@material-ui/core';

import React from 'react';
import { useTranslation } from 'react-i18next';

const useStyles = makeStyles((theme: Theme) => createStyles({}));

export interface AccountListProps {}

const AccountList = ({}: AccountListProps) => {
  const { t } = useTranslation();
  const classes = useStyles();

  return <div>AccountList</div>;
};

export default AccountList;
