import { AccountDto, CreateContactDto, UpdateAccountDto } from 'features/account/interface';
import { DialogActions, DialogContent, Divider, Theme, Typography, createStyles, makeStyles } from '@material-ui/core';
import React, { ChangeEvent, useEffect } from 'react';
import { array, boolean, object, string } from 'yup';

import AddIcon from '@material-ui/icons/Add';
import ContactForm from './ContactForm';
import Dialog from 'features/dialog/Dialog';
import DoneIcon from '@material-ui/icons/Done';
import Input from 'components/form/Input';
import Loading from 'components/Loading';
import RoundedButton from 'components/RoundedButton';
import { formatCrn } from 'utils/string';
import { isEmpty } from 'lodash';
import { useAccounts } from 'features/account/accountHook';
import { useAppDispatch } from 'app/store';
import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import { useLoading } from 'features/loading/loadingHook';
import { LoadingKeys } from 'const';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    dialogContent: {
      padding: `${theme.spacing(1)}px ${theme.spacing(3)}px`,
    },
    accountForm: {
      display: 'grid',
      gridTemplateColumns: '1fr',
      gridTemplateAreas: `"name" "crn" "memo"`,
      [theme.breakpoints.up('sm')]: {
        gridTemplateColumns: '1fr auto',
        gridTemplateAreas: `
        "name crn"
        "memo memo"
      `,
        gridColumnGap: theme.spacing(2),
      },
    },
    name: {
      gridArea: 'name',
    },
    crn: {
      gridArea: 'crn',
    },
    memo: {
      gridArea: 'memo',
    },
    addContactButton: {
      margin: `${theme.spacing(2)}px 0`,
    },
    actionButtons: {
      padding: theme.spacing(3),
    },
  })
);

export interface AccountDialogProps {
  account?: AccountDto;
  onClose: () => void;
}

interface AccountFormValues {
  name: string;
  crn: string;
  memo: string;
  contacts?: CreateContactDto[];
  contactIdsToDelete?: number[];
}

const AccountDialog = ({ account, onClose }: AccountDialogProps) => {
  const classes = useStyles();
  const { t } = useTranslation('accounts');
  const isEditMode = !isEmpty(account);
  const dialogTitle = t(isEditMode ? 'updateAccount' : 'addAccount');

  const dispatch = useAppDispatch();
  const { [LoadingKeys.SAVING_ACCOUNT]: isSaving } = useLoading();
  const { createAccount, updateAccount, shouldCloseAccountDialog, setShouldCloseAccountDialog } = useAccounts();

  const { values, touched, errors, handleChange, setFieldValue, setValues, submitForm } = useFormik<AccountFormValues>({
    initialValues: {
      name: '',
      crn: '',
      memo: '',
      contacts: [],
      contactIdsToDelete: [],
    },
    validationSchema: object({
      name: string().required(t('accountNameRequired')),
      crn: string().nullable(),
      memo: string().nullable(),
      contacts: array().of(
        object().shape({
          title: string().required(t('contacts:titleRequired')),
          isBase: boolean().default(false),
          phone: string().nullable(),
          fax: string().nullable(),
          email: string().email(t('common:emailInvalid')).nullable(),
          address: string().nullable(),
          memo: string().nullable(),
        })
      ),
    }),
    onSubmit: (values) => {
      if (isEditMode) {
        const accountToUpdate = {
          id: account?.id,
          ...values,
          contacts: values?.contacts?.filter(({ id }) => id),
          contactsToCreate: values?.contacts?.filter(({ id }) => !id),
        };
        dispatch(updateAccount(accountToUpdate as UpdateAccountDto));
      } else {
        const { contactIdsToDelete, ...accountToCreate } = values;
        dispatch(createAccount(accountToCreate));
      }
    },
  });

  const handleChangeCrn = (e: ChangeEvent<HTMLInputElement>) => {
    e.target.value = formatCrn(e.target.value);
    handleChange(e);
  };

  const handleChangeContact = (index: number) => (contact: CreateContactDto) => {
    const newContacts = values.contacts?.map((c, i) => (i === index ? contact : c));
    setFieldValue('contacts', newContacts);
  };

  const handleDeleteContact = (index: number) => () => {
    const { contactIdsToDelete = [] } = values;
    const newContacts = values.contacts?.filter((c, i) => {
      i === index && c.id && contactIdsToDelete.push(c.id);
      return i !== index;
    });
    setFieldValue('contacts', newContacts);
    setFieldValue('contactIdsToDelete', contactIdsToDelete);
  };

  const handleClose = () => {
    onClose && onClose();
  };

  const addContact = () => {
    const { contacts = [] } = values;
    const isContactsEmpty = !contacts?.length;

    setFieldValue('contacts', [
      ...contacts,
      {
        title: isContactsEmpty ? '기본' : '',
        isBase: isContactsEmpty ? true : false,
        phone: '',
        fax: '',
        email: '',
        address: '',
        memo: '',
      },
    ]);
  };

  const setInitialValues = ({ contacts = [], ...account }: AccountDto) => {
    setValues({ ...values, ...account, contacts: [...contacts] });
  };

  useEffect(() => {
    if (isEditMode) {
      setInitialValues(account as AccountDto);
    } else {
      addContact();
    }
  }, []);

  useEffect(() => {
    if (shouldCloseAccountDialog) {
      dispatch(setShouldCloseAccountDialog(false));
      onClose();
    }
  }, [shouldCloseAccountDialog]);

  return (
    <Dialog open onClose={handleClose} title={dialogTitle}>
      <DialogContent dividers className={classes.dialogContent}>
        {isSaving && <Loading />}
        <Typography component="h3" variant="subtitle2">
          {t('accountDetail')}
        </Typography>
        <Input
          className={classes.name}
          name="name"
          label={t('name')}
          value={values.name}
          onChange={handleChange}
          error={touched.name && Boolean(errors.name)}
          helperText={touched.name && errors.name}
          autoFocus
        />
        <Input
          className={classes.crn}
          name="crn"
          label={t('crn')}
          value={values.crn}
          onChange={handleChangeCrn}
          error={touched.crn && Boolean(errors.crn)}
          helperText={touched.crn && errors.crn}
        />
        <Input
          className={classes.memo}
          name="memo"
          label={t('memo')}
          value={values.memo}
          onChange={handleChange}
          error={touched.memo && Boolean(errors.memo)}
          helperText={touched.memo && errors.memo}
          multiline
        />
        {values.contacts?.map((contact, index) => (
          <ContactForm
            key={index}
            contact={contact}
            // @ts-ignore
            error={errors.contacts && errors.contacts[index]}
            onChange={handleChangeContact(index)}
            onDelete={handleDeleteContact(index)}
          />
        ))}
        <Divider />
        <RoundedButton
          className={classes.addContactButton}
          color="primary"
          variant="outlined"
          onClick={addContact}
          startIcon={<AddIcon />}
        >
          {t('addContact')}
        </RoundedButton>
      </DialogContent>
      <DialogActions className={classes.actionButtons}>
        <RoundedButton
          color="primary"
          size="large"
          fullWidth
          startIcon={<DoneIcon />}
          onClick={submitForm}
          disabled={isSaving}
        >
          {t('common:save')}
        </RoundedButton>
      </DialogActions>
    </Dialog>
  );
};

export default AccountDialog;
