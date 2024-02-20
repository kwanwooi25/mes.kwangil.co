import { ProductDto } from 'features/product/interface';
import { baseStyles } from 'lib/pdfStyles';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { getPackagingDetail, getPunchDetail } from 'utils/product';

import reactPDF from '@react-pdf/renderer';
import { WorkOrderDto } from 'features/workOrder/interface';
import { useWorkOrderDisplay } from 'hooks/useWorkOrderDisplay';

const { StyleSheet, Text, View } = reactPDF;

const { detailSection, detailSectionHeader, detailSectionContent, borderTop } = baseStyles;

const styles = StyleSheet.create({
  root: {
    ...detailSection,
  },
  header: {
    ...detailSectionHeader,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  content: {
    ...detailSectionContent,
  },
});

export interface CuttingProps {
  product: ProductDto;
  workOrder: WorkOrderDto;
}

function Cutting({ product, workOrder }: CuttingProps) {
  const { t } = useTranslation();
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
  const { shouldKeepRemainder } = useWorkOrderDisplay(workOrder, t);
  const punchDetail = `${t('products:punchDetail')}: ${getPunchDetail({ count, size, position })}`;
  const packDetail = getPackagingDetail({ material, unit });

  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <Text>
          {'     '}/{'     '}
        </Text>
        <Text>{t('products:cutting')}</Text>
        <Text>___ 호기</Text>
      </View>
      <View style={styles.content}>
        {cutIsForPowder && <Text>{t('products:cutIsForPowder')}</Text>}
        {cutIsUltrasonic && <Text>{t('products:cutIsUltrasonic')}</Text>}
        {!!cutPosition && <Text>{cutPosition}</Text>}
        {!!count && <Text>{punchDetail}</Text>}
        {!!cutMemo && <Text wrap>{cutMemo}</Text>}
      </View>
      <View style={[styles.header, borderTop]}>
        <Text>{t('products:packaging')}</Text>
      </View>
      <View style={styles.content}>
        {!!shouldKeepRemainder && <Text>{shouldKeepRemainder}</Text>}
        {!!packDetail && <Text>{packDetail}</Text>}
        {packCanDeliverAll && <Text>{t('products:packCanDeliverAll')}</Text>}
        {!!packMemo && <Text wrap>{packMemo}</Text>}
      </View>
    </View>
  );
}

export default Cutting;
