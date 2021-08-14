import RoundedButton from 'components/RoundedButton';
import { useAuth } from 'features/auth/authHook';
import Dialog from 'features/dialog/Dialog';
import { ProductDto } from 'features/product/interface';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { getProductTitle } from 'utils/product';
import { hideText } from 'utils/string';

import { createStyles, DialogActions, DialogContent, makeStyles, Theme } from '@material-ui/core';
import DoneIcon from '@material-ui/icons/Done';

import ProductDetails from './ProductDetails';

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
  const { canViewAccounts } = useAuth();
  const title = getProductTitle(product);
  const subTitle = canViewAccounts ? product?.account?.name : hideText(product?.account?.name);

  return (
    <Dialog fullWidth open onClose={onClose} title={title} subTitle={subTitle}>
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
