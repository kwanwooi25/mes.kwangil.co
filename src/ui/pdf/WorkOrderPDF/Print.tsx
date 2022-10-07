import { PlateStatus } from 'const';
import { ProductDto } from 'features/product/interface';
import { baseStyles } from 'lib/pdfStyles';
import { capitalize } from 'lodash';
import React from 'react';
import { useTranslation } from 'react-i18next';

import reactPDF from '@react-pdf/renderer';
import { getPlateTitle } from 'utils/plate';

const { StyleSheet, Text, View } = reactPDF;

const {
  detailSection,
  detailSectionHeader,
  detailSectionContent,
  flexRowCenter,
  flexColumnCenter,
  lightBorderRight,
  lightBorderBottom,
} = baseStyles;

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
    padding: 0,
  },
  subContent: {
    ...flexRowCenter,
    ...lightBorderBottom,
    flex: 1,
    width: '100%',
  },
  printSideTitle: {
    ...flexRowCenter,
    ...lightBorderRight,
    width: 24,
    height: '100%',
    fontSize: 11,
    padding: 2,
  },
  printSideDetail: {
    ...flexColumnCenter,
    flexGrow: 10,
    height: '100%',
    padding: 4,
  },
  plateDetail: {
    ...flexRowCenter,
    width: '100%',
    fontSize: 12,
  },
  plateStatus: {
    ...lightBorderRight,
    ...flexColumnCenter,
    flex: 2,
    textAlign: 'center',
    padding: 4,
    height: '100%',
  },
  plates: {
    flex: 4,
    fontSize: 10,
    padding: 4,
  },
});

export interface PrintProps {
  product: ProductDto;
  plateStatus?: PlateStatus;
}

function Print({ product, plateStatus }: PrintProps) {
  const { t } = useTranslation('products');
  const {
    printFrontColorCount,
    printFrontColor,
    printFrontPosition,
    printBackColorCount,
    printBackColor,
    printBackPosition,
    printMemo,
    plates = [],
  } = product;

  const isPrint = printFrontColorCount + printBackColorCount > 0;
  const plateStatusText = t(`workOrders:plateStatus${capitalize(plateStatus)}`);

  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <Text>{t('print')}</Text>
      </View>
      <View style={styles.content}>
        {isPrint && (
          <>
            <View style={styles.subContent}>
              <View style={styles.printSideTitle}>
                <Text wrap>전</Text>
              </View>
              <View style={styles.printSideDetail} wrap>
                {!!printFrontColorCount && (
                  <>
                    <Text wrap>
                      {`${printFrontColorCount}도`} ({printFrontColor})
                    </Text>
                    <Text wrap>{printFrontPosition}</Text>
                  </>
                )}
              </View>
            </View>
            <View style={styles.subContent}>
              <View style={styles.printSideTitle}>
                <Text wrap>후</Text>
              </View>
              <View style={styles.printSideDetail} wrap>
                {!!printBackColorCount && (
                  <>
                    <Text wrap>
                      {`${printBackColorCount}도`} ({printBackColor})
                    </Text>
                    <Text wrap>{printBackPosition}</Text>
                  </>
                )}
              </View>
            </View>
            <View style={styles.subContent}>
              <Text wrap>{printMemo}</Text>
            </View>
            <View style={styles.plateDetail}>
              <View style={styles.plateStatus}>
                <Text>{plateStatusText}</Text>
              </View>
              <View style={styles.plates}>
                {plates?.map((plate) => (
                  <Text key={plate.id}>
                    [{plate.code}] {getPlateTitle(plate)}
                  </Text>
                ))}
              </View>
            </View>
          </>
        )}
      </View>
    </View>
  );
}

export default Print;
