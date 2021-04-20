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
import { getPrintSummary, getProductSize } from 'utils/product';

import AccountName from 'components/AccountName';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { ProductDto } from './interface';
import ProductName from 'components/ProductName';
import { Skeleton } from '@material-ui/lab';
import { highlight } from 'utils/string';
import { useProducts } from './productHook';
import { useTranslation } from 'react-i18next';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    productDetail: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      [theme.breakpoints.up('sm')]: {
        display: 'grid',
        gridTemplateColumns: '2fr 3fr',
        gridTemplateAreas: `
          "accountName productName"
          "accountName productSize"
        `,
        alignItems: 'center',
        gridColumnGap: theme.spacing(1),
      },
      [theme.breakpoints.up('md')]: {
        gridTemplateColumns: '2fr 2fr 3fr',
        gridTemplateAreas: `
          "accountName productName extColor"
          "accountName productSize printSummary"
        `,
      },
      [theme.breakpoints.up('lg')]: {
        gridTemplateColumns: '2fr 3fr 2fr 1fr 3fr',
        gridTemplateAreas: `
          "accountName productName productSize extColor printSummary"
        `,
      },
    },
    accountNameLink: {
      fontSize: theme.typography.body2.fontSize,
    },
    accountName: {
      gridArea: 'accountName',
    },
    productName: {
      gridArea: 'productName',
    },
    productSize: {
      gridArea: 'productSize',
    },
    extColor: {
      gridArea: 'extColor',
    },
    printSummary: {
      gridArea: 'printSummary',
    },
  })
);

export interface ProductListItemProps extends ListItemProps {
  product: ProductDto;
  itemHeight: number;
  isSelected: boolean;
  showDetails: boolean;
}

const ProductListItem = ({ product, itemHeight, isSelected, showDetails }: ProductListItemProps) => {
  const { t } = useTranslation('products');
  const classes = useStyles();

  const { query } = useProducts();

  const [menuAnchorEl, setMenuAnchorEl] = useState<HTMLElement | null>(null);

  const productSize = getProductSize(product);
  const printSummary = getPrintSummary(product);

  const handleSelectionChange = useCallback(() => {
    // TODO: toggle selection
  }, [product]);

  const openMenu = useCallback((e: MouseEvent<HTMLButtonElement>) => setMenuAnchorEl(e.currentTarget), []);
  const closeMenu = useCallback(() => setMenuAnchorEl(null), []);

  const handleClickMenuItem = (onClick = () => {}) => () => {
    closeMenu();
    onClick();
  };

  const handleClickWorkOrder = useCallback(() => {
    // TODO: open workOrder dialog
  }, [product]);

  const handleClickCopy = useCallback(() => {
    // TODO: open product dialog as copy mode
  }, [product]);

  const handleClickEdit = useCallback(() => {
    // TODO: open product dialog as edit mode
  }, [product]);

  const handleClickDelete = useCallback(() => {
    // TODO: confirm and delete
    // dispatch(
    //   actions.dialog.openDialog(DialogType.CONFIRM, {
    //     title: t('deleteProduct'),
    //     message: t('deleteProductConfirm', { productName: `${product.name} (${productSize})` }),
    //     onClose: (result: boolean) => {
    //       result && dispatch(actions.product.deleteProductsRequest([product.id]));
    //     },
    //   })
    // );
  }, [product]);

  const actionButtons = [
    { label: t('common:workOrder'), onClick: handleClickWorkOrder },
    { label: t('common:copy'), onClick: handleClickCopy },
    { label: t('common:edit'), onClick: handleClickEdit },
    { label: t('common:delete'), onClick: handleClickDelete },
  ];

  return (
    <ListItem divider style={{ height: itemHeight }} selected={isSelected}>
      <ListItemIcon>
        <Checkbox edge="start" color="primary" checked={isSelected} onChange={handleSelectionChange} />
      </ListItemIcon>
      <ListItemText>
        <div className={classes.productDetail}>
          <AccountName
            account={product.account}
            className={classes.accountName}
            linkClassName={classes.accountNameLink}
            searchText={query.accountName}
          />
          <ProductName product={product} searchText={query.name} className={classes.productName} />
          <Typography variant="body1" className={classes.productSize}>
            {productSize}
          </Typography>
          {showDetails && (
            <>
              <Typography variant="body2" className={classes.extColor}>
                <span dangerouslySetInnerHTML={{ __html: highlight(product.extColor, query.extColor) }} />
              </Typography>
              <Typography variant="body2" className={classes.printSummary}>
                <span dangerouslySetInnerHTML={{ __html: highlight(printSummary, query.printColor) }} />
              </Typography>
            </>
          )}
        </div>
      </ListItemText>
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
    </ListItem>
  );
};

const ProductListItemSkeleton = memo(
  ({ itemHeight, showDetails = false }: { itemHeight: number; showDetails?: boolean }) => {
    const classes = useStyles();

    return (
      <ListItem divider style={{ height: itemHeight }}>
        <ListItemIcon>
          <Skeleton variant="rect" width={24} height={24} />
        </ListItemIcon>
        <ListItemText>
          <div className={classes.productDetail}>
            <Skeleton className={classes.accountName} variant="rect" width="80%" height={24} />
            <Skeleton className={classes.productName} variant="rect" width="80%" height={30} />
            <Skeleton className={classes.productSize} variant="rect" width="80%" height={24} />
            {showDetails && (
              <>
                <Skeleton className={classes.extColor} variant="rect" width="80%" height={20} />
                <Skeleton className={classes.printSummary} variant="rect" width="80%" height={20} />
              </>
            )}
          </div>
        </ListItemText>
        <ListItemSecondaryAction>
          <Skeleton variant="circle" width={48} height={48} style={{ marginRight: -12 }} />
        </ListItemSecondaryAction>
      </ListItem>
    );
  }
);

export { ProductListItemSkeleton };

export default memo(ProductListItem);
