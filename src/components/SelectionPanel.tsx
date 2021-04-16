import { Grid, IconButton, Paper, Slide, Theme, Typography, createStyles, makeStyles } from '@material-ui/core';
import React, { ReactElement } from 'react';

import CloseIcon from '@material-ui/icons/Close';
import { useTranslation } from 'react-i18next';

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
    },
    panelContent: {
      maxWidth: theme.breakpoints.values.lg - theme.spacing(4),
      width: '100%',
      margin: 'auto',
      padding: 0,
    },
    panelActions: {
      marginLeft: 'auto',
    },
  })
);

export interface SelectionPanelProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCount: number;
  children: ReactElement | ReactElement[];
}

const SelectionPanel = ({ isOpen, onClose, selectedCount, children }: SelectionPanelProps) => {
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
            <Typography dangerouslySetInnerHTML={{ __html: t('selectedCount', { count: selectedCount }) }} />
          </Grid>
          <Grid item className={classes.panelActions}>
            {children}
          </Grid>
        </Grid>
      </Paper>
    </Slide>
  );
};

export default SelectionPanel;
