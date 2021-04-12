import { DEFAULT_PAGE, NAV_ICONS, NAV_PATHS, NAV_WIDTH } from 'const';
import {
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Theme,
  createStyles,
  makeStyles,
  useMediaQuery,
  useTheme,
} from '@material-ui/core';
import React, { ElementType } from 'react';
import { useAppDispatch, useAppSelector } from 'store';

import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import { Link } from 'react-router-dom';
import { push } from 'connected-react-router';
import { useAuth } from 'features/auth/authHook';
import { useTranslation } from 'react-i18next';

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
  const theme = useTheme();
  const isPadLayout = useMediaQuery(theme.breakpoints.up('md'));

  const { logout } = useAuth();
  const { pathname } = useAppSelector((state) => state.router.location);
  const dispatch = useAppDispatch();

  const navListItems: NavListItemProps[] = NAV_PATHS.map((path) => ({
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

  return (
    <Drawer
      className={classes.navigation}
      open={isOpen}
      onClose={onClose}
      variant={isPadLayout ? 'permanent' : 'temporary'}
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
        <ListItem button onClick={logout}>
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
