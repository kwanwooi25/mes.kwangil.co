import {
  AppBar,
  Checkbox,
  FormControlLabel,
  IconButton,
  Theme,
  Toolbar,
  Tooltip,
  createStyles,
  fade,
  makeStyles,
} from '@material-ui/core';
import React, { ChangeEvent, useState } from 'react';

import AddIcon from '@material-ui/icons/Add';
import IconButtonGroup from './IconButtonGroup';
import { useTranslation } from 'react-i18next';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    appBar: {
      background: theme.palette.background.paper,
      borderBottom: `0.5px solid ${fade(theme.palette.primary.light, 0.15)}`,
      zIndex: theme.zIndex.drawer,
    },
    buttons: {
      marginLeft: 'auto',
    },
  })
);

export interface SubToolbarProps {}

const SubToolbar = (props: SubToolbarProps) => {
  const { t } = useTranslation('common');
  const classes = useStyles();
  const [isSelectedAll, setIsSelectedAll] = useState<boolean>(false);

  const toggleSelectAll = (e: ChangeEvent<HTMLInputElement>) => {
    setIsSelectedAll(e.target.checked);
  };

  return (
    <AppBar className={classes.appBar} color="inherit" position="relative" elevation={0}>
      <Toolbar>
        <FormControlLabel
          control={<Checkbox color="primary" name="selectAll" checked={isSelectedAll} onChange={toggleSelectAll} />}
          label={t('selectAll')}
        />
        <IconButtonGroup className={classes.buttons}>
          <Tooltip title={t('accounts:addAccount') as string} placement="top">
            <IconButton>
              <AddIcon />
            </IconButton>
          </Tooltip>
        </IconButtonGroup>
      </Toolbar>
    </AppBar>
  );
};

export default SubToolbar;
