import ConfirmDialog from 'components/dialog/Confirm';
import UserName from 'components/UserName';
import { useAuth } from 'features/auth/authHook';
import { UserDto } from 'features/auth/interface';
import { useDialog } from 'features/dialog/dialogHook';
import React, { memo, MouseEvent, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from 'react-query';

import {
  Chip,
  IconButton,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  Menu,
  MenuItem,
} from '@mui/material';
import { MoreVert } from '@mui/icons-material';

import { useUpdateUserMutation } from 'features/users/useUsers';
import classNames from 'classnames';

export interface UserListItemProps {
  user: UserDto;
  itemHeight: number;
}

function UserListItem({ user, itemHeight }: UserListItemProps) {
  const { t } = useTranslation('users');
  const [menuAnchorEl, setMenuAnchorEl] = useState<HTMLElement | null>(null);
  const { openDialog, closeDialog } = useDialog();
  const { canUpdateUsers } = useAuth();

  const queryClient = useQueryClient();
  const { updateUser } = useUpdateUserMutation({
    queryClient,
    messageOnSuccess: t(user.isActive ? 'inactivateUserSuccess' : 'activateUserSuccess'),
    messageOnFail: t(user.isActive ? 'inactivateUserFailed' : 'activateUserFailed'),
  });

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

  // const handleClickEdit = () => {
  //   // open edit dialog
  // };

  const handleClickToggleActive = () => {
    const title = `${t('common:user')} ${
      user.isActive ? t('common:inactivate') : t('common:activate')
    }`;
    const message = t(user.isActive ? 'inactivateUserConfirm' : 'activateUserConfirm', {
      userName: user.name,
    });

    openDialog(
      <ConfirmDialog
        title={title}
        message={message}
        onClose={(isConfirmed: boolean) => {
          if (isConfirmed) updateUser({ ...user, isActive: !user.isActive });
          closeDialog();
        }}
      />,
    );
  };

  // const handleClickDelete = () => {
  //   openDialog(
  //     <ConfirmDialog
  //       title={t('deleteUser')}
  //       message={t('deleteUserConfirm', { userName: user.name })}
  //       onClose={(isConfirmed: boolean) => {
  //         // isConfirmed && deleteUsers([user.id]);
  //         closeDialog();
  //       }}
  //     />
  //   );
  // };

  const actionButtons: { label: string; onClick: () => any }[] = [];

  if (canUpdateUsers) {
    actionButtons.push({
      label: t(user.isActive ? 'common:inactivate' : 'common:activate'),
      onClick: handleClickToggleActive,
    });
  }

  return (
    <ListItem divider style={{ height: itemHeight }}>
      <ListItemText>
        <div className="grid grid-cols-[1fr_auto] gap-x-2 items-center tablet:grid-cols-[2fr_3fr_auto]">
          <div className="flex gap-x-2 items-center">
            <UserName user={user} />
            <Chip size="small" label={user.userRole.name} />
          </div>
          <span className="truncate">{user.email}</span>
          <Chip
            className={classNames(
              'row-span-2 row-start-1 col-start-2 tablet:col-start-3',
              user.isActive ? 'bg-blue-500' : 'bg-red-500',
            )}
            label={user.isActive ? t('common:active') : t('common:inactive')}
            color={user.isActive ? 'primary' : 'secondary'}
          />
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

export default memo(UserListItem);
