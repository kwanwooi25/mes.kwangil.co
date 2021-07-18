import classnames from 'classnames';
import { useDialog } from 'features/dialog/dialogHook';
import { ProductDto } from 'features/product/interface';
import { useProduct } from 'features/product/useProducts';
import React, { memo } from 'react';
import { highlight } from 'utils/string';

import { createStyles, Link, makeStyles, Theme } from '@material-ui/core';

import ProductDetailDialog from './dialog/ProductDetail';
import Loading from './Loading';

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

  const { refetch, isFetching } = useProduct(product.id);

  const openDetailDialog = async () => {
    refetch().then((res) => openDialog(<ProductDetailDialog product={res.data} onClose={closeDialog} />));
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
        {isFetching && <Loading />}
        <span
          className={classes.productName}
          dangerouslySetInnerHTML={{ __html: highlight(productName || product.name, searchText) }}
        />
      </Link>
    </div>
  );
};

export default memo(ProductName);
