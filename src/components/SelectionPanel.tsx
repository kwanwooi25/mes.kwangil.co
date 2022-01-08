import { NAV_WIDTH, SEARCH_PANEL_WIDTH } from 'const';
import React, { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';

import {
  createStyles,
  Grid,
  IconButton,
  makeStyles,
  Paper,
  Slide,
  Theme,
  Typography,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    selectionPanel: {
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      padding: theme.spacing(1),
      zIndex: theme.zIndex.drawer - 1,
      borderRadius: theme.spacing(1, 1, 0, 0),
      [theme.breakpoints.up('md')]: {
        left: NAV_WIDTH,
      },
      [theme.breakpoints.up('xl')]: {
        right: SEARCH_PANEL_WIDTH,
      },
    },
    panelContent: {
      width: '100%',
      margin: 'auto',
      padding: 0,
    },
    panelActions: {
      marginLeft: 'auto',
    },
  }),
);

export interface SelectionPanelProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCount: number;
  children: ReactElement | ReactElement[];
}

function SelectionPanel({ isOpen, onClose, selectedCount, children }: SelectionPanelProps) {
  const { t } = useTranslation('common');
  const classes = useStyles();

  return (
    <Slide in={isOpen} direction="up">
      <Paper className={classes.selectionPanel} elevation={4}>
        <Grid className={classes.panelContent} container alignItems="center" spacing={1}>
          <Grid item>
            <IconButton aria-label="close" onClick={onClose}>
              <CloseIcon />
            </IconButton>
          </Grid>
          <Grid item>
            <Typography
              dangerouslySetInnerHTML={{ __html: t('selectedCount', { count: selectedCount }) }}
            />
          </Grid>
          <Grid item className={classes.panelActions}>
            {children}
          </Grid>
        </Grid>
      </Paper>
    </Slide>
  );
}

export default SelectionPanel;
