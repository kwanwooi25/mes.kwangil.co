import { List, Theme, createStyles, makeStyles } from '@material-ui/core';
import {
  getExtrusionDetail,
  getPackagingDetail,
  getPrintDetail,
  getProductSize,
  getPunchDetail,
} from 'utils/product';

import CustomListSubHeader from 'components/CustomListSubHeader';
import { ProductDto } from 'features/product/interface';
import ProductImage from 'components/ProductImage/ProductImage';
import ProductImageContainer from 'components/ProductImage/ProductImageContainer';
import React from 'react';
import { getPlateTitle } from 'utils/plate';
import { useTranslation } from 'react-i18next';
import DetailField from '../DetailField';
import { PRINT_SIDE_TEXT, PrintSide } from '../../../const';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    gutter: {
      paddingBottom: theme.spacing(3),
    },
    imageContainer: {
      padding: theme.spacing(1, 3),
    },
  }),
);

export interface ProductDetailsProps {
  product: ProductDto;
  hideBaseInfo?: boolean;
  filesToUpload?: File[];
}

function ProductDetails({
  product,
  hideBaseInfo = false,
  filesToUpload = [],
}: ProductDetailsProps) {
  const { t } = useTranslation('products');
  const classes = useStyles();
  const {
    account,
    name,
    thickness,
    length,
    width,
    extColor,
    extIsAntistatic,
    extMemo,
    printSide,
    printFrontColorCount,
    printFrontColor,
    printFrontPosition,
    printBackColorCount,
    printBackColor,
    printBackPosition,
    printMemo,
    cutPosition,
    cutIsUltrasonic,
    cutIsForPowder,
    cutPunchCount,
    cutPunchSize,
    cutPunchPosition,
    cutMemo,
    packMaterial,
    packUnit,
    packCanDeliverAll,
    packMemo,
    images,
    plates = [],
    createdAt,
    updatedAt,
  } = product;

  const productSize = getProductSize({ thickness, length, width } as ProductDto);
  const extrusionDetail = getExtrusionDetail({ extColor, printSide } as ProductDto, t);
  const printSideText = PRINT_SIDE_TEXT[printSide];
  const printFrontDetail = getPrintDetail({
    colorCount: printFrontColorCount,
    color: printFrontColor,
    position: printFrontPosition,
  });
  const printBackDetail = getPrintDetail({
    colorCount: printBackColorCount,
    color: printBackColor,
    position: printBackPosition,
  });
  const punchDetail = getPunchDetail({
    count: cutPunchCount,
    size: cutPunchSize,
    position: cutPunchPosition,
  });
  const packagingDetail = getPackagingDetail({ material: packMaterial, unit: packUnit });
  const hasPlates = Boolean(plates.length);
  const hasImages = Boolean(images.length) || Boolean(filesToUpload.length);
  const hasDates = Boolean(createdAt) && Boolean(updatedAt);

  return (
    <List disablePadding>
      {!hideBaseInfo && (
        <>
          <CustomListSubHeader>{t('baseInfo')}</CustomListSubHeader>
          <DetailField label={t('accountName')} value={account?.name} />
          <DetailField label={t('name')} value={name} />
          <DetailField label={t('productSize')} value={productSize} />
          <div className={classes.gutter} />
        </>
      )}

      <CustomListSubHeader>{t('extrusion')}</CustomListSubHeader>
      <DetailField label={t('extColor')} value={extrusionDetail} />
      <DetailField label={t('extIsAntistatic')} value={extIsAntistatic} />
      <DetailField label={t('extMemo')} value={extMemo} />
      <div className={classes.gutter} />

      <CustomListSubHeader>{t('print')}</CustomListSubHeader>
      <DetailField label={t('print')} value={printSideText} />
      {printSide !== PrintSide.NONE && (
        <>
          <DetailField label={t('printFrontDetail')} value={printFrontDetail} />
          {printSide === PrintSide.DOUBLE && (
            <DetailField label={t('printBackDetail')} value={printBackDetail} />
          )}
          {hasPlates &&
            plates.map((plate, index) => (
              <DetailField
                key={plate.id}
                label={`${t('plates')} ${index + 1}`}
                value={`${getPlateTitle(plate)} ${plate.location}`}
              />
            ))}
          <DetailField label={t('printMemo')} value={printMemo} />
        </>
      )}
      <div className={classes.gutter} />

      <CustomListSubHeader>{t('cutting')}</CustomListSubHeader>
      <DetailField label={t('cutPosition')} value={cutPosition} />
      <DetailField label={t('cutIsUltrasonic')} value={cutIsUltrasonic} />
      <DetailField label={t('cutIsForPowder')} value={cutIsForPowder} />
      <DetailField label={t('punchDetail')} value={punchDetail} />
      <DetailField label={t('cutMemo')} value={cutMemo} />
      <div className={classes.gutter} />

      <CustomListSubHeader>{t('packaging')}</CustomListSubHeader>
      <DetailField label={t('packaging')} value={packagingDetail} />
      <DetailField label={t('packCanDeliverAll')} value={packCanDeliverAll} />
      <DetailField label={t('packMemo')} value={packMemo} />
      <div className={classes.gutter} />

      {hasImages && (
        <>
          <CustomListSubHeader>{t('images')}</CustomListSubHeader>
          <ProductImageContainer className={classes.imageContainer}>
            {images.map(({ imageUrl }) => (
              <ProductImage
                key={imageUrl}
                imageUrl={imageUrl}
                onClick={() => window.open(imageUrl)}
              />
            ))}
            {filesToUpload.map((file) => (
              <ProductImage key={file.name} file={file} />
            ))}
          </ProductImageContainer>
          <div className={classes.gutter} />
        </>
      )}

      {hasDates && (
        <>
          <CustomListSubHeader>{t('dates')}</CustomListSubHeader>
          <DetailField label={t('createdAt')} value={new Date(createdAt).toLocaleString('ko')} />
          <DetailField label={t('updatedAt')} value={new Date(updatedAt).toLocaleString('ko')} />
          <div className={classes.gutter} />
        </>
      )}
    </List>
  );
}

export default ProductDetails;
