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
import { useQueryClient } from 'react-query';
import { getPrintSummary, getProductSize } from 'utils/product';
import { formatDigit, highlight } from 'utils/string';

import {
    Checkbox, createStyles, IconButton, ListItem, ListItemIcon, ListItemProps,
    ListItemSecondaryAction, ListItemText, makeStyles, Menu, MenuItem, Theme, Typography
} from '@material-ui/core';
import MoreVertIcon from '@material-ui/icons/MoreVert';

import { ProductDto, ProductFilter } from './interface';
import { useDeleteProductsMutation } from './useProducts';

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
  filter: ProductFilter;
  toggleSelection?: (product: ProductDto) => any;
}

const ProductListItem = ({
  product,
  itemHeight,
  isSelected,
  showDetails,
  filter,
  toggleSelection = (product: ProductDto) => {},
}: ProductListItemProps) => {
  const { t } = useTranslation('products');
  const classes = useStyles();

  const { openDialog, closeDialog } = useDialog();
  const { isUser } = useAuth();

  const [menuAnchorEl, setMenuAnchorEl] = useState<HTMLElement | null>(null);

  const queryClient = useQueryClient();
  const { deleteProducts } = useDeleteProductsMutation({ queryClient });

  const productSize = getProductSize(product);
  const printSummary = getPrintSummary(product);
  const hasStock = !!product.stock;
  const stockBalance = hasStock
    ? t('common:sheetCount', { countString: formatDigit(product?.stock?.balance || 0) })
    : '';

  const handleSelectionChange = () => toggleSelection(product);

  const openMenu = useCallback((e: MouseEvent<HTMLButtonElement>) => setMenuAnchorEl(e.currentTarget), []);
  const closeMenu = useCallback(() => setMenuAnchorEl(null), []);

  const handleClickMenuItem =
    (onClick = () => {}) =>
    () => {
      closeMenu();
      onClick();
    };

  const handleClickStock = () => openDialog(<StockDialog products={[product]} onClose={closeDialog} />);

  const handleClickWorkOrder = () => openDialog(<WorkOrderDialog product={product} onClose={closeDialog} />);

  const handleClickCopy = () =>
    openDialog(<ProductDialog mode={ProductDialogMode.COPY} product={product} onClose={closeDialog} />);

  const handleClickEdit = () =>
    openDialog(<ProductDialog mode={ProductDialogMode.EDIT} product={product} onClose={closeDialog} />);

  const handleClickDelete = () =>
    openDialog(
      <ConfirmDialog
        title={t('deleteProduct')}
        message={t('deleteProductConfirm', { productName: `${product.name}` })}
        onClose={(isConfirmed: boolean) => {
          isConfirmed && deleteProducts([product.id]);
          closeDialog();
        }}
      />
    );

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
            searchText={filter.accountName}
          />
          <ProductName product={product} searchText={filter.name} className={classes.productName} />
          <Typography variant="body1" className={classes.productSize}>
            {productSize}
          </Typography>
          <Typography variant="body1" className={classes.stockBalance}>
            {stockBalance}
          </Typography>
          {showDetails && (
            <>
              <Typography variant="body2" className={classes.extColor}>
                <span dangerouslySetInnerHTML={{ __html: highlight(product.extColor, filter.extColor) }} />
              </Typography>
              <Typography variant="body2" className={classes.printSummary}>
                <span dangerouslySetInnerHTML={{ __html: highlight(printSummary, filter.printColor) }} />
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

export default memo(ProductListItem);
