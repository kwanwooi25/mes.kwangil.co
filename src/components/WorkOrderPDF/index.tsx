import { WorkOrderDto } from 'features/workOrder/interface';
import { baseStyles } from 'lib/pdfStyles';
import React, { memo } from 'react';
import { useTranslation } from 'react-i18next';

import { Document, Font, Image, Page, StyleSheet, View } from '@react-pdf/renderer';

import Cutting from './Cutting';
import Extrusion from './Extrusion';
import Memos from './Memos';
import Print from './Print';
import WorkOrderHeader from './WorkOrderHeader';

Font.register({
  // family: 'Nanum Gothic',
  // fonts: [
  //   { src: 'https://fonts.gstatic.com/ea/nanumgothic/v5/NanumGothic-Regular.ttf' },
  //   { src: 'https://fonts.gstatic.com/ea/nanumgothic/v5/NanumGothic-Bold.ttf', fontWeight: 700 },
  //   { src: 'https://fonts.gstatic.com/ea/nanumgothic/v5/NanumGothic-ExtraBold.ttf', fontWeight: 800 },
  // ],
  family: 'Godo',
  fonts: [
    { src: 'https://kwanwoo-fonts.s3.ap-northeast-2.amazonaws.com/GodoM.ttf' },
    { src: 'https://kwanwoo-fonts.s3.ap-northeast-2.amazonaws.com/GodoB.ttf', fontWeight: 700 },
  ],
});

const { flexRowCenter } = baseStyles;

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    // fontFamily: 'Nanum Gothic',
    fontFamily: 'Godo',
    padding: 16,
  },
  workOrderHeader: {
    height: '15%',
    width: '100%',
  },
  detailContainer: {
    padding: '8 0',
    height: '35%',
    width: '100%',
    flexDirection: 'column',
  },
  productDetail: {
    flex: 1,
    ...flexRowCenter,
  },
  productImageContainer: {
    height: '50%',
    width: '100%',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'stretch',
  },
  productImage: {
    maxWidth: '100%',
    maxHeight: '100%',
    objectFit: 'contain',
  },
});

export interface WorkOrderPDFProps {
  workOrders: WorkOrderDto[];
}

const WorkOrderPDF = ({ workOrders }: WorkOrderPDFProps) => {
  const { t } = useTranslation('workOrders');

  return (
    <Document title={t('workOrder')} author="Kwangil Chemical Co.,Ltd">
      {workOrders.map((workOrder) => {
        const { id, product, plateStatus, deliveryMethod, workMemo, deliveryMemo } = workOrder;
        const { images = [] } = product;
        const [image] = images;

        return (
          <Page key={id} size="A4" style={styles.page}>
            <View style={styles.workOrderHeader}>
              <WorkOrderHeader workOrder={workOrder} />
            </View>
            <View style={styles.detailContainer}>
              <View style={styles.productDetail}>
                <Extrusion product={product} />
                <Print product={product} plateStatus={plateStatus} />
                <Cutting product={product} />
              </View>
              <Memos workMemo={workMemo} deliveryMemo={deliveryMemo} deliveryMethod={deliveryMethod} />
            </View>
            <View style={styles.productImageContainer}>
              {image?.imageUrl && <Image style={styles.productImage} src={image.imageUrl} />}
            </View>
          </Page>
        );
      })}
    </Document>
  );
};

export default memo(WorkOrderPDF);
