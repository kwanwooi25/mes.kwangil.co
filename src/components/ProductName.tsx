import { Link, Theme, createStyles, makeStyles } from '@material-ui/core';
import React, { memo } from 'react';

import ProductDetailDialog from './dialog/ProductDetail';
import { ProductDto } from 'features/product/interface';
import classnames from 'classnames';
import { highlight } from 'utils/string';
import { productApi } from 'features/product/productApi';
import { useDialog } from 'features/dialog/dialogHook';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    productNameLink: {
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      textAlign: 'left',
    },
    productName: {},
  })
);

export interface ProductNameProps {
  className?: string;
  linkClassName?: string;
  product: ProductDto;
  searchText?: string;
  maxWidth?: number | string;
  productName?: string;
}

const ProductName = ({
  product,
  className,
  linkClassName,
  searchText = '',
  maxWidth = 200,
  productName,
}: ProductNameProps) => {
  const classes = useStyles();
  const { openDialog, closeDialog } = useDialog();

  const openDetailDialog = async () => {
    const data = await productApi.getProduct(product.id);
    openDialog(<ProductDetailDialog product={data} onClose={closeDialog} />);
  };

  return (
    <div className={className}>
      <Link
        className={classnames(classes.productNameLink, linkClassName)}
        component="button"
        type="button"
        variant="h6"
        color="initial"
        onClick={openDetailDialog}
        style={{ maxWidth }}
      >
        <span
          className={classes.productName}
          dangerouslySetInnerHTML={{ __html: highlight(productName || product.name, searchText) }}
        />
      </Link>
    </div>
  );
};

export default memo(ProductName);
