import { useAppDispatch, useAppSelector } from 'app/store';
import AccountName from 'components/AccountName';
import ConfirmDialog from 'components/dialog/Confirm';
import ProductDialog from 'components/dialog/Product';
import StockDialog from 'components/dialog/Stock';
import WorkOrderDialog from 'components/dialog/WorkOrder';
import ProductName from 'components/ProductName';
import { ProductDialogMode } from 'const';
import { useAuth } from 'features/auth/authHook';
import { useDialog } from 'features/dialog/dialogHook';
import React, { memo, MouseEvent, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getPrintSummary, getProductSize } from 'utils/product';
import { formatDigit, highlight } from 'utils/string';

import {
    Checkbox, createStyles, IconButton, ListItem, ListItemIcon, ListItemProps,
    ListItemSecondaryAction, ListItemText, makeStyles, Menu, MenuItem, Theme, Typography
} from '@material-ui/core';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { Skeleton } from '@material-ui/lab';

import { ProductDto } from './interface';
import { productActions, productSelectors } from './productSlice';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    productDetail: {
      display: 'grid',
      gridTemplateColumns: '3fr 2fr',
      gridTemplateAreas: `
        "accountName accountName"
        "productName productName"
        "productSize stockBalance"
      `,
      alignItems: 'center',
      gridColumnGap: theme.spacing(1),
      [theme.breakpoints.up('sm')]: {
        gridTemplateColumns: '2fr 3fr 90px',
        gridTemplateAreas: `
          "accountName productName stockBalance"
          "accountName productSize stockBalance"
        `,
      },
      [theme.breakpoints.up('md')]: {
        gridTemplateColumns: '2fr 3fr 3fr 90px',
        gridTemplateAreas: `
          "accountName productName extColor stockBalance"
          "accountName productSize printSummary stockBalance"
        `,
      },
      [theme.breakpoints.up('lg')]: {
        gridTemplateColumns: '2fr 3fr 2fr 1fr 3fr 90px',
        gridTemplateAreas: `
          "accountName productName productSize extColor printSummary stockBalance"
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
    stockBalance: {
      gridArea: 'stockBalance',
      justifySelf: 'end',
      paddingRight: theme.spacing(1),
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

  const dispatch = useAppDispatch();
  const query = useAppSelector(productSelectors.query);
  const { toggleSelection, deleteProducts } = productActions;
  const { openDialog, closeDialog } = useDialog();
  const { isUser } = useAuth();

  const [menuAnchorEl, setMenuAnchorEl] = useState<HTMLElement | null>(null);

  const productSize = getProductSize(product);
  const printSummary = getPrintSummary(product);
  const hasStock = !!product.stock;
  const stockBalance = hasStock
    ? t('common:sheetCount', { countString: formatDigit(product?.stock?.balance || 0) })
    : '';

  const handleSelectionChange = useCallback(() => {
    dispatch(toggleSelection(product.id));
  }, [product]);

  const openMenu = useCallback((e: MouseEvent<HTMLButtonElement>) => setMenuAnchorEl(e.currentTarget), []);
  const closeMenu = useCallback(() => setMenuAnchorEl(null), []);

  const handleClickMenuItem = (onClick = () => {}) => () => {
    closeMenu();
    onClick();
  };

  const handleClickStock = useCallback(() => {
    openDialog(<StockDialog products={[product]} onClose={closeDialog} />);
  }, [product]);

  const handleClickWorkOrder = useCallback(() => {
    openDialog(<WorkOrderDialog product={product} onClose={closeDialog} />);
  }, [product]);

  const handleClickCopy = useCallback(() => {
    openDialog(<ProductDialog mode={ProductDialogMode.COPY} product={product} onClose={closeDialog} />);
  }, [product]);

  const handleClickEdit = useCallback(() => {
    openDialog(<ProductDialog mode={ProductDialogMode.EDIT} product={product} onClose={closeDialog} />);
  }, [product]);

  const handleClickDelete = useCallback(() => {
    openDialog(
      <ConfirmDialog
        title={t('deleteProduct')}
        message={t('deleteProductConfirm', { productName: `${product.name}` })}
        onClose={(isConfirmed: boolean) => {
          isConfirmed && dispatch(deleteProducts([product.id]));
          closeDialog();
        }}
      />
    );
  }, [product]);

  const actionButtons = [
    { label: t('products:createOrUpdateStock'), onClick: handleClickStock },
    { label: t('common:workOrder'), onClick: handleClickWorkOrder },
    { label: t('common:copy'), onClick: handleClickCopy },
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
          <Typography variant="body1" className={classes.stockBalance}>
            {stockBalance}
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

const ProductListItemSkeleton = memo(
  ({ itemHeight, showDetails = false }: { itemHeight: number; showDetails?: boolean }) => {
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
        {!isUser && (
          <ListItemSecondaryAction>
            <Skeleton variant="circle" width={48} height={48} style={{ marginRight: -12 }} />
          </ListItemSecondaryAction>
        )}
      </ListItem>
    );
  }
);

export { ProductListItemSkeleton };

export default memo(ProductListItem);
