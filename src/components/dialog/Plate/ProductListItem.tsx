import {
  IconButton,
  ListItem,
  Theme,
  Typography,
  createStyles,
  lighten,
  makeStyles,
} from '@material-ui/core';

import AddIcon from '@material-ui/icons/Add';
import CloseIcon from '@material-ui/icons/Close';
import { ProductDto } from 'features/product/interface';
import React from 'react';
import { getProductSize } from 'utils/product';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    productListItem: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      border: `1px solid ${lighten(theme.palette.primary.light, 0.9)}`,
      borderRadius: theme.spacing(3),
      marginBottom: theme.spacing(1),
      height: '90px',
    },
    content: {
      display: 'flex',
      flexDirection: 'column',
    },
    productName: {
      maxWidth: '180px',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      textAlign: 'left',
    },
    button: {},
  }),
);

export interface ProductListItemProps {
  product: ProductDto;
  isSelected?: boolean;
  onSelect?: () => void;
  onDelete?: () => void;
}

function ProductListItem({
  product,
  isSelected = false,
  onSelect,
  onDelete,
}: ProductListItemProps) {
  const classes = useStyles();

  return (
    <ListItem className={classes.productListItem} selected={isSelected} onClick={onSelect} button>
      <div className={classes.content}>
        <Typography variant="caption">{product.account.name}</Typography>
        <Typography variant="body1" className={classes.productName}>
          {product.name}
        </Typography>
        <Typography variant="body2">{getProductSize(product)}</Typography>
      </div>
      <div className={classes.button}>
        {onSelect && (
          <IconButton onClick={onSelect} color="primary">
            <AddIcon />
          </IconButton>
        )}
        {onDelete && (
          <IconButton onClick={onDelete} color="inherit">
            <CloseIcon />
          </IconButton>
        )}
      </div>
    </ListItem>
  );
}

export default ProductListItem;
