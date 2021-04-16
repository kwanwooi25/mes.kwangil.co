import { Drawer, Theme, createStyles, makeStyles } from '@material-ui/core';
import React, { ReactNode } from 'react';

import { SEARCH_PANEL_WIDTH } from 'const';
import { useScreenSize } from 'hooks/useScreenSize';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    searchPanel: {
      width: SEARCH_PANEL_WIDTH,
    },
    drawerPaper: {
      width: SEARCH_PANEL_WIDTH,
      flexShrink: 0,
    },
  })
);

export interface SearchPanelProps {
  isOpen: boolean;
  onClose: () => void;
  children?: ReactNode;
}

const SearchPanel = ({ isOpen, onClose, children }: SearchPanelProps) => {
  const classes = useStyles();
  const { isDesktopLayout } = useScreenSize();

  return !!children ? (
    <Drawer
      className={classes.searchPanel}
      anchor="right"
      open={isOpen}
      onClose={onClose}
      variant={isDesktopLayout ? 'permanent' : 'temporary'}
      classes={{
        paper: classes.drawerPaper,
      }}
    >
      {children}
    </Drawer>
  ) : null;
};

export default SearchPanel;
