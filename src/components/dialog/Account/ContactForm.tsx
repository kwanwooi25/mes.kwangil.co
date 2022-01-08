import { ContactInputs, PHONE_INPUT_KEYS } from 'const';
import {
  Divider,
  IconButton,
  Theme,
  Typography,
  createStyles,
  makeStyles,
} from '@material-ui/core';
import React, { ChangeEvent } from 'react';

import CloseIcon from '@material-ui/icons/Close';
import { CreateContactDto } from 'features/account/interface';
import Input from 'components/form/Input';
import { formatPhoneNumber } from 'utils/string';
import { useTranslation } from 'react-i18next';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    contactForm: {
      display: 'grid',
      gridTemplateColumns: '1fr auto',
      gridColumnGap: theme.spacing(2),
      gridTemplateAreas: `
        "title deleteButton"
        "phone phone"
        "fax fax"
        "email email"
        "address address"
        "memo memo"
      `,
      alignItems: 'center',
    },
    baseContactForm: {
      display: 'grid',
      gridTemplateColumns: '1fr',
      gridTemplateAreas: `
        "baseContactLabel"
        "phone"
        "fax"
        "email"
        "address"
        "memo"
      `,
    },
    baseContactLabel: {
      gridArea: 'baseContactLabel',
      marginTop: theme.spacing(2),
    },
    deleteButton: {
      gridArea: 'deleteButton',
    },
    title: {
      gridArea: 'title',
    },
    phone: {
      gridArea: 'phone',
    },
    fax: {
      gridArea: 'fax',
    },
    email: {
      gridArea: 'email',
    },
    address: {
      gridArea: 'address',
    },
    memo: {
      gridArea: 'memo',
    },
  }),
);

export interface ContactFormProps {
  contact: CreateContactDto;
  error?: { title: string; email: string };
  onChange: (contact: CreateContactDto) => void;
  onDelete: () => void;
}

function ContactForm({ contact, error, onChange, onDelete }: ContactFormProps) {
  const classes = useStyles();
  const { t } = useTranslation('contacts');

  const isBaseContact = contact.isBase;

  const handleChangeInput = (key: ContactInputs) => (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const isPhoneInput = PHONE_INPUT_KEYS.includes(key);
    const newContact = { ...contact, [key]: isPhoneInput ? formatPhoneNumber(value) : value };
    onChange(newContact);
  };

  return (
    <>
      <Divider />
      <div className={isBaseContact ? classes.baseContactForm : classes.contactForm}>
        {isBaseContact ? (
          <Typography className={classes.baseContactLabel} component="h3" variant="subtitle2">
            {t('baseContact')}
          </Typography>
        ) : (
          <>
            <Input
              className={classes.title}
              name="title"
              label={t('title')}
              value={contact.title}
              onInput={handleChangeInput(ContactInputs.title)}
              error={Boolean(error?.title)}
              helperText={error?.title}
            />
            <IconButton className={classes.deleteButton} onClick={onDelete}>
              <CloseIcon />
            </IconButton>
          </>
        )}
        <Input
          className={classes.phone}
          name="phone"
          label={t('phone')}
          value={contact.phone}
          onInput={handleChangeInput(ContactInputs.phone)}
        />
        <Input
          className={classes.fax}
          name="fax"
          label={t('fax')}
          value={contact.fax}
          onInput={handleChangeInput(ContactInputs.fax)}
        />
        <Input
          className={classes.email}
          name="email"
          label={t('email')}
          value={contact.email}
          onInput={handleChangeInput(ContactInputs.email)}
          error={Boolean(error?.email)}
          helperText={error?.email}
        />
        <Input
          className={classes.address}
          name="address"
          label={t('address')}
          value={contact.address}
          onInput={handleChangeInput(ContactInputs.address)}
        />
        <Input
          className={classes.memo}
          name="memo"
          label={t('memo')}
          value={contact.memo}
          onInput={handleChangeInput(ContactInputs.memo)}
          multiline
        />
      </div>
    </>
  );
}

export default ContactForm;
