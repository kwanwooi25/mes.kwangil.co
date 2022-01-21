import React from 'react';

import { AppBar, IconButton, Toolbar } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';

export interface MainHeaderProps {
  pageTitle: string;
  onClickNavMenu?: () => void;
  onClickSearch?: () => void;
}

function MainHeader({ pageTitle, onClickNavMenu, onClickSearch }: MainHeaderProps) {
  return (
    <AppBar
      className="!z-[1201] border-b border-b-gray-200"
      position="fixed"
      color="inherit"
      elevation={0}
    >
      <Toolbar variant="dense">
        {onClickNavMenu ? (
          <IconButton edge="start" aria-label="nav-menu" onClick={onClickNavMenu}>
            <MenuIcon />
          </IconButton>
        ) : (
          <img className="mr-3 h-7" src="/kwangil_logo_only.png" alt="logo" />
        )}
        <h1 className="flex-1 text-xl font-bold">{pageTitle}</h1>
        {!!onClickSearch && (
          <IconButton edge="end" aria-label="search" onClick={onClickSearch}>
            <SearchIcon />
          </IconButton>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default MainHeader;
