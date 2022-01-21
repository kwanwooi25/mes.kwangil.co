import React, { ChangeEvent, ReactElement } from 'react';
import { useTranslation } from 'react-i18next';

import {
  AppBar,
  Checkbox,
  Divider,
  FormControlLabel,
  IconButton,
  Toolbar,
  Tooltip,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import IconButtonGroup from './IconButtonGroup';

export interface SubToolbarProps {
  isSelectAllDisabled?: boolean;
  isSelectedAll?: boolean;
  isIndeterminate?: boolean;
  onToggleSelectAll?: (checked: boolean) => void;
  onResetSelection?: () => void;
  selectedCount?: number;
  buttons?: ReactElement | ReactElement[];
}

function SubToolbar({
  isSelectAllDisabled = false,
  isSelectedAll = false,
  isIndeterminate = false,
  onToggleSelectAll = () => {},
  onResetSelection = () => {},
  selectedCount = 0,
  buttons,
}: SubToolbarProps) {
  const { t } = useTranslation('common');

  const isSelectMode = selectedCount > 0;

  const toggleSelectAll = (e: ChangeEvent<HTMLInputElement>) => {
    onToggleSelectAll(e.target.checked);
  };

  return (
    <AppBar
      className="bg-gray-200 border-b border-b-gray-200"
      color="transparent"
      position="relative"
      elevation={0}
    >
      <Toolbar className="!px-4" variant="dense">
        <div className="flex items-center">
          <FormControlLabel
            control={
              <Checkbox
                color="primary"
                name="selectAll"
                checked={isSelectedAll}
                indeterminate={isIndeterminate}
                onChange={toggleSelectAll}
                disabled={isSelectAllDisabled}
              />
            }
            label={t('selectAll') as string}
          />
          {isSelectMode && (
            <>
              <Divider className="!h-4" orientation="vertical" />
              <span
                className="mx-3"
                dangerouslySetInnerHTML={{ __html: t('selectedCount', { count: selectedCount }) }}
              />
              <Tooltip title={t('unselectAll') as string} placement="top">
                <IconButton onClick={onResetSelection}>
                  <CloseIcon />
                </IconButton>
              </Tooltip>
            </>
          )}
        </div>
        <IconButtonGroup className="ml-auto">{buttons}</IconButtonGroup>
      </Toolbar>
    </AppBar>
  );
}

export default SubToolbar;
