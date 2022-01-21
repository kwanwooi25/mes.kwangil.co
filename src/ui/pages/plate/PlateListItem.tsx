import { useAuth } from 'features/auth/authHook';
import { useDialog } from 'features/dialog/dialogHook';
import { PlateDto, PlateFilter } from 'features/plate/interface';
import { useDeletePlatesMutation } from 'features/plate/usePlates';
import React, { memo, MouseEvent, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from 'react-query';
import ConfirmDialog from 'ui/dialog/Confirm';
import PlateDialog from 'ui/dialog/Plate';
import PlateName from 'ui/elements/PlateName';
import { getPlateProductsSummary, getPlateTitle } from 'utils/plate';
import { highlight } from 'utils/string';

import MoreVertIcon from '@mui/icons-material/MoreVert';
import {
  Checkbox,
  IconButton,
  ListItem,
  ListItemIcon,
  ListItemProps,
  ListItemSecondaryAction,
  ListItemText,
  Menu,
  MenuItem,
} from '@mui/material';

export interface PlateListItemProps extends ListItemProps {
  plate: PlateDto;
  itemHeight: number;
  isSelected?: boolean;
  productCountToDisplay?: number;
  filter: PlateFilter;
  toggleSelection?: (plate: PlateDto) => any;
  isSelectable?: boolean;
}

function PlateListItem({
  plate,
  itemHeight,
  isSelected = false,
  productCountToDisplay = 1,
  filter,
  toggleSelection = () => {},
  isSelectable = true,
}: PlateListItemProps) {
  const { t } = useTranslation('plates');

  const { openDialog, closeDialog } = useDialog();
  const { canUpdatePlates, canDeletePlates } = useAuth();

  const [menuAnchorEl, setMenuAnchorEl] = useState<HTMLElement | null>(null);

  const queryClient = useQueryClient();
  const { deletePlates } = useDeletePlatesMutation({ queryClient });

  const productsSummary = getPlateProductsSummary(plate, productCountToDisplay);

  const handleSelectionChange = () => toggleSelection(plate);

  const openMenu = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => setMenuAnchorEl(e.currentTarget),
    [],
  );
  const closeMenu = useCallback(() => setMenuAnchorEl(null), []);

  const handleClickMenuItem =
    (onClick = () => {}) =>
    () => {
      closeMenu();
      onClick();
    };

  const handleClickEdit = () =>
    openDialog(<PlateDialog plate={plate} products={plate.products} onClose={closeDialog} />);

  const handleClickDelete = () =>
    openDialog(
      <ConfirmDialog
        title={t('deletePlate')}
        message={t('deletePlateConfirm', { plateTitle: getPlateTitle(plate) })}
        onClose={(isConfirmed: boolean) => {
          if (isConfirmed) deletePlates([plate.id]);
          closeDialog();
        }}
      />,
    );

  const actionButtons = [];

  if (canUpdatePlates) {
    actionButtons.push({ label: t('common:edit'), onClick: handleClickEdit });
  }
  if (canDeletePlates) {
    actionButtons.push({ label: t('common:delete'), onClick: handleClickDelete });
  }

  return (
    <ListItem divider style={{ height: itemHeight }} selected={isSelected}>
      {isSelectable && (
        <ListItemIcon className="!min-w-0">
          <Checkbox
            edge="start"
            color="primary"
            checked={isSelected}
            onChange={handleSelectionChange}
          />
        </ListItemIcon>
      )}
      <ListItemText>
        <div className="flex flex-col">
          <PlateName plate={plate} searchText={filter.name} />
          <div className="flex gap-x-2 px-2">
            {productsSummary.map((product) => (
              <span
                className="text-xs"
                key={product}
                dangerouslySetInnerHTML={{ __html: highlight(product, filter.productName) }}
              />
            ))}
          </div>
        </div>
      </ListItemText>
      {!!actionButtons.length && (
        <ListItemSecondaryAction>
          <IconButton edge="end" onClick={openMenu}>
            <MoreVertIcon />
          </IconButton>
          <Menu anchorEl={menuAnchorEl} open={Boolean(menuAnchorEl)} onClose={closeMenu}>
            {actionButtons.map(({ label, onClick }) => (
              <MenuItem key={label} onClick={handleClickMenuItem(onClick)}>
                {label}
              </MenuItem>
            ))}
          </Menu>
        </ListItemSecondaryAction>
      )}
    </ListItem>
  );
}

export default memo(PlateListItem);
