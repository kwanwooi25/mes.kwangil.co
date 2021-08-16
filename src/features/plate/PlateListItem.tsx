import ConfirmDialog from 'components/dialog/Confirm';
import PlateDialog from 'components/dialog/Plate';
import PlateName from 'components/PlateName';
import { useAuth } from 'features/auth/authHook';
import { useDialog } from 'features/dialog/dialogHook';
import React, { memo, MouseEvent, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from 'react-query';
import { getPlateProductsSummary, getPlateTitle } from 'utils/plate';
import { highlight } from 'utils/string';

import {
    Checkbox, createStyles, IconButton, ListItem, ListItemIcon, ListItemProps,
    ListItemSecondaryAction, ListItemText, makeStyles, Menu, MenuItem, Theme, Typography
} from '@material-ui/core';
import MoreVertIcon from '@material-ui/icons/MoreVert';

import { PlateDto, PlateFilter } from './interface';
import { useDeletePlatesMutation } from './usePlates';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    plateDetail: {
      display: 'grid',
      gridTemplateColumns: '1fr',
      gridTemplateAreas: `"title" "products"`,
      alignItems: 'center',
      [theme.breakpoints.up('sm')]: {
        gridTemplateColumns: '1fr 1fr',
        gridTemplateAreas: `"title products"`,
        gridColumnGap: theme.spacing(2),
      },
      [theme.breakpoints.up('md')]: {
        gridTemplateColumns: '1fr 3fr',
      },
    },
    title: {
      gridArea: 'title',
    },
    products: {
      gridArea: 'products',
      display: 'flex',
      [theme.breakpoints.up('sm')]: {
        flexDirection: 'column',
      },
      [theme.breakpoints.up('md')]: {
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 3fr) 1fr',
        gridColumnGap: theme.spacing(1),
      },
    },
  })
);

export interface PlateListItemProps extends ListItemProps {
  plate: PlateDto;
  itemHeight: number;
  isSelected?: boolean;
  productCountToDisplay?: number;
  filter: PlateFilter;
  toggleSelection?: (plate: PlateDto) => any;
  isSelectable?: boolean;
}

const PlateListItem = ({
  plate,
  itemHeight,
  isSelected = false,
  productCountToDisplay = 1,
  filter,
  toggleSelection = (plate: PlateDto) => {},
  isSelectable = true,
}: PlateListItemProps) => {
  const { t } = useTranslation('plates');
  const classes = useStyles();

  const { openDialog, closeDialog } = useDialog();
  const { canUpdatePlates, canDeletePlates } = useAuth();

  const [menuAnchorEl, setMenuAnchorEl] = useState<HTMLElement | null>(null);

  const queryClient = useQueryClient();
  const { deletePlates } = useDeletePlatesMutation({ queryClient });

  const productsSummary = getPlateProductsSummary(plate, productCountToDisplay);

  const handleSelectionChange = () => toggleSelection(plate);

  const openMenu = useCallback((e: MouseEvent<HTMLButtonElement>) => setMenuAnchorEl(e.currentTarget), []);
  const closeMenu = useCallback(() => setMenuAnchorEl(null), []);

  const handleClickMenuItem =
    (onClick = () => {}) =>
    () => {
      closeMenu();
      onClick();
    };

  const handleClickEdit = () => openDialog(<PlateDialog plate={plate} onClose={closeDialog} />);

  const handleClickDelete = () =>
    openDialog(
      <ConfirmDialog
        title={t('deletePlate')}
        message={t('deletePlateConfirm', { plateTitle: getPlateTitle(plate) })}
        onClose={(isConfirmed: boolean) => {
          isConfirmed && deletePlates([plate.id]);
          closeDialog();
        }}
      />
    );

  let actionButtons = [];

  if (canUpdatePlates) {
    actionButtons.push({ label: t('common:edit'), onClick: handleClickEdit });
  }
  if (canDeletePlates) {
    actionButtons.push({ label: t('common:delete'), onClick: handleClickDelete });
  }

  return (
    <ListItem divider style={{ height: itemHeight }} selected={isSelected}>
      {isSelectable && (
        <ListItemIcon>
          <Checkbox edge="start" color="primary" checked={isSelected} onChange={handleSelectionChange} />
        </ListItemIcon>
      )}
      <ListItemText>
        <div className={classes.plateDetail}>
          <PlateName className={classes.title} plate={plate} searchText={filter.name} />
          <div className={classes.products}>
            {productsSummary.map((product) => (
              <Typography
                key={product}
                variant="caption"
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
};

export default memo(PlateListItem);
