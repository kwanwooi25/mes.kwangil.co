import React, { ReactNode, useState } from 'react';
import { Theme, createStyles, makeStyles } from '@material-ui/core';

import MainHeader from './MainHeader';
import Navigation from './Navigation';
import SearchPanel from './SearchPanel';
import { useScreenSize } from 'hooks/useScreenSize';

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
}

const Layout = ({ pageTitle, children, SearchPanelContent }: LayoutProps) => {
  const classes = useStyles();
  const { isMobileLayout, isDesktopLayout } = useScreenSize();

  const [isNavOpen, setIsNavOpen] = useState<boolean>(false);
  const [isSearchPanelOpen, setIsSearchPanelOpen] = useState<boolean>(false);

  const openNav = () => setIsNavOpen(true);
  const closeNav = () => setIsNavOpen(false);
  const openSearchPanel = () => setIsSearchPanelOpen(true);
  const closeSearchPanel = () => setIsSearchPanelOpen(false);

  return (
    <div className={classes.root}>
      <MainHeader
        pageTitle={pageTitle}
        onClickNavMenu={isMobileLayout ? openNav : undefined}
        onClickSearch={!isDesktopLayout && SearchPanelContent ? openSearchPanel : undefined}
      />
      <Navigation isOpen={isNavOpen} onClose={closeNav} />
      <div className={classes.content}>{children}</div>
      <SearchPanel isOpen={isSearchPanelOpen} onClose={closeSearchPanel}>
        <div className={classes.toolbar} />
        {SearchPanelContent}
      </SearchPanel>
    </div>
  );
};

export default Layout;
