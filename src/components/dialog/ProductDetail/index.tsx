import RoundedButton from 'components/RoundedButton';
import { useAuth } from 'features/auth/authHook';
import Dialog from 'features/dialog/Dialog';
import { ProductDto } from 'features/product/interface';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { getProductTitle } from 'utils/product';
import { hideText } from 'utils/string';
import DoneIcon from '@mui/icons-material/Done';
import ProductDetails from './ProductDetails';

export interface ProductDetailDialogProps {
  product: ProductDto;
  onClose: () => void;
}

function ProductDetailDialog({ product, onClose }: ProductDetailDialogProps) {
  const { t } = useTranslation('products');
  const { canViewAccounts } = useAuth();
  const title = getProductTitle(product);
  const subTitle = canViewAccounts ? product?.account?.name : hideText(product?.account?.name);

  return (
    <Dialog fullWidth open onClose={onClose} title={title} subTitle={subTitle}>
      <Dialog.Content>
        {Boolean(product) && <ProductDetails product={product} hideBaseInfo />}
      </Dialog.Content>
      <Dialog.Actions>
        <RoundedButton autoFocus onClick={onClose} color="primary" startIcon={<DoneIcon />}>
          {t('common:confirm')}
        </RoundedButton>
      </Dialog.Actions>
    </Dialog>
  );
}

export default ProductDetailDialog;
