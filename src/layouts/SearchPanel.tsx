import { Drawer, Theme, createStyles, makeStyles, useMediaQuery, useTheme } from '@material-ui/core';
import React, { ReactNode } from 'react';

import { SEARCH_PANEL_WIDTH } from 'const';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    searchPanel: {},
    drawerPaper: {
      width: SEARCH_PANEL_WIDTH,
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
  const theme = useTheme();
  const isDesktopLayout = useMediaQuery(theme.breakpoints.up('lg'));

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
