import React, { ReactNode } from 'react';
import { Theme, createStyles, makeStyles } from '@material-ui/core';

import MainHeader from './MainHeader';
import Navigation from './Navigation';
import SearchPanel from './SearchPanel';
import { useAppDispatch } from 'app/store';
import { useScreenSize } from 'hooks/useScreenSize';
import { useUI } from 'features/ui/uiHook';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      height: '100vh',
      overflow: 'hidden',
    },
    toolbar: theme.mixins.toolbar,
    content: {
      flexGrow: 1,
      height: 'calc(100vh - 56px)',
      marginTop: 56,
      [theme.breakpoints.up('sm')]: {
        height: 'calc(100vh - 64px)',
        marginTop: 64,
      },
    },
  })
);

export interface LayoutProps {
  pageTitle: string;
  children: ReactNode;
  SearchPanelContent?: ReactNode;
  searchPanelTitle?: string;
}

const Layout = ({ pageTitle, children, SearchPanelContent, searchPanelTitle = '' }: LayoutProps) => {
  const classes = useStyles();
  const { isMobileLayout, isDesktopLayout } = useScreenSize();
  const { isNavOpen, openNav, closeNav, isSearchOpen, openSearch, closeSearch } = useUI();
  const dispatch = useAppDispatch();

  const handleClickNavMenu = isMobileLayout ? () => dispatch(openNav()) : undefined;
  const handleClickSearch = !isDesktopLayout && SearchPanelContent ? () => dispatch(openSearch()) : undefined;
  const handleCloseNav = () => dispatch(closeNav());
  const handleCloseSearch = () => dispatch(closeSearch());

  return (
    <div className={classes.root}>
      <MainHeader pageTitle={pageTitle} onClickNavMenu={handleClickNavMenu} onClickSearch={handleClickSearch} />
      <Navigation isOpen={isNavOpen} onClose={handleCloseNav} />
      <div className={classes.content}>{children}</div>
      <SearchPanel isOpen={isSearchOpen} onClose={handleCloseSearch} title={searchPanelTitle}>
        {SearchPanelContent}
      </SearchPanel>
    </div>
  );
};

export default Layout;
