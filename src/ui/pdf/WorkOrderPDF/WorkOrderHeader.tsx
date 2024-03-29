import { WorkOrderDto } from 'features/workOrder/interface';
import { useWorkOrderDisplay } from 'hooks/useWorkOrderDisplay';
import React from 'react';
import { useTranslation } from 'react-i18next';

import reactPDF from '@react-pdf/renderer';

const { StyleSheet, Text, View } = reactPDF;

const styles = StyleSheet.create({
  section: {
    padding: 8,
    flexGrow: 1,
  },
  flexRow: {
    flexDirection: 'row',
  },
  headerLeft: {
    alignItems: 'flex-start',
    justifyContent: 'flex-end',
    width: '25%',
  },
  workOrderMonth: {
    fontSize: 12,
  },
  workOrderNumber: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  headerCenter: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  productType: {
    fontSize: 14,
  },
  headerRight: {
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    width: '25%',
  },
  deliveryTags: {
    flexDirection: 'row',
  },
  deliveryTag: {
    fontSize: 18,
    fontWeight: 'bold',
    padding: 8,
    marginLeft: 8,
    marginBottom: 8,
    borderRadius: 20,
    backgroundColor: '#f44336',
    color: '#fff',
  },
  orderedAt: {
    fontSize: 12,
  },

  infoSection: {
    padding: '8 4',
    border: 'solid #181818',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderRightWidth: 0.5,
  },
  productSize: {
    width: '28%',
    alignItems: 'center',
    justifyContent: 'center',
    borderLeftWidth: 1,
  },
  orderQuantity: {
    width: '22%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  names: {
    width: '35%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  deliverBy: {
    width: '15%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRightWidth: 1,
  },
  productSizeText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  orderQuantityText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  orderWeightText: {
    fontSize: 10,
    marginBottom: 4,
  },
  orderLengthText: {
    fontSize: 10,
  },
  productName: {
    fontSize: 14,
    marginBottom: 4,
  },
  accountName: {
    fontSize: 8,
  },
  deliveryDate: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export interface WorkOrderHeaderProps {
  workOrder: WorkOrderDto;
}

function WorkOrderHeader({ workOrder }: WorkOrderHeaderProps) {
  const { t } = useTranslation();

  const documentTitle = t('workOrders:workOrder');
  const {
    workOrderMonth,
    workOrderNumber,
    productType,
    deliveryTags,
    productSize,
    orderedAt,
    orderQuantity,
    orderWeight,
    extrusionSpec: { lengthWithLoss },
    productName,
    accountName,
    deliverBy,
  } = useWorkOrderDisplay(workOrder, t);

  const orderDate = `${t('workOrders:orderedAt')}: ${orderedAt}`;
  const deliveryDate = deliverBy.split('-').slice(1).join('/');

  return (
    <>
      <View style={styles.flexRow}>
        <View style={[styles.section, styles.headerLeft]}>
          <Text style={styles.workOrderMonth}>{workOrderMonth}</Text>
          <Text style={styles.workOrderNumber}>{workOrderNumber}</Text>
        </View>
        <View style={[styles.section, styles.headerCenter]}>
          <Text style={styles.title}>{documentTitle}</Text>
          <Text style={styles.productType}>({productType})</Text>
        </View>
        <View style={[styles.section, styles.headerRight]}>
          {!!deliveryTags.length && (
            <View style={styles.deliveryTags}>
              {deliveryTags.map((tag) => (
                <Text style={styles.deliveryTag} key={tag}>
                  {tag}
                </Text>
              ))}
            </View>
          )}
          <Text style={styles.orderedAt}>{orderDate}</Text>
        </View>
      </View>
      <View style={styles.flexRow}>
        <View style={[styles.infoSection, styles.productSize]}>
          <Text style={styles.productSizeText}>{productSize}</Text>
        </View>
        <View style={[styles.infoSection, styles.orderQuantity]}>
          <Text style={styles.orderQuantityText}>{orderQuantity}</Text>
          <Text style={styles.orderWeightText}>
            ({t('common:weight')}: {orderWeight})
          </Text>
          <Text style={styles.orderLengthText}>
            ({t('common:sheetLength')}: {lengthWithLoss.toLocaleString()})
          </Text>
        </View>
        <View style={[styles.infoSection, styles.names]}>
          <Text style={styles.productName}>{productName}</Text>
          <Text style={styles.accountName}>({accountName})</Text>
        </View>
        <View style={[styles.infoSection, styles.deliverBy]}>
          <Text style={styles.deliveryDate}>{deliveryDate}</Text>
        </View>
      </View>
    </>
  );
}

export default WorkOrderHeader;
