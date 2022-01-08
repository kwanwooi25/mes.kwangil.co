import { useAppDispatch } from 'app/store';
import Input from 'components/form/Input';
import RoundedButton from 'components/RoundedButton';
import { useUI } from 'features/ui/uiHook';
import { useFormik } from 'formik';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { createStyles, Divider, makeStyles, Theme } from '@material-ui/core';

import { AccountFilter } from './interface';

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
  }),
);

export interface AccountSearchProps {
  filter: AccountFilter;
  onChange: (filter: AccountFilter) => any;
}

function AccountSearch({ filter, onChange }: AccountSearchProps) {
  const { t } = useTranslation('accounts');
  const classes = useStyles();

  const dispatch = useAppDispatch();
  const { closeSearch } = useUI();

  const initialValues = { accountName: '' };

  const { values, setValues, handleSubmit, handleChange, handleReset } = useFormik<AccountFilter>({
    initialValues,
    onReset: () => {
      onChange({ accountName: '' });
    },
    onSubmit: ({ accountName = '' }) => {
      onChange({ accountName });
      dispatch(closeSearch());
    },
  });

  useEffect(() => {
    setValues({ ...initialValues, ...filter });
  }, []);

  return (
    <form onSubmit={handleSubmit} className={classes.accountSearch} noValidate>
      <Input
        name="accountName"
        label={t('name')}
        value={values.accountName}
        onChange={handleChange}
        autoFocus
      />
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
}

export default AccountSearch;
