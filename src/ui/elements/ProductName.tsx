import classNames from 'classnames';
import { useDialog } from 'features/dialog/dialogHook';
import { ProductDto } from 'features/product/interface';
import { useProduct } from 'features/product/useProducts';
import React, { memo, useMemo } from 'react';
import { highlight } from 'utils/string';
import { LoadingButton } from '@mui/lab';
import ProductDetailDialog from 'ui/dialog/ProductDetail';

export interface ProductNameProps {
  className?: string;
  linkClassName?: string;
  product: ProductDto;
  searchText?: string;
  maxWidth?: number | string;
  productName?: string;
}

function ProductName({
  product,
  className,
  linkClassName,
  searchText = '',
  productName,
}: ProductNameProps) {
  const { openDialog, closeDialog } = useDialog();
  const { refetch, isFetching } = useProduct(product.id);

  const productNameHTML = useMemo(
    () => highlight(productName || product.name, searchText),
    [productName, product.name, searchText],
  );

  const openDetailDialog = async () => {
    refetch().then((res) =>
      openDialog(<ProductDetailDialog product={res.data} onClose={closeDialog} />),
    );
  };

  return (
    <LoadingButton
      className={classNames('!justify-start !min-w-0 max-w-max !text-base', className)}
      onClick={openDetailDialog}
      disabled={isFetching}
      loading={isFetching}
      loadingPosition="end"
      endIcon={<span />}
      color="inherit"
    >
      <p
        className={classNames('truncate', linkClassName)}
        dangerouslySetInnerHTML={{ __html: productNameHTML }}
      />
    </LoadingButton>
  );
}

export default memo(ProductName);
