import {
  Divider,
  Drawer,
  List,
  ListItem,
  Theme,
  Typography,
  createStyles,
  makeStyles,
  ListItemIcon,
  IconButton,
} from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import CloseIcon from '@material-ui/icons/Close';
import React, { ReactNode } from 'react';

import { SEARCH_PANEL_WIDTH } from 'const';
import { useScreenSize } from 'hooks/useScreenSize';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    toolbar: theme.mixins.toolbar,
    searchPanel: {
      width: '75vw',
      maxWidth: SEARCH_PANEL_WIDTH,
    },
    drawerPaper: {
      width: '75vw',
      maxWidth: SEARCH_PANEL_WIDTH,
      flexShrink: 0,
    },
  }),
);

export interface SearchPanelProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children?: ReactNode;
}

function SearchPanel({ isOpen, onClose, children, title }: SearchPanelProps) {
  const classes = useStyles();
  const { isDesktopLayout } = useScreenSize();

  return children ? (
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
      {isDesktopLayout && <div className={classes.toolbar} />}
      <List>
        <ListItem>
          <ListItemIcon>
            {isDesktopLayout ? (
              <SearchIcon />
            ) : (
              <IconButton onClick={onClose}>
                <CloseIcon />
              </IconButton>
            )}
          </ListItemIcon>
          <Typography variant="h6">{title}</Typography>
        </ListItem>
        <Divider />
        <ListItem>{children}</ListItem>
      </List>
    </Drawer>
  ) : null;
}

export default SearchPanel;
