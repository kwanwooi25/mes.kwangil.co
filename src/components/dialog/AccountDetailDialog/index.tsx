import { AccountInputs, ContactInputs } from 'const';
import {
  DialogActions,
  DialogContent,
  List,
  Theme,
  createStyles,
  makeStyles,
} from '@material-ui/core';
import React, { Fragment } from 'react';

import { AccountDto } from 'features/account/interface';
import CustomListSubHeader from 'components/CustomListSubHeader';
import Dialog from 'features/dialog/Dialog';
import DoneIcon from '@material-ui/icons/Done';
import RoundedButton from 'components/RoundedButton';
import { useTranslation } from 'react-i18next';
import DetailField from '../DetailField';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    buttons: {
      padding: theme.spacing(2, 3),
    },
  }),
);

export interface AccountDetailDialogProps {
  account: AccountDto;
  onClose: () => void;
}

function AccountDetailDialog({ account, onClose = () => {} }: AccountDetailDialogProps) {
  const { t } = useTranslation('accounts');
  const classes = useStyles();
  const accountDetailKeys = Object.values(AccountInputs).filter(
    (key) => key !== AccountInputs.name,
  );
  const contactDetailKeys = Object.values(ContactInputs).filter(
    (key) => key !== ContactInputs.title,
  );

  return (
    <Dialog open title={account.name} onClose={onClose} fullWidth>
      <DialogContent>
        <List>
          {accountDetailKeys.map((key) => (
            <DetailField key={key} label={t(key)} value={account[key]} />
          ))}
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
      </DialogContent>
      <DialogActions className={classes.buttons}>
        <RoundedButton autoFocus onClick={onClose} color="primary" startIcon={<DoneIcon />}>
          {t('common:confirm')}
        </RoundedButton>
      </DialogActions>
    </Dialog>
  );
}

export default AccountDetailDialog;
