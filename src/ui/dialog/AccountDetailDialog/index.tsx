import { ContactInputs } from 'const';
import { List } from '@mui/material';
import React, { Fragment } from 'react';

import { AccountDto } from 'features/account/interface';
import CustomListSubHeader from 'ui/elements/CustomListSubHeader';
import Dialog from 'features/dialog/Dialog';
import DoneIcon from '@mui/icons-material/Done';
import RoundedButton from 'ui/elements/RoundedButton';
import { useTranslation } from 'react-i18next';
import DetailField from '../DetailField';

export interface AccountDetailDialogProps {
  account: AccountDto;
  onClose: () => void;
}

function AccountDetailDialog({ account, onClose = () => {} }: AccountDetailDialogProps) {
  const { t } = useTranslation('accounts');
  const { t: deliveryMethodT } = useTranslation('deliveryMethod');
  const contactDetailKeys = Object.values(ContactInputs).filter(
    (key) => key !== ContactInputs.title,
  );

  return (
    <Dialog open title={account.name} onClose={onClose} fullWidth>
      <Dialog.Content>
        <List>
          <DetailField label={t('crn')} value={account.crn} />
          <DetailField
            label={t('deliveryMethod')}
            value={deliveryMethodT(account?.deliveryMethod ?? '') as string}
          />
          <DetailField label={t('memo')} value={account.memo} />
          {account.contacts?.map((contact) => (
            <Fragment key={contact.id}>
              <CustomListSubHeader>
                {contact.isBase ? t('contacts:baseContact') : contact.title}
              </CustomListSubHeader>
              {contactDetailKeys.map((key) => (
                <DetailField key={key} label={t(`contacts:${key}`)} value={contact[key]} />
              ))}
            </Fragment>
          ))}
        </List>
      </Dialog.Content>
      <Dialog.Actions>
        <RoundedButton autoFocus onClick={onClose} color="primary" startIcon={<DoneIcon />}>
          {t('common:confirm')}
        </RoundedButton>
      </Dialog.Actions>
    </Dialog>
  );
}

export default AccountDetailDialog;
