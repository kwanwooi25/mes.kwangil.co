import { StyleSheet, Text, View } from '@react-pdf/renderer';

import { DeliveryMethod } from 'const';
import React from 'react';
import { baseStyles } from 'lib/pdfStyles';
import { capitalize } from 'lodash';
import { useTranslation } from 'react-i18next';

const { border, borderLeft, lightBorderRight } = baseStyles;

const styles = StyleSheet.create({
  root: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
  },
  row: {
    ...border,
    borderTopWidth: 0,
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  header: {
    ...lightBorderRight,
    fontSize: 12,
    fontWeight: 'bold',
    backgroundColor: '#f7f7f7',
    padding: 8,
  },
  content: {
    flex: 1,
    fontSize: 13,
    padding: 8,
  },
});

export interface MemosProps {
  workMemo?: string;
  deliveryMemo?: string;
  deliveryMethod?: DeliveryMethod;
}

const Memos = ({ workMemo, deliveryMemo, deliveryMethod = DeliveryMethod.TBD }: MemosProps) => {
  const { t } = useTranslation('workOrders');
  const deliveryMethodText = t(`deliveryMethod${capitalize(deliveryMethod)}`);

  return (
    <View style={styles.root}>
      <View style={styles.row}>
        <View style={styles.header}>
          <Text>{t('workMemo')}</Text>
        </View>
        <View style={styles.content}>
          <Text wrap>{workMemo}</Text>
        </View>
      </View>
      <View style={styles.row}>
        <View style={styles.header}>
          <Text>{t('deliveryMemo')}</Text>
        </View>
        <View style={styles.content}>
          <Text wrap>{deliveryMemo}</Text>
        </View>
        <View style={[styles.header, borderLeft]}>
          <Text>{t('deliveryMethod')}</Text>
        </View>
        <View style={[styles.content, { flex: 0.15, textAlign: 'center' }]}>
          <Text>{deliveryMethodText}</Text>
        </View>
      </View>
    </View>
  );
};

export default Memos;
