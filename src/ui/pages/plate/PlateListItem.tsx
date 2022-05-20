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
import { getPlateTitle } from 'utils/plate';

import MoreVertIcon from '@mui/icons-material/MoreVert';
import {
  Checkbox,
  Chip,
  IconButton,
  ListItem,
  ListItemIcon,
  ListItemProps,
  ListItemSecondaryAction,
  ListItemText,
  Menu,
  MenuItem,
  Popover,
} from '@mui/material';

import PlateProductListItem from './PlateProductListItem';

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
  const [moreProductsAnchorEl, setMoreProductsAnchorEl] = useState<HTMLElement | null>(null);

  const queryClient = useQueryClient();
  const { deletePlates } = useDeletePlatesMutation({ queryClient });

  const handleSelectionChange = () => toggleSelection(plate);

  const openMenu = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => setMenuAnchorEl(e.currentTarget),
    [],
  );
  const closeMenu = useCallback(() => setMenuAnchorEl(null), []);
  const openMoreProducts = useCallback(
    (e: MouseEvent<HTMLElement>) => setMoreProductsAnchorEl(e.currentTarget),
    [],
  );
  const closeMoreProducts = useCallback(() => setMoreProductsAnchorEl(null), []);

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
        <div className="flex flex-col desktop:grid desktop:grid-cols-[60px_1fr_2fr] desktop:gap-1">
          <span className="flex justify-start items-center">
            <Chip label={plate.id} size="small" />
          </span>
          <PlateName plate={plate} searchText={filter.name} />
          <ul className="flex flex-col gap-1 px-2 desktop:justify-center">
            {plate.products.slice(0, productCountToDisplay).map((product, index) => (
              <PlateProductListItem key={product.id} product={product} filter={filter}>
                {index >= productCountToDisplay - 1 &&
                  plate.products.length > productCountToDisplay && (
                    <span
                      className="self-start text-xs cursor-pointer"
                      onMouseEnter={openMoreProducts}
                      onMouseLeave={closeMoreProducts}
                    >
                      ... +{plate.products.length - productCountToDisplay} more
                      <Popover
                        classes={{ paper: 'p-2 mr-2' }}
                        sx={{ pointerEvents: 'none' }}
                        open={!!moreProductsAnchorEl}
                        anchorEl={moreProductsAnchorEl}
                        onClose={closeMoreProducts}
                        anchorOrigin={{
                          vertical: 'top',
                          horizontal: 'right',
                        }}
                        transformOrigin={{
                          vertical: 'bottom',
                          horizontal: 'right',
                        }}
                        disableRestoreFocus
                      >
                        <ul className="flex flex-col gap-1">
                          {plate.products.slice(productCountToDisplay).map((p) => (
                            <PlateProductListItem key={p.id} product={p} filter={filter} />
                          ))}
                        </ul>
                      </Popover>
                    </span>
                  )}
              </PlateProductListItem>
            ))}
          </ul>
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
