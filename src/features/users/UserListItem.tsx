import ConfirmDialog from 'components/dialog/Confirm';
import UserName from 'components/UserName';
import { useAuth } from 'features/auth/authHook';
import { UserDto } from 'features/auth/interface';
import { useDialog } from 'features/dialog/dialogHook';
import React, { memo, MouseEvent, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from 'react-query';

import {
    Chip, createStyles, IconButton, ListItem, ListItemSecondaryAction, ListItemText, makeStyles,
    Menu, MenuItem, Theme, Typography
} from '@material-ui/core';
import { MoreVert } from '@material-ui/icons';

import { useUpdateUserMutation } from './useUsers';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    userDetail: {
      display: 'grid',
      gridTemplateColumns: '1fr auto',
      gridTemplateAreas: `
        "userName userActiveTag"
        "userEmail userActiveTag"
      `,
      gridColumnGap: theme.spacing(1),
      alignItems: 'center',
      [theme.breakpoints.up('sm')]: {
        gridTemplateColumns: '300px 1fr auto',
        gridTemplateAreas: `"userName userEmail userActiveTag"`,
      },
    },

    userName: {
      gridArea: 'userName',
      display: 'flex',
      alignItems: 'center',
    },
    userEmail: { gridArea: 'userEmail' },
    userRoleName: {
      gridArea: 'userRoleName',
      marginLeft: theme.spacing(1),
    },
    userIsActive: {
      gridArea: 'userActiveTag',
      justifySelf: 'end',
      backgroundColor: theme.palette.primary.main,
    },
    userIsInactive: {
      gridArea: 'userActiveTag',
      justifySelf: 'end',
      backgroundColor: theme.palette.error.main,
    },
  })
);

export interface UserListItemProps {
  user: UserDto;
  itemHeight: number;
}

const UserListItem = ({ user, itemHeight }: UserListItemProps) => {
  const { t } = useTranslation('users');
  const classes = useStyles();

  const [menuAnchorEl, setMenuAnchorEl] = useState<HTMLElement | null>(null);
  const { openDialog, closeDialog } = useDialog();
  const { canUpdateUsers } = useAuth();

  const queryClient = useQueryClient();
  const { updateUser } = useUpdateUserMutation({
    queryClient,
    messageOnSuccess: t(user.isActive ? 'inactivateUserSuccess' : 'activateUserSuccess'),
    messageOnFail: t(user.isActive ? 'inactivateUserFailed' : 'activateUserFailed'),
  });

  const openMenu = useCallback((e: MouseEvent<HTMLButtonElement>) => setMenuAnchorEl(e.currentTarget), []);
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
    const title = `${t('common:user')} ${user.isActive ? t('common:inactivate') : t('common:activate')}`;
    const message = t(user.isActive ? 'inactivateUserConfirm' : 'activateUserConfirm', { userName: user.name });

    openDialog(
      <ConfirmDialog
        title={title}
        message={message}
        onClose={(isConfirmed: boolean) => {
          isConfirmed && updateUser({ ...user, isActive: !user.isActive });
          closeDialog();
        }}
      />
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

  let actionButtons: { label: string; onClick: () => any }[] = [];

  if (canUpdateUsers) {
    actionButtons.push({
      label: t(user.isActive ? 'common:inactivate' : 'common:activate'),
      onClick: handleClickToggleActive,
    });
  }

  return (
    <ListItem divider style={{ height: itemHeight }}>
      <ListItemText>
        <div className={classes.userDetail}>
          <div className={classes.userName}>
            <UserName user={user} />
            <Chip className={classes.userRoleName} size="small" label={user.userRole.name} />
          </div>
          <Typography className={classes.userEmail}>{user.email}</Typography>
          <Chip
            className={user.isActive ? classes.userIsActive : classes.userIsInactive}
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
};

export default memo(UserListItem);
