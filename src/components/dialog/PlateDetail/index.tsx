import { DialogActions, DialogContent, Theme, createStyles, makeStyles } from '@material-ui/core';

import CustomListSubHeader from 'components/CustomListSubHeader';
import Dialog from 'features/dialog/Dialog';
import DoneIcon from '@material-ui/icons/Done';
import { PlateDto } from 'features/plate/interface';
import ProductName from 'components/ProductName';
import React from 'react';
import RoundedButton from 'components/RoundedButton';
import { getPlateSize } from 'utils/plate';
import { getProductTitle } from 'utils/product';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import { DATE_FORMAT } from 'const';
import DetailField from '../DetailField';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    plateDetailContent: {
      padding: theme.spacing(0, 2),
    },
    buttons: {
      padding: theme.spacing(2, 3),
    },
    productName: {
      fontSize: theme.typography.body1.fontSize,
    },
  }),
);

export interface PlateDetailDialogProps {
  plate: PlateDto;
  onClose: () => void;
}

function PlateDetailDialog({ plate, onClose }: PlateDetailDialogProps) {
  const { t } = useTranslation('plates');
  const classes = useStyles();
  const { name, material, location, memo, products = [], createdAt, updatedAt } = plate;

  return (
    <Dialog fullWidth open onClose={onClose} title={getPlateSize(plate)} subTitle={name}>
      <DialogContent className={classes.plateDetailContent}>
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
                    linkClassName={classes.productName}
                    maxWidth="100%"
                  />
                }
              />
            ))}
          </>
        )}
      </DialogContent>
      <DialogActions className={classes.buttons}>
        <RoundedButton autoFocus onClick={onClose} color="primary" startIcon={<DoneIcon />}>
          {t('common:confirm')}
        </RoundedButton>
      </DialogActions>
    </Dialog>
  );
}

export default PlateDetailDialog;
