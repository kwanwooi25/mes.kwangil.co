import Loading from 'ui/elements/Loading';
import { AccountOption } from 'features/account/interface';
import { useAccountOptions } from 'features/account/useAccounts';
import React, { ChangeEvent, createRef, FocusEvent, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Autocomplete } from '@mui/material';

import Input from 'ui/elements/Input';

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

function SelectAccount({ className, value, onChange, onBlur, errorMessage }: SelectAccountProps) {
  const { t } = useTranslation('accounts');
  const [isAccountOptionsOpen, setIsAccountOptionsOpen] = useState<boolean>(false);
  const inputRef = createRef<HTMLInputElement>();
  const { accountOptions = [], isLoading, isFetched } = useAccountOptions();

  const openAccountOptions = () => setIsAccountOptionsOpen(true);
  const closeAccountOptions = () => setIsAccountOptionsOpen(false);

  useEffect(() => {
    if (!value && isFetched && inputRef.current) {
      inputRef.current.click();
    }
  }, [isFetched]);

  return (
    <Autocomplete
      className={className}
      open={isAccountOptionsOpen}
      onOpen={openAccountOptions}
      onClose={closeAccountOptions}
      options={accountOptions}
      getOptionLabel={(option) => option.name}
      isOptionEqualToValue={(option) => option.id === value?.id}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      openOnFocus
      disabled={isLoading}
      renderInput={(params) => (
        <div style={{ position: 'relative' }}>
          {isLoading && <Loading />}
          <Input
            {...params}
            ref={inputRef}
            label={t('name')}
            value={value?.name}
            error={!!errorMessage}
            helperText={errorMessage}
            disabled={isLoading}
          />
        </div>
      )}
    />
  );
}

export default SelectAccount;
