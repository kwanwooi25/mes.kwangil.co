import { DialogActions, DialogContent, Theme, createStyles, makeStyles } from '@material-ui/core';

import Dialog from 'features/dialog/Dialog';
import DoneIcon from '@material-ui/icons/Done';
import ProductDetails from './ProductDetails';
import { ProductDto } from 'features/product/interface';
import React from 'react';
import RoundedButton from 'components/RoundedButton';
import { getProductTitle } from 'utils/product';
import { useTranslation } from 'react-i18next';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    productDetailContent: {
      padding: theme.spacing(0, 2),
    },
    buttons: {
      padding: theme.spacing(2, 3),
    },
  })
);

export interface ProductDetailDialogProps {
  product: ProductDto;
  onClose: () => void;
}

const ProductDetailDialog = ({ product, onClose }: ProductDetailDialogProps) => {
  const { t } = useTranslation('products');
  const classes = useStyles();
  const title = getProductTitle(product);

  return (
    <Dialog fullWidth open onClose={onClose} title={title} subTitle={product?.account?.name}>
      <DialogContent className={classes.productDetailContent}>
        {Boolean(product) && <ProductDetails product={product} hideBaseInfo />}
      </DialogContent>
      <DialogActions className={classes.buttons}>
        <RoundedButton autoFocus onClick={onClose} color="primary" startIcon={<DoneIcon />}>
          {t('common:confirm')}
        </RoundedButton>
      </DialogActions>
    </Dialog>
  );
};

export default ProductDetailDialog;
