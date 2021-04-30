import { AccountDto, AccountOption } from 'features/account/interface';
import React, { ChangeEvent, FocusEvent, useEffect, useState } from 'react';

import { Autocomplete } from '@material-ui/lab';
import Input from './Input';
import Loading from 'components/Loading';
import { accountApi } from 'features/account/accountApi';
import { useTranslation } from 'react-i18next';

export interface SelectAccountProps {
  className?: string;
  value: AccountOption | null;
  onChange: (e: ChangeEvent<{}>, value: AccountOption | null) => void;
  onBlur: {
    (e: FocusEvent<any>): void;
    <T = any>(fieldOrEvent: T): T extends string ? (e: any) => void : void;
  };
  errorMessage?: string;
}

const SelectAccount = ({ className, value, onChange, onBlur, errorMessage }: SelectAccountProps) => {
  const { t } = useTranslation('accounts');
  const [accountOptions, setAccountOptions] = useState<AccountOption[]>([]);
  const [isAccountOptionsOpen, setIsAccountOptionsOpen] = useState<boolean>(false);
  const [isAccountsLoading, setIsAccountsLoading] = useState<boolean>(false);

  const openAccountOptions = () => setIsAccountOptionsOpen(true);
  const closeAccountOptions = () => setIsAccountOptionsOpen(false);

  useEffect(() => {
    if (isAccountOptionsOpen) {
      (async () => {
        setIsAccountsLoading(true);
        const { rows }: { rows: AccountDto[] } = await accountApi.getAllAccounts();
        const accountOptions = rows.map(({ id, name }) => ({ id, name }));
        setAccountOptions(accountOptions);
        setIsAccountsLoading(false);
      })();
    }
  }, [isAccountOptionsOpen]);

  return (
    <Autocomplete
      className={className}
      open={isAccountOptionsOpen}
      onOpen={openAccountOptions}
      onClose={closeAccountOptions}
      options={accountOptions}
      getOptionLabel={(option) => option.name}
      getOptionSelected={(option) => option.id === value?.id}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      openOnFocus
      disabled={isAccountsLoading}
      renderInput={(params) => (
        <div style={{ position: 'relative' }}>
          {isAccountsLoading && <Loading />}
          <Input
            {...params}
            label={t('name')}
            value={value?.name}
            error={!!errorMessage}
            helperText={errorMessage}
            autoFocus={!value}
            disabled={isAccountsLoading}
          />
        </div>
      )}
    />
  );
};

export default SelectAccount;
