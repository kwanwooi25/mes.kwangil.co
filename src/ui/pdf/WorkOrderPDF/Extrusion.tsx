import { PrintSide } from 'const';
import { ProductDto } from 'features/product/interface';
import { baseStyles } from 'lib/pdfStyles';
import { capitalize } from 'lodash';
import React from 'react';
import { useTranslation } from 'react-i18next';

import reactPDF from '@react-pdf/renderer';
import { useWorkOrderDisplay } from 'hooks/useWorkOrderDisplay';
import { WorkOrderDto } from 'features/workOrder/interface';

const { StyleSheet, Text, View } = reactPDF;

const { detailSection, detailSectionHeader, detailSectionContent } = baseStyles;

const styles = StyleSheet.create({
  root: {
    ...detailSection,
    borderRightWidth: '0',
  },
  header: {
    ...detailSectionHeader,
  },
  content: {
    ...detailSectionContent,
  },
});

export interface ExtrusionProps {
  product: ProductDto;
  workOrder: WorkOrderDto;
}

function Extrusion({ product, workOrder }: ExtrusionProps) {
  const { t } = useTranslation('products');
  const {
    extrusionSpec: { lengthPerRoll, rollCount },
  } = useWorkOrderDisplay(workOrder, t);
  const { extColor, printSide, extMemo, extIsAntistatic } = product;

  const extColorText = `${extColor} ${t('common:sheet')}`;
  let printSideText = t(`print${capitalize(printSide.toLowerCase())}`);
  if (printSide !== PrintSide.NONE) {
    printSideText += t('common:treatment');
  }

  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <Text>{t('extrusion')}</Text>
      </View>
      <View style={styles.content}>
        <Text>{extColorText}</Text>
        <Text>{printSideText}</Text>
        {extIsAntistatic && <Text>{t('extIsAntistatic')}</Text>}
        <Text wrap>{extMemo}</Text>
      </View>
      <View style={styles.content}>
        <Text>
          ({lengthPerRoll.toLocaleString()}m x {rollCount})
        </Text>
      </View>
    </View>
  );
}

export default Extrusion;
