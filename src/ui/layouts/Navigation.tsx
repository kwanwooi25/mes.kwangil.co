import { useAppDispatch, useAppSelector } from 'app/store';
import { push } from 'connected-react-router';
import { DEFAULT_PAGE, NAV_ICONS } from 'const';
import { useAuth } from 'features/auth/authHook';
import { useScreenSize } from 'hooks/useScreenSize';
import React, { ElementType } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { Divider, Drawer, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { ExitToApp } from '@mui/icons-material';
import classNames from 'classnames';

export interface NavigationProps {
  className?: string;
  isOpen: boolean;
  onClose: () => void;
}

export interface NavListItemProps {
  isActive: boolean;
  path: string;
  label: string;
  Icon: ElementType;
  onClick: () => void;
}

function NavListItem({ isActive, label, Icon, onClick }: NavListItemProps) {
  return (
    <ListItem button selected={isActive} onClick={onClick}>
      <ListItemIcon>
        <Icon />
      </ListItemIcon>
      <ListItemText primary={label} />
    </ListItem>
  );
}

function Navigation({ className, isOpen, onClose }: NavigationProps) {
  const { t } = useTranslation('nav');
  const { isMobileLayout } = useScreenSize();

  const { navPaths, loginFailed } = useAuth();
  const { pathname } = useAppSelector((state) => state.router.location);
  const dispatch = useAppDispatch();

  const navListItems: NavListItemProps[] = navPaths.map((path) => ({
    isActive: path === pathname,
    path,
    label: t(path),
    Icon: NAV_ICONS[path],
    onClick: () => dispatch(push(path)),
  }));

  const handleClickListItem = (onClick: () => void) => () => {
    onClick();
    onClose();
  };

  const logoutUser = () => dispatch(loginFailed());

  return (
    <Drawer
      className={classNames('w-nav', className)}
      open={isOpen}
      onClose={onClose}
      variant={isMobileLayout ? 'temporary' : 'permanent'}
      classes={{
        paper: 'w-nav',
      }}
    >
      <List className="flex flex-col h-full">
        <ListItem>
          <Link to={DEFAULT_PAGE} onClick={onClose}>
            <img className="py-1 h-8" src="/kwangil_logo_name.png" alt="kwangil logo" />
          </Link>
        </ListItem>
        <List className="grow">
          {navListItems.map(({ onClick, ...props }) => (
            <NavListItem key={props.path} {...props} onClick={handleClickListItem(onClick)} />
          ))}
        </List>
        <Divider />
        <ListItem button onClick={logoutUser}>
          <ListItemIcon>
            <ExitToApp />
          </ListItemIcon>
          <ListItemText primary={t('auth:logout')} />
        </ListItem>
      </List>
    </Drawer>
  );
}

export default Navigation;
