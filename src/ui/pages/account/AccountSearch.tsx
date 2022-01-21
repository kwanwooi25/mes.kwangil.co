import { useAppDispatch } from 'app/store';
import Input from 'components/form/Input';
import RoundedButton from 'components/RoundedButton';
import { useUI } from 'features/ui/uiHook';
import { useFormik } from 'formik';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { AccountFilter } from 'features/account/interface';
import { Divider } from '@mui/material';

export interface AccountSearchProps {
  filter: AccountFilter;
  onChange: (filter: AccountFilter) => any;
}

function AccountSearch({ filter, onChange }: AccountSearchProps) {
  const { t } = useTranslation('accounts');

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
    <form onSubmit={handleSubmit} className="w-full" noValidate>
      <Input
        name="accountName"
        label={t('name')}
        value={values.accountName}
        onChange={handleChange}
        autoFocus
      />
      <Divider className="!my-4" />
      <div className="flex gap-x-4 py-2">
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
