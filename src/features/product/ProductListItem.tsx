import AccountName from 'components/AccountName';
import ConfirmDialog from 'components/dialog/Confirm';
import ProductDialog from 'components/dialog/Product';
import EditProductDialog from 'components/dialog/Product/EditProductDialog';
import StockDialog from 'components/dialog/Stock';
import WorkOrderDialog from 'components/dialog/WorkOrder';
import WorkOrderHistoryDialog from 'components/dialog/WorkOrderHistory';
import Loading from 'components/Loading';
import ProductName from 'components/ProductName';
import { ProductDialogMode } from 'const';
import { useAuth } from 'features/auth/authHook';
import { useDialog } from 'features/dialog/dialogHook';
import { useWorkOrdersByProduct } from 'features/workOrder/useWorkOrders';
import React, { memo, MouseEvent, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from 'react-query';
import { getPrintSummary } from 'utils/product';
import { highlight } from 'utils/string';

import {
  Checkbox,
  createStyles,
  IconButton,
  ListItem,
  ListItemIcon,
  ListItemProps,
  ListItemSecondaryAction,
  ListItemText,
  makeStyles,
  Menu,
  MenuItem,
  Theme,
  Typography,
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
        gridTemplateColumns: '2fr 4fr 2fr 1fr 3fr 90px',
        gridTemplateAreas: `
          "accountName productName productSize extColor printSummary stockBalance"
        `,
      },
    },
    accountNameLink: {
      fontSize: '12px',
    },
    accountName: {
      gridArea: 'accountName',
    },
    productName: {
      gridArea: 'productName',
    },
    productSize: {
      gridArea: 'productSize',
      fontSize: '14px',
    },
    stockBalance: {
      gridArea: 'stockBalance',
      justifySelf: 'end',
      paddingRight: theme.spacing(1),
      fontSize: '12px',
    },
    extColor: {
      gridArea: 'extColor',
      fontSize: '14px',
    },
    printSummary: {
      gridArea: 'printSummary',
      fontSize: '14px',
    },
  }),
);

export interface ProductListItemProps extends ListItemProps {
  isSelectable?: boolean;
  product: ProductDto;
  itemHeight: number;
  isSelected: boolean;
  showDetails: boolean;
  filter: ProductFilter;
  toggleSelection?: (product: ProductDto) => any;
}

function ProductListItem({
  isSelectable = true,
  product,
  itemHeight,
  isSelected,
  showDetails,
  filter,
  toggleSelection = () => {},
}: ProductListItemProps) {
  const { t } = useTranslation('products');
  const classes = useStyles();

  const { openDialog, closeDialog } = useDialog();
  const {
    canCreateProducts,
    canUpdateProducts,
    canDeleteProducts,
    canViewWorkOrders,
    canCreateWorkOrders,
  } = useAuth();

  const [menuAnchorEl, setMenuAnchorEl] = useState<HTMLElement | null>(null);

  const queryClient = useQueryClient();
  const { deleteProducts } = useDeleteProductsMutation({ queryClient });
  const { refetch, isFetching: isLoadingWorkOrders } = useWorkOrdersByProduct(product.id);

  const printSummary = getPrintSummary(product);
  // const hasStock = !!product.stock;
  // const stockBalance = hasStock
  //   ? t('common:sheetCount', { countString: formatDigit(product?.stock?.balance || 0) })
  //   : '';

  const handleSelectionChange = () => toggleSelection(product);

  const openMenu = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => setMenuAnchorEl(e.currentTarget),
    [],
  );
  const closeMenu = useCallback(() => setMenuAnchorEl(null), []);

  const handleClickMenuItem =
    (onClick = async () => {}) =>
    () => {
      onClick().then(() => closeMenu());
    };

  const handleClickStock = async () =>
    openDialog(<StockDialog products={[product]} onClose={closeDialog} />);

  const handleClickWorkOrder = async () =>
    openDialog(<WorkOrderDialog product={product} onClose={closeDialog} />);

  const handleClickWorkOrderHistory = async () => {
    await refetch().then((res) => {
      openDialog(
        <WorkOrderHistoryDialog product={product} workOrders={res.data} onClose={closeDialog} />,
      );
    });
  };

  const handleClickCopy = async () =>
    openDialog(
      <ProductDialog mode={ProductDialogMode.COPY} product={product} onClose={closeDialog} />,
    );

  const handleClickEdit = async () =>
    openDialog(<EditProductDialog product={product} onClose={closeDialog} />);

  const handleClickDelete = async () =>
    openDialog(
      <ConfirmDialog
        title={t('deleteProduct')}
        message={t('deleteProductConfirm', { productName: `${product.name}` })}
        onClose={(isConfirmed: boolean) => {
          if (isConfirmed) deleteProducts([product.id]);
          closeDialog();
        }}
      />,
    );

  let actionButtons: { label: string; onClick: () => any; isLoading?: boolean }[] = [];

  if (canCreateWorkOrders) {
    actionButtons.push({ label: t('common:workOrder'), onClick: handleClickWorkOrder });
  }

  if (canViewWorkOrders) {
    actionButtons.push({
      label: t('common:workOrderHistory'),
      onClick: handleClickWorkOrderHistory,
      isLoading: isLoadingWorkOrders,
    });
  }

  if (canCreateProducts) {
    actionButtons.push({ label: t('common:copy'), onClick: handleClickCopy });
  }

  if (canUpdateProducts) {
    actionButtons = [
      ...actionButtons,
      { label: t('products:createOrUpdateStock'), onClick: handleClickStock },
      { label: t('common:edit'), onClick: handleClickEdit },
    ];
  }

  if (canDeleteProducts) {
    actionButtons.push({ label: t('common:delete'), onClick: handleClickDelete });
  }

  return (
    <ListItem divider style={{ height: itemHeight }} selected={isSelected}>
      {isSelectable && (
        <ListItemIcon>
          <Checkbox
            edge="start"
            color="primary"
            checked={isSelected}
            onChange={handleSelectionChange}
          />
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
            <span
              dangerouslySetInnerHTML={{
                __html: `${highlight(String(product.thickness), filter.thickness)} x ${highlight(
                  String(product.length),
                  filter.length,
                )} x ${highlight(String(product.width), filter.width)}`,
              }}
            />
          </Typography>
          <Typography variant="body1" className={classes.stockBalance}>
            {/* {stockBalance} */}
          </Typography>
          {showDetails && (
            <>
              <Typography variant="body2" className={classes.extColor}>
                <span
                  dangerouslySetInnerHTML={{ __html: highlight(product.extColor, filter.extColor) }}
                />
              </Typography>
              <Typography variant="body2" className={classes.printSummary}>
                <span
                  dangerouslySetInnerHTML={{ __html: highlight(printSummary, filter.printColor) }}
                />
              </Typography>
            </>
          )}
        </div>
      </ListItemText>
      {!!actionButtons.length && (
        <ListItemSecondaryAction>
          <IconButton edge="end" onClick={openMenu}>
            <MoreVertIcon />
          </IconButton>
          <Menu anchorEl={menuAnchorEl} open={Boolean(menuAnchorEl)} onClose={closeMenu}>
            {actionButtons.map(({ label, onClick, isLoading }) => (
              <MenuItem key={label} onClick={handleClickMenuItem(onClick)} disabled={isLoading}>
                {isLoading && <Loading />}
                {label}
              </MenuItem>
            ))}
          </Menu>
        </ListItemSecondaryAction>
      )}
    </ListItem>
  );
}

export default memo(ProductListItem);
