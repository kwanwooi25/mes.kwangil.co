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
  Theme,
  Typography,
  createStyles,
  makeStyles,
} from '@material-ui/core';
import React, { MouseEvent, memo, useCallback, useState } from 'react';
import { getPlateProductsSummary, getPlateTitle } from 'utils/plate';
import { plateActions, plateSelectors } from './plateSlice';
import { useAppDispatch, useAppSelector } from 'app/store';

import ConfirmDialog from 'components/dialog/Confirm';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import PlateDialog from 'components/dialog/Plate';
import { PlateDto } from './interface';
import PlateName from 'components/PlateName';
import { Skeleton } from '@material-ui/lab';
import { highlight } from 'utils/string';
import { useAuth } from 'features/auth/authHook';
import { useDialog } from 'features/dialog/dialogHook';
import { useTranslation } from 'react-i18next';

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
}

const PlateListItem = ({ plate, itemHeight, isSelected = false, productCountToDisplay = 1 }: PlateListItemProps) => {
  const { t } = useTranslation('plates');
  const classes = useStyles();

  const dispatch = useAppDispatch();
  const { name, productName } = useAppSelector(plateSelectors.query);
  const { toggleSelection, deletePlates } = plateActions;
  const { openDialog, closeDialog } = useDialog();
  const { isUser } = useAuth();

  const [menuAnchorEl, setMenuAnchorEl] = useState<HTMLElement | null>(null);

  const productsSummary = getPlateProductsSummary(plate, productCountToDisplay);

  const handleSelectionChange = useCallback(() => {
    dispatch(toggleSelection(plate.id));
  }, []);

  const openMenu = useCallback((e: MouseEvent<HTMLButtonElement>) => setMenuAnchorEl(e.currentTarget), []);
  const closeMenu = useCallback(() => setMenuAnchorEl(null), []);

  const handleClickMenuItem = (onClick = () => {}) => () => {
    closeMenu();
    onClick();
  };

  const handleClickEdit = useCallback(() => {
    openDialog(<PlateDialog plate={plate} onClose={closeDialog} />);
  }, []);

  const handleClickDelete = useCallback(() => {
    openDialog(
      <ConfirmDialog
        title={t('deletePlate')}
        message={t('deletePlateConfirm', { plateTitle: getPlateTitle(plate) })}
        onClose={(isConfirmed: boolean) => {
          isConfirmed && dispatch(deletePlates([plate.id]));
          closeDialog();
        }}
      />
    );
  }, []);

  const actionButtons = [
    { label: t('common:edit'), onClick: handleClickEdit },
    { label: t('common:delete'), onClick: handleClickDelete },
  ];

  return (
    <ListItem divider style={{ height: itemHeight }} selected={isSelected}>
      {!isUser && (
        <ListItemIcon>
          <Checkbox edge="start" color="primary" checked={isSelected} onChange={handleSelectionChange} />
        </ListItemIcon>
      )}
      <ListItemText>
        <div className={classes.plateDetail}>
          <PlateName className={classes.title} plate={plate} searchText={name} />
          <div className={classes.products}>
            {productsSummary.map((product) => (
              <Typography
                key={product}
                variant="caption"
                dangerouslySetInnerHTML={{ __html: highlight(product, productName) }}
              />
            ))}
          </div>
        </div>
      </ListItemText>
      {!isUser && (
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

const PlateListItemSkeleton = memo(({ itemHeight }: { itemHeight: number }) => {
  const classes = useStyles();
  const { isUser } = useAuth();

  return (
    <ListItem divider style={{ height: itemHeight }}>
      {!isUser && (
        <ListItemIcon>
          <Skeleton variant="rect" width={24} height={24} />
        </ListItemIcon>
      )}
      <ListItemText>
        <div className={classes.plateDetail}>
          <Skeleton className={classes.title} variant="rect" width="80%" height={30} />
          <div className={classes.products}>
            <Skeleton variant="rect" width="80%" height={24} />
          </div>
        </div>
      </ListItemText>
      {!isUser && (
        <ListItemSecondaryAction>
          <Skeleton variant="circle" width={48} height={48} style={{ marginRight: -12 }} />
        </ListItemSecondaryAction>
      )}
    </ListItem>
  );
});

export { PlateListItemSkeleton };

export default memo(PlateListItem);
