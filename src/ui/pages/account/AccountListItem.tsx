import AccountName from 'ui/elements/AccountName';
import AccountDialog from 'ui/dialog/Account';
import ConfirmDialog from 'ui/dialog/Confirm';
import PhoneNumber from 'ui/elements/PhoneNumber';
import { AccountDto, AccountFilter } from 'features/account/interface';
import { useDialog } from 'features/dialog/dialogHook';
import React, { memo, MouseEvent, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from 'react-query';

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
} from '@mui/material';
import { MoreVert, Phone, Print } from '@mui/icons-material';

import { useDeleteAccountsMutation } from 'features/account/useAccounts';

export interface AccountListItemProps extends ListItemProps {
  account: AccountDto;
  itemHeight: number;
  isSelected?: boolean;
  showFaxNumber?: boolean;
  filter?: AccountFilter;
  toggleSelection?: (account: AccountDto) => any;
}

function AccountListItem({
  account,
  itemHeight,
  isSelected = false,
  showFaxNumber = false,
  filter = { accountName: '' },
  toggleSelection = () => {},
}: AccountListItemProps) {
  const { t } = useTranslation('accounts');

  const { openDialog, closeDialog } = useDialog();

  const [menuAnchorEl, setMenuAnchorEl] = useState<HTMLElement | null>(null);

  const queryClient = useQueryClient();
  const { deleteAccounts } = useDeleteAccountsMutation({ queryClient });

  const { accountName } = filter;
  const basePhoneNumber = account?.contacts?.find(({ isBase }) => isBase)?.phone;
  const baseFaxNumber = account?.contacts?.find(({ isBase }) => isBase)?.fax;

  const handleSelectionChange = () => toggleSelection(account);

  const openMenu = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => setMenuAnchorEl(e.currentTarget),
    [],
  );
  const closeMenu = useCallback(() => setMenuAnchorEl(null), []);

  const handleClickMenuItem =
    (onClick = () => {}) =>
    () => {
      closeMenu();
      onClick();
    };

  const handleClickEdit = () => {
    openDialog(<AccountDialog onClose={closeDialog} account={account} />);
  };

  const handleClickDelete = () => {
    openDialog(
      <ConfirmDialog
        title={t('deleteAccount')}
        message={t('deleteAccountConfirm', { accountName: account.name })}
        onClose={(isConfirmed: boolean) => {
          if (isConfirmed) {
            deleteAccounts([account.id]);
          }
          closeDialog();
        }}
      />,
    );
  };

  const actionButtons = [
    { label: t('common:edit'), onClick: handleClickEdit },
    { label: t('common:delete'), onClick: handleClickDelete },
  ];

  return (
    <ListItem divider style={{ height: itemHeight }} selected={isSelected}>
      <ListItemIcon className="!min-w-0">
        <Checkbox
          edge="start"
          color="primary"
          checked={isSelected}
          onChange={handleSelectionChange}
        />
      </ListItemIcon>
      <ListItemText>
        <div className="flex flex-col justify-start laptop:grid laptop:grid-cols-2 laptop:items-center">
          <AccountName account={account} searchText={accountName} />
          <div>
            {basePhoneNumber && (
              <PhoneNumber icon={<Phone fontSize="small" />} number={basePhoneNumber} />
            )}
          </div>
          {showFaxNumber && (
            <div>
              {baseFaxNumber && (
                <PhoneNumber icon={<Print fontSize="small" />} number={baseFaxNumber} />
              )}
            </div>
          )}
        </div>
      </ListItemText>
      <ListItemSecondaryAction>
        <IconButton edge="end" onClick={openMenu}>
          <MoreVert />
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
}

export default memo(AccountListItem);
