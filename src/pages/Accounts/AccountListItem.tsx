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

import { AccountDto } from 'features/account/interface';
import AccountName from 'components/AccountName';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import PhoneIcon from '@material-ui/icons/Phone';
import PhoneNumber from 'components/PhoneNumber';
import PrintIcon from '@material-ui/icons/Print';
import { Skeleton } from '@material-ui/lab';
import { useAccounts } from 'features/account/accountHook';
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
  isLoading?: boolean;
}

const AccountListItem = ({
  account,
  itemHeight,
  isSelected = false,
  showFaxNumber = false,
  isLoading = false,
}: AccountListItemProps) => {
  const { t } = useTranslation('accounts');
  const classes = useStyles();

  // const dispatch = useDispatch();
  const {
    query: { searchText = '' },
    toggleSelection,
  } = useAccounts();

  const [menuAnchorEl, setMenuAnchorEl] = useState<HTMLElement | null>(null);

  const basePhoneNumber = account?.contacts?.find(({ isBase }) => isBase)?.phone;
  const baseFaxNumber = account?.contacts?.find(({ isBase }) => isBase)?.fax;

  const handleSelectionChange = useCallback(() => {
    toggleSelection(account.id);
  }, []);

  const openMenu = useCallback((e: MouseEvent<HTMLButtonElement>) => setMenuAnchorEl(e.currentTarget), []);
  const closeMenu = useCallback(() => setMenuAnchorEl(null), []);

  const handleClickMenuItem = (onClick = () => {}) => () => {
    closeMenu();
    onClick();
  };

  const handleClickEdit = useCallback(() => {
    // dispatch(actions.dialog.openDialog(DialogType.ACCOUNT, { account }));
  }, []);

  const handleClickDelete = useCallback(() => {
    // dispatch(
    //   actions.dialog.openDialog(DialogType.CONFIRM, {
    //     title: t('deleteAccount'),
    //     message: t('deleteAccountConfirm', { accountName: account.name }),
    //     onClose: (result: boolean) => {
    //       result && dispatch(actions.account.deleteAccountsRequest([account.id]));
    //     },
    //   })
    // );
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

const AccountListItemSkeleton = ({ itemHeight }: { itemHeight: number }) => {
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
        <IconButton edge="end">
          <Skeleton variant="circle" width={48} height={48} />
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
  );
};

export { AccountListItemSkeleton };

export default memo(AccountListItem);
