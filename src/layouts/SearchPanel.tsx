import { Divider, Drawer, List, ListItem, Theme, Typography, createStyles, makeStyles } from '@material-ui/core';
import React, { ReactNode } from 'react';

import { SEARCH_PANEL_WIDTH } from 'const';
import { useScreenSize } from 'hooks/useScreenSize';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    searchPanel: {
      width: '75vw',
      maxWidth: SEARCH_PANEL_WIDTH,
    },
    drawerPaper: {
      width: '75vw',
      maxWidth: SEARCH_PANEL_WIDTH,
      flexShrink: 0,
    },
  })
);

export interface SearchPanelProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children?: ReactNode;
}

const SearchPanel = ({ isOpen, onClose, children, title }: SearchPanelProps) => {
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
      <List>
        <ListItem>
          <Typography variant="h6">{title}</Typography>
        </ListItem>
        <Divider />
        <ListItem>{children}</ListItem>
      </List>
    </Drawer>
  ) : null;
};

export default SearchPanel;
