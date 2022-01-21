import { useAppDispatch } from 'app/store';
import { useUI } from 'features/ui/uiHook';
import { useScreenSize } from 'hooks/useScreenSize';
import React, { ReactNode } from 'react';

import MainHeader from './MainHeader';
import Navigation from './Navigation';
import SearchPanel from './SearchPanel';

export interface LayoutProps {
  pageTitle: string;
  children: ReactNode;
  SearchPanelContent?: ReactNode;
  searchPanelTitle?: string;
}

function Layout({ pageTitle, children, SearchPanelContent, searchPanelTitle = '' }: LayoutProps) {
  const { isMobileLayout, isLaptopLayout, isDesktopLayout } = useScreenSize();
  const { isNavOpen, openNav, closeNav, isSearchOpen, openSearch, closeSearch } = useUI();
  const dispatch = useAppDispatch();

  const isNavigationPermanent = !isMobileLayout;
  const isSearchPanelPermanent = isLaptopLayout || isDesktopLayout;

  const handleClickNavMenu = isNavigationPermanent ? undefined : () => dispatch(openNav());
  const handleClickSearch =
    !isSearchPanelPermanent && SearchPanelContent ? () => dispatch(openSearch()) : undefined;
  const handleCloseNav = () => dispatch(closeNav());
  const handleCloseSearch = () => dispatch(closeSearch());

  return (
    <div className="flex overflow-hidden h-screen">
      <MainHeader
        pageTitle={pageTitle}
        onClickNavMenu={handleClickNavMenu}
        onClickSearch={handleClickSearch}
      />
      <Navigation
        className={!isNavigationPermanent ? '!z-[1201]' : ''}
        isOpen={isNavOpen}
        onClose={handleCloseNav}
      />
      <div className="overflow-auto relative grow mt-[48px] h-[calc(100vh-48px)]">{children}</div>
      <SearchPanel
        className={!isSearchPanelPermanent ? '!z-[1201]' : ''}
        isOpen={isSearchOpen}
        onClose={handleCloseSearch}
        title={searchPanelTitle}
      >
        {SearchPanelContent}
      </SearchPanel>
    </div>
  );
}

export default Layout;
