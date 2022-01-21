import CustomListSubHeader from 'ui/elements/CustomListSubHeader';
import Dialog from 'features/dialog/Dialog';
import DoneIcon from '@mui/icons-material/Done';
import { PlateDto } from 'features/plate/interface';
import ProductName from 'ui/elements/ProductName';
import React from 'react';
import RoundedButton from 'ui/elements/RoundedButton';
import { getPlateSize } from 'utils/plate';
import { getProductTitle } from 'utils/product';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import { DATE_FORMAT } from 'const';
import DetailField from '../DetailField';

export interface PlateDetailDialogProps {
  plate: PlateDto;
  onClose: () => void;
}

function PlateDetailDialog({ plate, onClose }: PlateDetailDialogProps) {
  const { t } = useTranslation('plates');
  const { name, material, location, memo, products = [], createdAt, updatedAt } = plate;

  return (
    <Dialog fullWidth open onClose={onClose} title={getPlateSize(plate)} subTitle={name}>
      <Dialog.Content>
        <DetailField label={t('material')} value={`${t(material.toLowerCase())}`} />
        <DetailField label={t('location')} value={location} />
        <DetailField label={t('memo')} value={memo} />
        <DetailField
          label={t('common:createdAt')}
          value={format(new Date(createdAt), DATE_FORMAT)}
        />
        <DetailField
          label={t('common:updatedAt')}
          value={format(new Date(updatedAt), DATE_FORMAT)}
        />
        {products.length && (
          <>
            <CustomListSubHeader>{t('products')}</CustomListSubHeader>
            {products.map((product, index) => (
              <DetailField
                key={product.id}
                label={`${index + 1}`}
                value={
                  <ProductName
                    key={product.id}
                    product={product}
                    productName={getProductTitle(product)}
                    maxWidth="100%"
                  />
                }
              />
            ))}
          </>
        )}
      </Dialog.Content>
      <Dialog.Actions>
        <RoundedButton autoFocus onClick={onClose} color="primary" startIcon={<DoneIcon />}>
          {t('common:confirm')}
        </RoundedButton>
      </Dialog.Actions>
    </Dialog>
  );
}

export default PlateDetailDialog;
