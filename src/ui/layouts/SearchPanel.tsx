import { Drawer, List, ListItem, ListItemIcon, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import React, { ReactNode } from 'react';

import { useScreenSize } from 'hooks/useScreenSize';
import classNames from 'classnames';

export interface SearchPanelProps {
  className?: string;
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children?: ReactNode;
}

function SearchPanel({ className, isOpen, onClose, children, title }: SearchPanelProps) {
  const { isLaptopLayout, isDesktopLayout } = useScreenSize();
  const shouldFixDrawer = isLaptopLayout || isDesktopLayout;

  return children ? (
    <Drawer
      className={classNames('w-search-panel', className)}
      anchor="right"
      open={isOpen}
      onClose={onClose}
      variant={shouldFixDrawer ? 'permanent' : 'temporary'}
      classes={{
        paper: 'w-search-panel',
      }}
    >
      <List>
        <ListItem>
          <ListItemIcon>
            {shouldFixDrawer ? (
              <SearchIcon />
            ) : (
              <IconButton onClick={onClose}>
                <CloseIcon />
              </IconButton>
            )}
          </ListItemIcon>
          <h2>{title}</h2>
        </ListItem>
        <ListItem>{children}</ListItem>
      </List>
    </Drawer>
  ) : null;
}

export default SearchPanel;
