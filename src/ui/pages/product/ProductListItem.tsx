import { ProductDialogMode } from 'const';
import { useAuth } from 'features/auth/authHook';
import { useDialog } from 'features/dialog/dialogHook';
import { ProductDto, ProductFilter } from 'features/product/interface';
import { useDeleteProductsMutation } from 'features/product/useProducts';
import { useWorkOrdersByProduct } from 'features/workOrder/useWorkOrders';
import React, { memo, MouseEvent, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from 'react-query';
import ConfirmDialog from 'ui/dialog/Confirm';
import ProductDialog from 'ui/dialog/Product';
import EditProductDialog from 'ui/dialog/Product/EditProductDialog';
import WorkOrderDialog from 'ui/dialog/WorkOrder';
import WorkOrderHistoryDialog from 'ui/dialog/WorkOrderHistory';
import AccountName from 'ui/elements/AccountName';
import Loading from 'ui/elements/Loading';
import ProductName from 'ui/elements/ProductName';
import { highlight } from 'utils/string';

import { MoreVert, SpeakerNotes } from '@mui/icons-material';
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
  Popover,
} from '@mui/material';

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
  filter,
  toggleSelection = () => {},
}: ProductListItemProps) {
  const { t } = useTranslation('products');

  const { openDialog, closeDialog } = useDialog();
  const {
    canCreateProducts,
    canUpdateProducts,
    canDeleteProducts,
    canViewWorkOrders,
    canCreateWorkOrders,
  } = useAuth();

  const [menuAnchorEl, setMenuAnchorEl] = useState<HTMLElement | null>(null);
  const [memoAnchorEl, setMemoAnchorEl] = useState<HTMLElement | null>(null);

  const queryClient = useQueryClient();
  const { deleteProducts } = useDeleteProductsMutation({ queryClient });
  const { refetch, isFetching: isLoadingWorkOrders } = useWorkOrdersByProduct(product.id);

  const handleSelectionChange = () => toggleSelection(product);

  const openMenu = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => setMenuAnchorEl(e.currentTarget),
    [],
  );
  const closeMenu = useCallback(() => setMenuAnchorEl(null), []);
  const openMemo = useCallback(
    (e: MouseEvent<HTMLElement>) => setMemoAnchorEl(e.currentTarget),
    [],
  );
  const closeMemo = useCallback(() => setMemoAnchorEl(null), []);

  const handleClickMenuItem =
    (onClick = async () => {}) =>
    () => {
      onClick().then(() => closeMenu());
    };

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
    actionButtons = [...actionButtons, { label: t('common:edit'), onClick: handleClickEdit }];
  }

  if (canDeleteProducts) {
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
        <div className="grid grid-cols-[1fr_40px] laptop:grid laptop:grid-cols-[1fr_2fr_40px] laptop:gap-x-2 laptop:items-center desktop:grid-cols-[1fr_2fr_1fr_40px]">
          <AccountName
            className="col-start-1 row-start-1 laptop:row-span-2 desktop:row-span-1"
            linkClassName="text-xs"
            account={product.account}
            searchText={filter.accountName}
          />
          <ProductName
            className="col-start-1 row-start-2 laptop:col-start-2 laptop:row-start-1"
            product={product}
            searchText={filter.name}
          />
          <span
            className="col-start-1 row-start-3 px-2 text-sm laptop:col-start-2 laptop:row-start-2 desktop:col-start-3 desktop:row-start-1"
            dangerouslySetInnerHTML={{
              __html: `${highlight(String(product.thickness), filter.thickness)} x ${highlight(
                String(product.length),
                filter.length,
              )} x ${highlight(String(product.width), filter.width)}`,
            }}
          />
          {product.productMemo && (
            <span
              className="row-span-3 self-center p-2 bg-blue-200/20 hover:bg-blue-200/50 rounded-full transition-colors cursor-help laptop:row-span-2 desktop:row-span-1"
              onMouseEnter={openMemo}
              onMouseLeave={closeMemo}
            >
              <SpeakerNotes />
              <Popover
                classes={{ paper: 'p-2 mr-2' }}
                sx={{ pointerEvents: 'none' }}
                open={!!memoAnchorEl}
                anchorEl={memoAnchorEl}
                onClose={closeMemo}
                anchorOrigin={{
                  vertical: 'center',
                  horizontal: 'left',
                }}
                transformOrigin={{
                  vertical: 'center',
                  horizontal: 'right',
                }}
                disableRestoreFocus
              >
                <p className="whitespace-pre-wrap">{product.productMemo}</p>
              </Popover>
            </span>
          )}
        </div>
      </ListItemText>
      {!!actionButtons.length && (
        <ListItemSecondaryAction>
          <IconButton edge="end" onClick={openMenu}>
            <MoreVert />
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
