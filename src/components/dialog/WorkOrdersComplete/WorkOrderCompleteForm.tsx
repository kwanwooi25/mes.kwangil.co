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

import { Checkbox, FormControlLabel } from '@mui/material';

export interface WorkOrderCompleteFormProps {
  index: number;
  onChangeError: (hasError: boolean) => void;
}

function WorkOrderCompleteForm({ index, onChangeError }: WorkOrderCompleteFormProps) {
  const { t } = useTranslation('workOrders');
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
      <div className="flex gap-4 pb-4">
        {productImageUrl && <img className="h-[100px]" src={productImageUrl} alt="product" />}
        <div className="flex flex-col">
          <span className="text-base">{id}</span>
          <span className="text-sm">{accountName}</span>
          <span className="text-xl">{productName}</span>
          <span className="text-xl">{productSize}</span>
        </div>
      </div>
      <div className="grid grid-cols-[1fr_1fr_auto] gap-x-3 items-center">
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
        <span>/ {orderQuantityText}</span>
        <FormControlLabel
          control={
            <Checkbox
              color="primary"
              name="isComplete"
              checked={!!completedAt}
              onChange={handleChangeIsComplete}
            />
          }
          label={t('common:done') as string}
        />
      </div>
    </>
  );
}

export default WorkOrderCompleteForm;
