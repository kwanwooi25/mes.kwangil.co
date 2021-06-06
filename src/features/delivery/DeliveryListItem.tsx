import { useAppDispatch } from 'app/store';
import AccountName from 'components/AccountName';
import ConfirmDialog from 'components/dialog/Confirm';
import ProductName from 'components/ProductName';
import { useAuth } from 'features/auth/authHook';
import { useDialog } from 'features/dialog/dialogHook';
import React, { memo, MouseEvent, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getProductSize, getProductTitle } from 'utils/product';
import { formatDigit } from 'utils/string';

import {
    Checkbox, createStyles, IconButton, ListItem, ListItemIcon, ListItemSecondaryAction,
    ListItemText, makeStyles, Menu, MenuItem, Theme, Typography
} from '@material-ui/core';
import { MoreVert } from '@material-ui/icons';
import { Skeleton } from '@material-ui/lab';

import { deliveryActions } from './deliverySlice';
import { DeliveryDto } from './interface';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    deliveryDetail: {
      display: 'grid',
      gridTemplateColumns: '1fr auto',
      gridTemplateAreas: `
        "accountName accountName"
        "productName productName"
        "productSize quantity"
      `,
      alignItems: 'center',
      gridColumnGap: theme.spacing(1),
      [theme.breakpoints.up('sm')]: {
        gridTemplateColumns: '230px 1fr 120px',
        gridTemplateAreas: `
          "accountName productSize quantity"
          "productName productSize quantity"
        `,
      },
      [theme.breakpoints.up('lg')]: {
        gridTemplateColumns: '200px 2fr 2fr 1fr',
        gridTemplateAreas: `
          "accountName productName productSize quantity"
        `,
      },
    },
    accountNameLink: {
      fontSize: theme.typography.body2.fontSize,
    },
    accountName: { gridArea: 'accountName' },
    productName: { gridArea: 'productName' },
    productSize: { gridArea: 'productSize' },
    quantity: {
      gridArea: 'quantity',
      justifySelf: 'end',
      paddingRight: theme.spacing(1),
      fontSize: theme.typography.h6.fontSize,
      fontWeight: 'bold',
      [theme.breakpoints.up('sm')]: {
        justifySelf: 'center',
      },
    },
  })
);

export interface DeliveryListItemProps {
  delivery: DeliveryDto;
  itemHeight: number;
  isSelected?: boolean;
}

const DeliveryListItem = ({ delivery, itemHeight, isSelected = false }: DeliveryListItemProps) => {
  const { t } = useTranslation('delivery');
  const classes = useStyles();

  const dispatch = useAppDispatch();
  const { toggleSelection } = deliveryActions;
  const { openDialog, closeDialog } = useDialog();
  const { isUser } = useAuth();

  const [menuAnchorEl, setMenuAnchorEl] = useState<HTMLElement | null>(null);

  const { product, quantity } = delivery;
  const productSize = getProductSize(product);

  const handleSelectionChange = useCallback(() => {
    dispatch(toggleSelection(delivery.id));
  }, [delivery]);

  const openMenu = useCallback((e: MouseEvent<HTMLButtonElement>) => setMenuAnchorEl(e.currentTarget), []);
  const closeMenu = useCallback(() => setMenuAnchorEl(null), []);

  const handleClickMenuItem =
    (onClick = () => {}) =>
    () => {
      closeMenu();
      onClick();
    };

  const handleClickDeliveryConfirm = useCallback(() => {
    // TODO: confirm when delivery is complete
  }, [delivery]);

  const handleClickEdit = useCallback(() => {
    // TODO: open delivery edit dialog
    // openDialog();
  }, [delivery]);

  const handleClickDelete = useCallback(() => {
    openDialog(
      <ConfirmDialog
        title={t('deleteDelivery')}
        message={t('deleteDeliveryConfirm', { productTitle: getProductTitle(product) })}
        onClose={(isConfirmed: boolean) => {
          // TODO: delete delivery
          // isConfirmed && dispatch(deleteDeliveries([delivery.id]));
          closeDialog();
        }}
      />
    );
  }, [delivery]);

  const actionButtons = [
    { label: t('deliveryConfirm'), onClick: handleClickDeliveryConfirm },
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
        <div className={classes.deliveryDetail}>
          <AccountName
            account={product.account}
            className={classes.accountName}
            linkClassName={classes.accountNameLink}
          />
          <ProductName product={product} className={classes.productName} />
          <Typography variant="body1" className={classes.productSize}>
            {productSize}
          </Typography>
          <Typography variant="body1" className={classes.quantity}>
            {t('common:sheetCount', { countString: formatDigit(quantity) })}
          </Typography>
        </div>
      </ListItemText>
      {!isUser && (
        <ListItemSecondaryAction>
          <IconButton edge="end" onClick={openMenu}>
            <MoreVert />
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

const DeliveryListItemSkeleton = memo(({ itemHeight }: { itemHeight: number }) => {
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
        <div className={classes.deliveryDetail}>
          <Skeleton className={classes.accountName} variant="rect" width="80%" height={24} />
          <Skeleton className={classes.productName} variant="rect" width="80%" height={30} />
          <Skeleton className={classes.productSize} variant="rect" width="80%" height={24} />
          <Skeleton className={classes.quantity} variant="rect" width="80%" height={30} />
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

export { DeliveryListItemSkeleton };

export default DeliveryListItem;
