import { Theme, createStyles, makeStyles } from '@material-ui/core';

import React from 'react';
import classnames from 'classnames';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    productImageContainer: {
      padding: theme.spacing(1, 0),
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
      gridGap: theme.spacing(3),
      '& > div': {
        position: 'relative',
      },
      '& > div::before': {
        content: '""',
        paddingBottom: '100%',
        display: 'inline-block',
      },
    },
  })
);

export interface ProductImageContainerProps {
  className?: string;
  children: any;
}

const ProductImageContainer = ({ className, children }: ProductImageContainerProps) => {
  const classes = useStyles();

  return <div className={classnames([className, classes.productImageContainer])}>{children}</div>;
};

export default ProductImageContainer;
