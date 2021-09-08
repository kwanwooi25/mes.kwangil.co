import CustomToggleButton from 'components/form/CustomToggleButton';
import Input from 'components/form/Input';
import { DatePicker } from 'components/form/Pickers';
import ProductName from 'components/ProductName';
import { DATE_FORMAT, DeliveryMethod, PlateStatus, PrintSide } from 'const';
import { format } from 'date-fns';
import { ProductDto } from 'features/product/interface';
import { useFormikContext } from 'formik';
import { capitalize } from 'lodash';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { getProductSize } from 'utils/product';
import { getWeight } from 'utils/workOrder';

import {
    Checkbox, createStyles, Divider, FormControlLabel, makeStyles, Theme, Typography
} from '@material-ui/core';

import { WorkOrderFormValues } from './';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    orderInfoForm: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gridTemplateAreas: `
        "productTitle productTitle productTitle productTitle"
        "deliverBy deliverBy deliverBy deliverBy"
        "orderQuantity orderQuantity orderQuantity orderWeight"
        "isUrgent isUrgent shouldBePunctual shouldBePunctual"
        "plateStatus plateStatus plateStatus plateStatus"
        "deliveryMethod deliveryMethod deliveryMethod deliveryMethod"
        "workMemo workMemo workMemo workMemo"
        "deliveryMemo deliveryMemo deliveryMemo deliveryMemo"
      `,
      gridColumnGap: theme.spacing(2),
      alignItems: 'center',
      [theme.breakpoints.up('sm')]: {
        gridTemplateColumns: 'repeat(4, 1fr)',
        gridTemplateAreas: `
          "productTitle productTitle productTitle productTitle"
          "deliverBy deliverBy orderQuantity orderWeight"
          "isUrgent plateStatus plateStatus plateStatus"
          "shouldBePunctual deliveryMethod deliveryMethod deliveryMethod"
          "workMemo workMemo workMemo workMemo"
          "deliveryMemo deliveryMemo deliveryMemo deliveryMemo"
        `,
      },
    },
    productTitle: {
      gridArea: 'productTitle',
    },
    divider: {
      margin: theme.spacing(2, 0, 1),
    },
    deliverBy: {
      gridArea: 'deliverBy',
    },
    orderQuantity: {
      gridArea: 'orderQuantity',
    },
    orderWeight: {
      gridArea: 'orderWeight',
      justifySelf: 'end',
    },
    isUrgent: {
      gridArea: 'isUrgent',
    },
    shouldBePunctual: {
      gridArea: 'shouldBePunctual',
    },
    plateStatus: {
      gridArea: 'plateStatus',
      padding: theme.spacing(0, 0, 1),
    },
    deliveryMethod: {
      gridArea: 'deliveryMethod',
      padding: theme.spacing(0, 0, 1),
    },
    workMemo: {
      gridArea: 'workMemo',
    },
    deliveryMemo: {
      gridArea: 'deliveryMemo',
    },
  })
);

export interface OrderInfoFormProps {}

const OrderInfoForm = (props: OrderInfoFormProps) => {
  const { t } = useTranslation('workOrders');
  const classes = useStyles();

  const { values, touched, errors, handleChange, handleBlur, setFieldValue } = useFormikContext<WorkOrderFormValues>();

  const product: ProductDto = values.product as ProductDto;
  const isPrint = product.printSide !== PrintSide.NONE;
  const plateStatusOptions = Object.values(PlateStatus).map((value) => ({
    value,
    label: t(`plateStatus${capitalize(value)}`),
  }));
  const deliveryMethodOptions = Object.values(DeliveryMethod).map((value) => ({
    value,
    label: t(`deliveryMethod${capitalize(value)}`),
  }));

  const handleChangeDeliverBy = (date: Date) => {
    const deliverBy = format(date, DATE_FORMAT);
    setFieldValue('deliverBy', deliverBy);
  };
  const handleChangePlateStatus = (value: PlateStatus) => {
    setFieldValue('plateStatus', value);
    setFieldValue('isPlateReady', value === PlateStatus.CONFIRM);
  };
  const handleChangeDeliveryMethod = (value: DeliveryMethod) => {
    setFieldValue('deliveryMethod', value);
  };

  return (
    <div className={classes.orderInfoForm}>
      <div className={classes.productTitle}>
        <Typography variant="caption">{product.account.name}</Typography>
        <ProductName product={product} />
        <Typography>{getProductSize(product)}</Typography>
        <Divider className={classes.divider} />
      </div>
      <DatePicker
        className={classes.deliverBy}
        selectedDate={new Date(values.deliverBy)}
        onChange={handleChangeDeliverBy}
        label={t('deliverBy')}
        disablePast
      />
      <Input
        className={classes.orderQuantity}
        type="number"
        name="orderQuantity"
        label={t('orderQuantity')}
        value={values.orderQuantity}
        onChange={handleChange}
        onBlur={handleBlur}
        error={touched.orderQuantity && Boolean(errors.orderQuantity)}
        helperText={touched.orderQuantity && errors.orderQuantity}
        inputProps={{ min: 1, max: Infinity }}
      />
      <Typography className={classes.orderWeight}>
        ({getWeight({ product, quantity: values.orderQuantity })} kg)
      </Typography>
      <FormControlLabel
        className={classes.isUrgent}
        control={<Checkbox color="primary" name="isUrgent" checked={values.isUrgent} onChange={handleChange} />}
        label={t('isUrgent')}
      />
      <FormControlLabel
        className={classes.shouldBePunctual}
        control={
          <Checkbox color="primary" name="shouldBePunctual" checked={values.shouldBePunctual} onChange={handleChange} />
        }
        label={t('shouldBePunctual')}
      />
      <CustomToggleButton
        className={classes.plateStatus}
        label={t('plateStatus')}
        value={values.plateStatus}
        onChange={handleChangePlateStatus}
        options={plateStatusOptions}
        disabled={!isPrint}
      />
      <CustomToggleButton
        className={classes.deliveryMethod}
        label={t('deliveryMethod')}
        value={values.deliveryMethod}
        onChange={handleChangeDeliveryMethod}
        options={deliveryMethodOptions}
      />
      <Input
        className={classes.workMemo}
        name="workMemo"
        label={t('workMemo')}
        value={values.workMemo}
        onChange={handleChange}
        multiline
      />
      <Input
        className={classes.deliveryMemo}
        name="deliveryMemo"
        label={t('deliveryMemo')}
        value={values.deliveryMemo}
        onChange={handleChange}
        multiline
      />
    </div>
  );
};

export default OrderInfoForm;
