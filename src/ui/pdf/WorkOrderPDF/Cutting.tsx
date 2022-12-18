import { ProductDto } from 'features/product/interface';
import { baseStyles } from 'lib/pdfStyles';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { getPackagingDetail, getPunchDetail } from 'utils/product';

import reactPDF from '@react-pdf/renderer';

const { StyleSheet, Text, View } = reactPDF;

const { detailSection, detailSectionHeader, detailSectionContent, borderTop } = baseStyles;

const styles = StyleSheet.create({
  root: {
    ...detailSection,
  },
  header: {
    ...detailSectionHeader,
  },
  content: {
    ...detailSectionContent,
  },
});

export interface CuttingProps {
  product: ProductDto;
}

function Cutting({ product }: CuttingProps) {
  const { t } = useTranslation('products');
  const {
    cutIsForPowder,
    cutIsUltrasonic,
    cutPosition,
    cutPunchCount: count,
    cutPunchSize: size,
    cutPunchPosition: position,
    cutMemo,
    packMaterial: material,
    packUnit: unit,
    packCanDeliverAll,
    packMemo,
  } = product;
  const punchDetail = `${t('punchDetail')}: ${getPunchDetail({ count, size, position })}`;
  const packDetail = getPackagingDetail({ material, unit });

  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <Text>{t('cutting')}</Text>
      </View>
      <View style={styles.content}>
        {cutIsForPowder && <Text>{t('cutIsForPowder')}</Text>}
        {cutIsUltrasonic && <Text>{t('cutIsUltrasonic')}</Text>}
        {!!cutPosition && <Text>{cutPosition}</Text>}
        {!!count && <Text>{punchDetail}</Text>}
        {!!cutMemo && <Text wrap>{cutMemo}</Text>}
      </View>
      <View style={styles.content}>
        <Text>재고 수량: {'                    '}매</Text>
      </View>
      <View style={[styles.header, borderTop]}>
        <Text>{t('packaging')}</Text>
      </View>
      <View style={styles.content}>
        {!!packDetail && <Text>{packDetail}</Text>}
        {packCanDeliverAll && <Text>{t('packCanDeliverAll')}</Text>}
        {!!packMemo && <Text wrap>{packMemo}</Text>}
      </View>
    </View>
  );
}

export default Cutting;
