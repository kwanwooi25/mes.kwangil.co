import {
  AppBar,
  Checkbox,
  Divider,
  FormControlLabel,
  IconButton,
  Theme,
  Toolbar,
  Tooltip,
  Typography,
  createStyles,
  fade,
  makeStyles,
} from '@material-ui/core';
import React, { ChangeEvent, ReactElement } from 'react';

import AddIcon from '@material-ui/icons/Add';
import CloseIcon from '@material-ui/icons/Close';
import IconButtonGroup from './IconButtonGroup';
import { useTranslation } from 'react-i18next';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    appBar: {
      background: theme.palette.background.paper,
      borderBottom: `0.5px solid ${fade(theme.palette.primary.light, 0.15)}`,
      zIndex: theme.zIndex.drawer,
    },
    selection: {
      display: 'flex',
      alignItems: 'center',
    },
    buttons: {
      marginLeft: 'auto',
    },
  })
);

export interface SubToolbarProps {
  isSelectedAll?: boolean;
  isIndeterminate?: boolean;
  onToggleSelectAll?: (checked: boolean) => void;
  onResetSelection?: () => void;
  selectedCount?: number;
  SelectModeButtons?: ReactElement | ReactElement[];
}

const SubToolbar = ({
  isSelectedAll = false,
  isIndeterminate = false,
  onToggleSelectAll = () => {},
  onResetSelection = () => {},
  selectedCount = 0,
  SelectModeButtons,
}: SubToolbarProps) => {
  const { t } = useTranslation('common');
  const classes = useStyles();

  const isSelectMode = selectedCount > 0;

  const toggleSelectAll = (e: ChangeEvent<HTMLInputElement>) => {
    onToggleSelectAll(e.target.checked);
  };

  return (
    <AppBar className={classes.appBar} color="inherit" position="relative" elevation={0}>
      <Toolbar>
        <div className={classes.selection}>
          <FormControlLabel
            control={
              <Checkbox
                color="primary"
                name="selectAll"
                checked={isSelectedAll}
                indeterminate={isIndeterminate}
                onChange={toggleSelectAll}
              />
            }
            label={t('selectAll')}
          />
          {isSelectMode && (
            <>
              <Divider orientation="vertical" style={{ height: 18 }} />
              <Typography
                dangerouslySetInnerHTML={{ __html: t('selectedCount', { count: selectedCount }) }}
                style={{ margin: '0 12px' }}
              />
              <Tooltip title={t('unselectAll') as string} placement="top">
                <IconButton onClick={onResetSelection}>
                  <CloseIcon />
                </IconButton>
              </Tooltip>
            </>
          )}
        </div>
        <div className={classes.buttons}>
          {isSelectMode ? (
            <IconButtonGroup>{SelectModeButtons}</IconButtonGroup>
          ) : (
            <IconButtonGroup>
              <Tooltip title={t('accounts:addAccount') as string} placement="top">
                <IconButton>
                  <AddIcon />
                </IconButton>
              </Tooltip>
            </IconButtonGroup>
          )}
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default SubToolbar;
