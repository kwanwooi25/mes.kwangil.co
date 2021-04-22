import {
  Checkbox,
  IconButton,
  ListItem,
  ListItemIcon,
  ListItemProps,
  ListItemSecondaryAction,
  ListItemText,
  Menu,
  MenuItem,
  Theme,
  createStyles,
  makeStyles,
} from '@material-ui/core';
import React, { MouseEvent, memo, useCallback, useState } from 'react';
import { accountActions, accountSelectors } from './accountSlice';
import { useAppDispatch, useAppSelector } from 'app/store';

import AccountDialog from 'components/dialog/Account';
import { AccountDto } from 'features/account/interface';
import AccountName from 'components/AccountName';
import ConfirmDialog from 'components/dialog/Confirm';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import PhoneIcon from '@material-ui/icons/Phone';
import PhoneNumber from 'components/PhoneNumber';
import PrintIcon from '@material-ui/icons/Print';
import { Skeleton } from '@material-ui/lab';
import { useDialog } from 'features/dialog/dialogHook';
import { useTranslation } from 'react-i18next';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    accountDetail: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-start',
      [theme.breakpoints.up('sm')]: {
        display: 'grid',
        gridTemplateColumns: 'minmax(200px, 1fr) 1fr',
        gridGap: theme.spacing(1),
        alignItems: 'center',
      },
      [theme.breakpoints.up('md')]: {
        gridTemplateColumns: 'minmax(200px, 1fr) 1fr 1fr',
      },
    },
  })
);

export interface AccountListItemProps extends ListItemProps {
  account: AccountDto;
  itemHeight: number;
  isSelected?: boolean;
  showFaxNumber?: boolean;
}

const AccountListItem = ({ account, itemHeight, isSelected = false, showFaxNumber = false }: AccountListItemProps) => {
  const { t } = useTranslation('accounts');
  const classes = useStyles();

  const dispatch = useAppDispatch();
  const { searchText = '' } = useAppSelector(accountSelectors.query);
  const { toggleSelection, deleteAccounts } = accountActions;
  const { openDialog, closeDialog } = useDialog();

  const [menuAnchorEl, setMenuAnchorEl] = useState<HTMLElement | null>(null);

  const basePhoneNumber = account?.contacts?.find(({ isBase }) => isBase)?.phone;
  const baseFaxNumber = account?.contacts?.find(({ isBase }) => isBase)?.fax;

  const handleSelectionChange = useCallback(() => {
    dispatch(toggleSelection(account.id));
  }, []);

  const openMenu = useCallback((e: MouseEvent<HTMLButtonElement>) => setMenuAnchorEl(e.currentTarget), []);
  const closeMenu = useCallback(() => setMenuAnchorEl(null), []);

  const handleClickMenuItem = (onClick = () => {}) => () => {
    closeMenu();
    onClick();
  };

  const handleClickEdit = useCallback(() => {
    openDialog(<AccountDialog onClose={closeDialog} account={account} />);
  }, []);

  const handleClickDelete = useCallback(() => {
    openDialog(
      <ConfirmDialog
        title={t('deleteAccount')}
        message={t('deleteAccountConfirm', { accountName: account.name })}
        onClose={(isConfirmed: boolean) => {
          isConfirmed && dispatch(deleteAccounts([account.id]));
          closeDialog();
        }}
      />
    );
  }, []);

  const actionButtons = [
    { label: t('common:edit'), onClick: handleClickEdit },
    { label: t('common:delete'), onClick: handleClickDelete },
  ];

  return (
    <ListItem divider style={{ height: itemHeight }} selected={isSelected}>
      <ListItemIcon>
        <Checkbox edge="start" color="primary" checked={isSelected} onChange={handleSelectionChange} />
      </ListItemIcon>
      <ListItemText>
        <div className={classes.accountDetail}>
          <AccountName account={account} searchText={searchText} />
          <div>{basePhoneNumber && <PhoneNumber icon={<PhoneIcon fontSize="small" />} number={basePhoneNumber} />}</div>
          {showFaxNumber && (
            <div>{baseFaxNumber && <PhoneNumber icon={<PrintIcon fontSize="small" />} number={baseFaxNumber} />}</div>
          )}
        </div>
      </ListItemText>
      <ListItemSecondaryAction>
        <IconButton edge="end" onClick={openMenu}>
          <MoreVertIcon />
        </IconButton>
        <Menu anchorEl={menuAnchorEl} open={Boolean(menuAnchorEl)} onClose={closeMenu}>
          {actionButtons.map(({ label, onClick }) => (
            <MenuItem key={label} onClick={handleClickMenuItem(onClick)}>
              {label}
            </MenuItem>
          ))}
        </Menu>
      </ListItemSecondaryAction>
    </ListItem>
  );
};

const AccountListItemSkeleton = memo(({ itemHeight }: { itemHeight: number }) => {
  const classes = useStyles();

  return (
    <ListItem divider style={{ height: itemHeight }}>
      <ListItemIcon>
        <Skeleton variant="rect" width={24} height={24} />
      </ListItemIcon>
      <ListItemText>
        <div className={classes.accountDetail}>
          <Skeleton variant="rect" width="80%" height={30} />
          <Skeleton variant="rect" width="80%" height={24} />
          <Skeleton variant="rect" width="80%" height={24} />
        </div>
      </ListItemText>
      <ListItemSecondaryAction>
        <Skeleton variant="circle" width={48} height={48} style={{ marginRight: -12 }} />
      </ListItemSecondaryAction>
    </ListItem>
  );
});

export { AccountListItemSkeleton };

export default memo(AccountListItem);
