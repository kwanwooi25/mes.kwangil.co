import { PlateStatus } from 'const';
import { WorkOrderDto } from 'features/workOrder/interface';
import { useWorkOrderDisplay } from 'hooks/useWorkOrderDisplay';
import React from 'react';
import { useTranslation } from 'react-i18next';

import reactPDF from '@react-pdf/renderer';

const { Document, Font, Page, StyleSheet, Text, View } = reactPDF;

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

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    // fontFamily: 'Nanum Gothic',
    fontFamily: 'Godo',
    padding: 16,
  },
  row: {
    flexDirection: 'row',
    padding: 8,
    width: '100%',
    borderBottom: '0.5 solid #181818',
  },
  column: {
    flexDirection: 'column',
    justifyContent: 'center',
    padding: 4,
  },
  header: {
    fontSize: 18,
    padding: 8,
    borderBottom: '2 solid #181818',
    marginBottom: 8,
  },
  title: {
    flexGrow: 1,
  },
  workOrderId: {
    fontSize: 11,
    lineHeight: 1.5,
  },
  accountName: {
    fontSize: 12,
    lineHeight: 1.5,
  },
  productTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    lineHeight: 1.5,
  },
  plateCodeList: {
    fontSize: 12,
    marginTop: 1.5,
  },
  plateNew: {
    fontSize: 14,
    fontWeight: 'bold',
    padding: 8,
    borderRadius: 19,
    backgroundColor: '#f44336',
    color: '#fff',
  },
  plateUpdate: {
    fontSize: 14,
    fontWeight: 'bold',
    padding: 8,
    borderRadius: 19,
    backgroundColor: '#fbc02d',
    color: '#fff',
  },
});

export interface NeedPlatePDFProps {
  workOrders: WorkOrderDto[];
}

function Row({ workOrder }: { workOrder: WorkOrderDto }) {
  const { t } = useTranslation();
  const { productTitle, plateStatus, accountName, plateCodeList } = useWorkOrderDisplay(
    workOrder,
    t,
  );
  const isNew = workOrder.plateStatus === PlateStatus.NEW;

  return (
    <View style={styles.row}>
      <View style={[styles.column, styles.title]}>
        <Text style={styles.workOrderId}>{workOrder.id}</Text>
        <Text style={styles.accountName}>{accountName}</Text>
        <Text style={styles.productTitle}>{productTitle}</Text>
        <Text style={styles.plateCodeList}>{plateCodeList && `동판 번호: ${plateCodeList}`}</Text>
      </View>
      <View style={styles.column}>
        <Text style={isNew ? styles.plateNew : styles.plateUpdate}>{plateStatus}</Text>
      </View>
    </View>
  );
}

function NeedPlatePDF({ workOrders }: NeedPlatePDFProps) {
  const { t } = useTranslation('workOrders');

  return (
    <Document title={t('dashboard:plateStatus')} author="Kwangil Chemical Co.,Ltd">
      <Page style={styles.page}>
        <View style={styles.header}>
          <Text>{t('dashboard:plateStatus')}</Text>
        </View>
        {workOrders.map((workOrder) => (
          <Row key={workOrder.id} workOrder={workOrder} />
        ))}
      </Page>
    </Document>
  );
}

export default NeedPlatePDF;
