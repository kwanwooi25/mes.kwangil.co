import { useAppDispatch, useAppSelector } from 'app/store';
import { push } from 'connected-react-router';
import { DEFAULT_PAGE, NAV_ICONS, NAV_WIDTH } from 'const';
import { useAuth } from 'features/auth/authHook';
import { useScreenSize } from 'hooks/useScreenSize';
import React, { ElementType } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import {
    createStyles, Divider, Drawer, List, ListItem, ListItemIcon, ListItemText, makeStyles, Theme
} from '@material-ui/core';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    navigation: {
      width: NAV_WIDTH,
    },
    drawerPaper: {
      width: NAV_WIDTH,
      flexShrink: 0,
    },
    logo: {
      height: '32px',
      padding: theme.spacing(0.5, 0),
    },
    navList: {
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
    },
    navItemList: {
      flexGrow: 1,
    },
  })
);

export interface NavigationProps {
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

const NavListItem = ({ isActive, label, Icon, onClick }: NavListItemProps) => {
  return (
    <ListItem button selected={isActive} onClick={onClick}>
      <ListItemIcon>
        <Icon />
      </ListItemIcon>
      <ListItemText primary={label} />
    </ListItem>
  );
};

const Navigation = ({ isOpen, onClose }: NavigationProps) => {
  const { t } = useTranslation('nav');
  const classes = useStyles();
  const { isMobileLayout } = useScreenSize();

  const { navPaths, loginFailed } = useAuth();
  const { pathname } = useAppSelector((state) => state.router.location);
  const dispatch = useAppDispatch();

  const navListItems: NavListItemProps[] = navPaths.map((path) => ({
    isActive: path === pathname,
    path,
    label: t(path.replace(/\//, '')),
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
      className={classes.navigation}
      open={isOpen}
      onClose={onClose}
      variant={isMobileLayout ? 'temporary' : 'permanent'}
      classes={{
        paper: classes.drawerPaper,
      }}
    >
      <List className={classes.navList}>
        <ListItem>
          <Link to={DEFAULT_PAGE} onClick={onClose}>
            <img className={classes.logo} src="/kwangil_logo_name.png" alt="kwangil logo"></img>
          </Link>
        </ListItem>
        <Divider />
        <List className={classes.navItemList}>
          {navListItems.map(({ onClick, ...props }) => (
            <NavListItem key={props.path} {...props} onClick={handleClickListItem(onClick)} />
          ))}
        </List>
        <Divider />
        <ListItem button onClick={logoutUser}>
          <ListItemIcon>
            <ExitToAppIcon />
          </ListItemIcon>
          <ListItemText primary={t('auth:logout')} />
        </ListItem>
      </List>
    </Drawer>
  );
};

export default Navigation;
