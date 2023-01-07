import Input from 'ui/elements/Input';
import Loading from 'ui/elements/Loading';
import RoundedButton from 'ui/elements/RoundedButton';
import { AccountDto, CreateContactDto, UpdateAccountDto } from 'features/account/interface';
import { useCreateAccountMutation, useUpdateAccountMutation } from 'features/account/useAccounts';
import Dialog from 'features/dialog/Dialog';
import { useFormik } from 'formik';
import { isEmpty } from 'lodash';
import React, { ChangeEvent, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from 'react-query';
import { formatCrn } from 'utils/string';
import { array, boolean, object, string } from 'yup';
import { Add, Done } from '@mui/icons-material';

import { DeliveryMethod } from 'const';
import CustomToggleButton from 'ui/elements/CustomToggleButton';
import { useDialog } from 'features/dialog/dialogHook';
import { useUpdateProductsDeliveryMethodByAccountIdMutation } from 'features/product/useProducts';
import ContactForm from './ContactForm';
import ConfirmDialog from '../Confirm';

export interface AccountDialogProps {
  account?: AccountDto;
  onClose: (account?: AccountDto) => void;
}

interface AccountFormValues {
  name: string;
  crn: string;
  deliveryMethod: DeliveryMethod;
  memo: string;
  contacts?: CreateContactDto[];
  contactIdsToDelete?: number[];
}

function AccountDialog({ account, onClose }: AccountDialogProps) {
  const { t } = useTranslation('accounts');
  const { t: deliveryMethodT } = useTranslation('deliveryMethod');
  const { openDialog, closeDialog } = useDialog();

  const isEditMode = !isEmpty(account);
  const dialogTitle = t(isEditMode ? 'updateAccount' : 'addAccount');

  const queryClient = useQueryClient();

  const onSuccess = () => {
    queryClient.invalidateQueries('accounts');
    onClose();
  };

  const { updateAccount, isUpdating } = useUpdateAccountMutation({ queryClient, onSuccess });
  const { updateProductsDeliveryMethodByAccountId } =
    useUpdateProductsDeliveryMethodByAccountIdMutation({ queryClient });
  const { createAccount, isCreating } = useCreateAccountMutation({ queryClient, onSuccess });
  const isLoading = isCreating || isUpdating;

  const { values, touched, errors, handleChange, setFieldValue, setValues, submitForm } =
    useFormik<AccountFormValues>({
      initialValues: {
        name: '',
        crn: '',
        deliveryMethod: DeliveryMethod.TBD,
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
          }),
        ),
      }),
      onSubmit: async (submitValues) => {
        if (isEditMode) {
          const accountToUpdate = {
            id: account?.id,
            ...submitValues,
            contacts: submitValues?.contacts?.filter(({ id }) => id),
            contactsToCreate: submitValues?.contacts?.filter(({ id }) => !id),
          };
          onClose();
          if (account?.deliveryMethod === accountToUpdate.deliveryMethod) {
            await updateAccount(accountToUpdate as UpdateAccountDto);
            return;
          }
          openDialog(
            <ConfirmDialog
              title="납품 방법을 변경하셨습니다."
              message={
                <>
                  <b>{account?.name}</b>의 모든 제품의 납품 방법을{' '}
                  <b>{deliveryMethodT(accountToUpdate.deliveryMethod)}</b>으로 변경하시겠습니까?
                </>
              }
              onClose={async (isConfirmed: boolean) => {
                closeDialog();
                await updateAccount(accountToUpdate as UpdateAccountDto);

                if (isConfirmed) {
                  updateProductsDeliveryMethodByAccountId({
                    accountId: account?.id,
                    deliveryMethod: accountToUpdate.deliveryMethod,
                  });
                }
              }}
            />,
          );
        } else {
          const { contactIdsToDelete, ...accountToCreate } = submitValues;
          createAccount(accountToCreate);
        }
      },
    });

  const handleChangeCrn = (e: ChangeEvent<HTMLInputElement>) => {
    // eslint-disable-next-line no-param-reassign
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
      if (i === index && c.id) {
        contactIdsToDelete.push(c.id);
      }
      return i !== index;
    });
    setFieldValue('contacts', newContacts);
    setFieldValue('contactIdsToDelete', contactIdsToDelete);
  };

  const addContact = () => {
    const { contacts = [] } = values;
    const isContactsEmpty = !contacts?.length;

    setFieldValue('contacts', [
      ...contacts,
      {
        title: isContactsEmpty ? '기본' : '',
        isBase: !!isContactsEmpty,
        phone: '',
        fax: '',
        email: '',
        address: '',
        memo: '',
      },
    ]);
  };

  const setInitialValues = ({ contacts = [], ...rest }: AccountDto) => {
    setValues({ ...values, ...rest, contacts: [...contacts] });
  };

  const deliveryMethodOptions = Object.values(DeliveryMethod).map((value) => ({
    value,
    label: deliveryMethodT(value),
  }));

  const handleChangeDeliveryMethod = (value: DeliveryMethod) => {
    setFieldValue('deliveryMethod', value);
  };

  useEffect(() => {
    if (isEditMode) {
      setInitialValues(account as AccountDto);
    } else {
      addContact();
    }
  }, []);

  return (
    <Dialog open onClose={onClose} title={dialogTitle}>
      <Dialog.Content dividers>
        {isLoading && <Loading />}
        <h3>{t('accountDetail')}</h3>
        <Input
          name="name"
          label={t('name')}
          value={values.name}
          onChange={handleChange}
          error={touched.name && Boolean(errors.name)}
          helperText={touched.name && errors.name}
          autoFocus
        />
        <Input
          name="crn"
          label={t('crn')}
          value={values.crn}
          onChange={handleChangeCrn}
          error={touched.crn && Boolean(errors.crn)}
          helperText={touched.crn && errors.crn}
        />
        <CustomToggleButton
          className="!py-2"
          label={t('deliveryMethod')}
          value={values.deliveryMethod}
          onChange={handleChangeDeliveryMethod}
          options={deliveryMethodOptions}
        />
        <Input
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
            // eslint-disable-next-line react/no-array-index-key
            key={index}
            contact={contact}
            // @ts-ignore
            error={errors.contacts && errors.contacts[index]}
            onChange={handleChangeContact(index)}
            onDelete={handleDeleteContact(index)}
          />
        ))}
        <RoundedButton
          className="!my-2"
          color="primary"
          variant="outlined"
          onClick={addContact}
          startIcon={<Add />}
        >
          {t('addContact')}
        </RoundedButton>
      </Dialog.Content>
      <Dialog.Actions>
        <RoundedButton
          color="primary"
          size="large"
          startIcon={<Done />}
          onClick={submitForm}
          disabled={isLoading}
        >
          {t('common:save')}
        </RoundedButton>
      </Dialog.Actions>
    </Dialog>
  );
}

export default AccountDialog;
