import { DEFAULT_PAGE, NAV_WIDTH } from 'const';
import {
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

import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import { Link } from 'react-router-dom';
import React from 'react';
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
  })
);

export interface NavigationProps {
  isOpen: boolean;
  onClose: () => void;
}

const Navigation = ({ isOpen, onClose }: NavigationProps) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const theme = useTheme();
  const isPadLayout = useMediaQuery(theme.breakpoints.up('md'));

  const { logout } = useAuth();

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
      <List>
        <ListItem>
          <Link to={DEFAULT_PAGE} onClick={onClose}>
            <img className={classes.logo} src="/kwangil_logo_name.png" alt="kwangil logo"></img>
          </Link>
        </ListItem>
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
