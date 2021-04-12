import React, { ReactNode, useState } from 'react';
import { Theme, createStyles, makeStyles, useMediaQuery, useTheme } from '@material-ui/core';

import MainHeader from './MainHeader';
import Navigation from './Navigation';
import SearchPanel from './SearchPanel';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
    },
    toolbar: theme.mixins.toolbar,
    content: {
      flexGrow: 1,
      padding: theme.spacing(3),
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
  const theme = useTheme();
  const isPadLayout = useMediaQuery(theme.breakpoints.up('md'));
  const isDesktopLayout = useMediaQuery(theme.breakpoints.up('lg'));

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
        onClickNavMenu={!isPadLayout ? openNav : undefined}
        onClickSearch={!isDesktopLayout && SearchPanelContent ? openSearchPanel : undefined}
      />
      <Navigation isOpen={isNavOpen} onClose={closeNav} />
      <div className={classes.content}>
        <div className={classes.toolbar} />
        {children}
      </div>
      <SearchPanel isOpen={isSearchPanelOpen} onClose={closeSearchPanel}>
        {SearchPanelContent}
      </SearchPanel>
    </div>
  );
};

export default Layout;
