import { StyleSheet, Text, View } from '@react-pdf/renderer';

import { PrintSide } from 'const';
import { ProductDto } from 'features/product/interface';
import React from 'react';
import { baseStyles } from 'lib/pdfStyles';
import { capitalize } from 'lodash';
import { useTranslation } from 'react-i18next';

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
}

const Extrusion = ({ product }: ExtrusionProps) => {
  const { t } = useTranslation('products');
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
    </View>
  );
};

export default Extrusion;
