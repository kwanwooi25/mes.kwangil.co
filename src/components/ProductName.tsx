import { Link, Theme, createStyles, makeStyles } from '@material-ui/core';
import React, { memo } from 'react';

import { ProductDto } from 'features/product/interface';
import classnames from 'classnames';
import { highlight } from 'utils/string';

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
  maxWidth?: number;
}

const ProductName = ({ product, className, linkClassName, searchText = '', maxWidth = 200 }: ProductNameProps) => {
  const classes = useStyles();

  const openDetailDialog = async () => {
    // TODO: open product detail dialog
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
          dangerouslySetInnerHTML={{ __html: highlight(product.name, searchText) }}
        />
      </Link>
    </div>
  );
};

export default memo(ProductName);
