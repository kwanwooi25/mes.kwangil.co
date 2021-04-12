import { AppBar, IconButton, Theme, Toolbar, Typography, createStyles, fade, makeStyles } from '@material-ui/core';

import MenuIcon from '@material-ui/icons/Menu';
import React from 'react';
import SearchIcon from '@material-ui/icons/Search';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    appBar: {
      background: theme.palette.background.paper,
      borderBottom: `0.5px solid ${fade(theme.palette.primary.light, 0.15)}`,
      zIndex: theme.zIndex.drawer + 1,
    },
    pageTitle: {
      flex: 1,
      fontWeight: theme.typography.fontWeightBold,
    },
  })
);

export interface MainHeaderProps {
  pageTitle: string;
  onClickNavMenu?: () => void;
  onClickSearch?: () => void;
}

const MainHeader = ({ pageTitle, onClickNavMenu, onClickSearch }: MainHeaderProps) => {
  const classes = useStyles();

  return (
    <AppBar className={classes.appBar} position="fixed" color="inherit" elevation={0}>
      <Toolbar>
        {!!onClickNavMenu && (
          <IconButton edge="start" aria-label="nav-menu" onClick={onClickNavMenu}>
            <MenuIcon />
          </IconButton>
        )}
        <Typography component="h2" variant="h5" className={classes.pageTitle}>
          {pageTitle}
        </Typography>
        {!!onClickSearch && (
          <IconButton edge="end" aria-label="search" onClick={onClickSearch}>
            <SearchIcon />
          </IconButton>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default MainHeader;
