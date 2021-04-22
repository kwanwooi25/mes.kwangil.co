import { Divider, Theme, createStyles, makeStyles } from '@material-ui/core';
import React, { useEffect } from 'react';
import { accountActions, accountSelectors } from './accountSlice';
import { useAppDispatch, useAppSelector } from 'app/store';

import { BaseQuery } from 'types/api';
import { GetAccountsQuery } from './interface';
import Input from 'components/form/Input';
import RoundedButton from 'components/RoundedButton';
import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import { useUI } from 'features/ui/uiHook';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    accountSearch: {
      width: '100%',
    },
    divider: {
      gridArea: 'divider',
      margin: theme.spacing(2, 0),
    },
    buttons: {
      gridArea: 'buttons',
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gridGap: theme.spacing(2),
      padding: theme.spacing(1, 0),
    },
  })
);

export interface AccountSearchProps {}

const AccountSearch = (props: AccountSearchProps) => {
  const { t } = useTranslation('accounts');
  const classes = useStyles();

  const dispatch = useAppDispatch();
  const { offset, limit, ...restQuery } = useAppSelector(accountSelectors.query);
  const { resetList: resetAccounts, getList: getAccounts } = accountActions;
  const { closeSearch } = useUI();

  const initialValues = { searchText: '' };

  const { values, setValues, handleSubmit, handleChange, handleReset } = useFormik<
    Omit<GetAccountsQuery, keyof BaseQuery>
  >({
    initialValues,
    onReset: () => {
      dispatch(resetAccounts());
      dispatch(getAccounts({ limit, offset: 0 }));
      dispatch(closeSearch());
    },
    onSubmit: (values) => {
      dispatch(resetAccounts());
      dispatch(getAccounts({ limit, offset: 0, searchText: values.searchText }));
      dispatch(closeSearch());
    },
  });

  useEffect(() => {
    setValues({ ...initialValues, ...restQuery });
  }, []);

  return (
    <form onSubmit={handleSubmit} className={classes.accountSearch}>
      <Input name="searchText" label={t('name')} value={values.searchText} onChange={handleChange} autoFocus />
      <Divider className={classes.divider} />
      <div className={classes.buttons}>
        <RoundedButton fullWidth variant="outlined" size="large" onClick={handleReset}>
          {t('common:reset')}
        </RoundedButton>
        <RoundedButton fullWidth color="primary" size="large" type="submit">
          {t('common:search')}
        </RoundedButton>
      </div>
    </form>
  );
};

export default AccountSearch;
