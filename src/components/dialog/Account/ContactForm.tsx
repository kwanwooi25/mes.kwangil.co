import { ContactInputs, PHONE_INPUT_KEYS } from 'const';
import { IconButton } from '@mui/material';
import React, { ChangeEvent } from 'react';

import CloseIcon from '@mui/icons-material/Close';
import { CreateContactDto } from 'features/account/interface';
import Input from 'components/form/Input';
import { formatPhoneNumber } from 'utils/string';
import { useTranslation } from 'react-i18next';

export interface ContactFormProps {
  contact: CreateContactDto;
  error?: { title: string; email: string };
  onChange: (contact: CreateContactDto) => void;
  onDelete: () => void;
}

function ContactForm({ contact, error, onChange, onDelete }: ContactFormProps) {
  const { t } = useTranslation('contacts');

  const isBaseContact = contact.isBase;

  const handleChangeInput = (key: ContactInputs) => (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const isPhoneInput = PHONE_INPUT_KEYS.includes(key);
    const newContact = { ...contact, [key]: isPhoneInput ? formatPhoneNumber(value) : value };
    onChange(newContact);
  };

  return (
    <div>
      {isBaseContact ? (
        <h3 className="mt-2">{t('baseContact')}</h3>
      ) : (
        <div className="grid grid-cols-[1fr_auto] gap-4 items-center">
          <Input
            name="title"
            label={t('title')}
            value={contact.title}
            onInput={handleChangeInput(ContactInputs.title)}
            error={Boolean(error?.title)}
            helperText={error?.title}
          />
          <IconButton onClick={onDelete}>
            <CloseIcon />
          </IconButton>
        </div>
      )}
      <Input
        name="phone"
        label={t('phone')}
        value={contact.phone}
        onInput={handleChangeInput(ContactInputs.phone)}
      />
      <Input
        name="fax"
        label={t('fax')}
        value={contact.fax}
        onInput={handleChangeInput(ContactInputs.fax)}
      />
      <Input
        name="email"
        label={t('email')}
        value={contact.email}
        onInput={handleChangeInput(ContactInputs.email)}
        error={Boolean(error?.email)}
        helperText={error?.email}
      />
      <Input
        name="address"
        label={t('address')}
        value={contact.address}
        onInput={handleChangeInput(ContactInputs.address)}
      />
      <Input
        name="memo"
        label={t('memo')}
        value={contact.memo}
        onInput={handleChangeInput(ContactInputs.memo)}
        multiline
      />
    </div>
  );
}

export default ContactForm;
