import Input from 'components/form/Input';
import { DATE_FORMAT, WorkOrderStatus } from 'const';
import { format } from 'date-fns';
import { WorkOrderDto } from 'features/workOrder/interface';
import { useFormikContext } from 'formik';
import { isEmpty } from 'lodash';
import React, { ChangeEvent, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getProductSize } from 'utils/product';
import { formatDigit } from 'utils/string';

import {
  Checkbox,
  createStyles,
  FormControlLabel,
  makeStyles,
  Theme,
  Typography,
} from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    productDetail: {
      display: 'flex',
    },
    productImage: {
      maxHeight: '110px',
      marginRight: theme.spacing(1),
    },
    orderDetail: {
      display: 'flex',
      flexDirection: 'column',
    },
    completeForm: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr) auto',
      gridGap: theme.spacing(2),
      alignItems: 'center',
    },
  }),
);

export interface WorkOrderCompleteFormProps {
  index: number;
  onChangeError: (hasError: boolean) => void;
}

function WorkOrderCompleteForm({ index, onChangeError }: WorkOrderCompleteFormProps) {
  const { t } = useTranslation('workOrders');
  const classes = useStyles();
  const { values, errors, setFieldValue, setFieldError } = useFormikContext<WorkOrderDto[]>();

  const handleChangeCompletedQuantity = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setFieldError(
      `[${index}].completedQuantity`,
      !value ? t('completedQuantityRequired') : undefined,
    );
    setFieldValue(`[${index}]`, { ...values[index], completedQuantity: e.target.value });
  };

  const handleChangeIsComplete = (e: ChangeEvent<HTMLInputElement>, checked: boolean) => {
    const completedAt = checked ? format(new Date(), DATE_FORMAT) : '';
    const workOrderStatus = checked ? WorkOrderStatus.COMPLETED : WorkOrderStatus.CUTTING;
    setFieldValue(`[${index}]`, { ...values[index], completedAt, workOrderStatus });
  };

  const { id, product, orderQuantity, completedAt, completedQuantity } = { ...values[index] };
  const accountName = product.account.name;
  const productName = product.name;
  const productSize = getProductSize(product);
  const productImageUrl =
    !!product.images && product.images.length ? product.images[0].imageUrl : undefined;
  const orderQuantityText = t('common:sheetCount', { countString: formatDigit(orderQuantity) });

  useEffect(() => {
    setFieldValue(`[${index}]`, {
      ...values[index],
      completedQuantity: completedQuantity || orderQuantity,
    });
  }, []);

  useEffect(() => {
    onChangeError(!isEmpty(errors));
  }, [errors]);

  return (
    <>
      <div className={classes.productDetail}>
        {productImageUrl && (
          <img className={classes.productImage} src={productImageUrl} alt="product" />
        )}
        <div className={classes.orderDetail}>
          <Typography variant="body1">{id}</Typography>
          <Typography variant="caption">{accountName}</Typography>
          <Typography variant="h6">{productName}</Typography>
          <Typography variant="h6">{productSize}</Typography>
        </div>
      </div>
      <div className={classes.completeForm}>
        <Input
          type="number"
          name="completedQuantity"
          label={t('completedQuantity')}
          value={completedQuantity}
          onChange={handleChangeCompletedQuantity}
          error={!!errors[index]?.completedQuantity}
          helperText={errors[index]?.completedQuantity}
          autoFocus
          onFocus={(e) => {
            setTimeout(() => e.target.select(), 0);
          }}
        />
        <Typography>/ {orderQuantityText}</Typography>
        <FormControlLabel
          control={
            <Checkbox
              color="primary"
              name="isComplete"
              checked={!!completedAt}
              onChange={handleChangeIsComplete}
            />
          }
          label={t('common:done')}
        />
      </div>
    </>
  );
}

export default WorkOrderCompleteForm;
