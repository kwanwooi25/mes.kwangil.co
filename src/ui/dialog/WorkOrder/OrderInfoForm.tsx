import { Checkbox, Divider, FormControlLabel } from '@mui/material';
import { DATE_FORMAT, DeliveryMethod, PlateStatus, PrintSide } from 'const';
import { format } from 'date-fns';
import { ProductDto } from 'features/product/interface';
import { WorkOrderFormValues } from 'features/workOrder/interface';
import { useFormikContext } from 'formik';
import { capitalize } from 'lodash';
import { ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';
import AccountName from 'ui/elements/AccountName';
import CustomToggleButton from 'ui/elements/CustomToggleButton';
import Input from 'ui/elements/Input';
import ProductName from 'ui/elements/ProductName';
import { DatePicker } from 'ui/modules/Pickers';
import { getProductSize } from 'utils/product';
import { formatDigit } from 'utils/string';
import { getWeight } from 'utils/workOrder';

function OrderInfoForm() {
  const { t } = useTranslation('workOrders');

  const { values, touched, errors, handleChange, handleBlur, setFieldValue } =
    useFormikContext<WorkOrderFormValues>();

  const product: ProductDto = values.product as ProductDto;
  const isPrint = product.printSide !== PrintSide.NONE;
  const lossRatio = isPrint ? 0.1 : 0.05;
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
  const handleChangeOrderQuantity = (e: ChangeEvent<HTMLInputElement>) => {
    setFieldValue('orderQuantity', e.target.value);
    setFieldValue('deliveryQuantity', e.target.value);
  };
  const handleChangePlateStatus = (value: PlateStatus) => {
    setFieldValue('plateStatus', value);
    setFieldValue('isPlateReady', value === PlateStatus.CONFIRM);
  };
  const handleChangeDeliveryMethod = (value: DeliveryMethod) => {
    setFieldValue('deliveryMethod', value);
  };

  return (
    <div className="flex flex-col gap-x-3 gap-y-2 items-start tablet:grid tablet:grid-cols-6 tablet:items-center">
      <div className="flex flex-col col-span-3 w-full tablet:col-span-6">
        <AccountName account={product.account} />
        <ProductName product={product} />
        <p className="py-1 px-2">{getProductSize(product)}</p>
        {product?.stock?.balance && (
          <p className="py-1 px-2">재고 수량: {product.stock.balance.toLocaleString()}매</p>
        )}
        <Divider className="!my-4" />
      </div>
      <div className="tablet:col-span-2 tablet:self-start">
        <DatePicker
          selectedDate={new Date(values.deliverBy)}
          onChange={handleChangeDeliverBy}
          label={t('deliverBy')}
          disablePast
        />
      </div>
      <div className="flex items-center w-full tablet:flex-col tablet:col-span-2 tablet:items-start">
        <Input
          type="number"
          name="orderQuantity"
          label={t('orderQuantity')}
          value={values.orderQuantity}
          onChange={handleChangeOrderQuantity}
          onBlur={handleBlur}
          error={touched.orderQuantity && Boolean(errors.orderQuantity)}
          helperText={touched.orderQuantity && errors.orderQuantity}
          inputProps={{ min: 1, max: Infinity }}
        />
        <div className="flex flex-col shrink-0 gap-1 pl-3">
          <span>({getWeight({ product, quantity: values.orderQuantity })} kg)</span>
          <span className="text-xs">
            (예상 작업수량:{' '}
            {t('common:sheetCount', {
              countString: formatDigit((values.orderQuantity * (1 + lossRatio)).toFixed(0)),
            })}
            )
          </span>
        </div>
      </div>
      <Input
        className="tablet:col-span-2 tablet:self-start"
        type="number"
        name="deliveryQuantity"
        label={t('deliveryQuantity')}
        value={values.deliveryQuantity}
        onChange={handleChange}
        inputProps={{ min: 1, max: Infinity }}
      />
      <FormControlLabel
        className="tablet:col-span-2"
        control={
          <Checkbox
            color="primary"
            name="isUrgent"
            checked={values.isUrgent}
            onChange={handleChange}
          />
        }
        label={t('isUrgent') as string}
      />
      <FormControlLabel
        className="tablet:col-span-2"
        control={
          <Checkbox
            color="primary"
            name="shouldBePunctual"
            checked={values.shouldBePunctual}
            onChange={handleChange}
          />
        }
        label={t('shouldBePunctual') as string}
      />
      <FormControlLabel
        className="tablet:col-span-2"
        control={
          <Checkbox
            color="primary"
            name="shouldDeliverAll"
            checked={values.shouldDeliverAll}
            onChange={handleChange}
          />
        }
        label={t('shouldDeliverAll') as string}
      />
      <CustomToggleButton
        className="col-span-3"
        label={t('plateStatus')}
        value={values.plateStatus}
        onChange={handleChangePlateStatus}
        options={plateStatusOptions}
        disabled={!isPrint}
      />
      <CustomToggleButton
        className="col-span-3"
        label={t('deliveryMethod')}
        value={values.deliveryMethod}
        onChange={handleChangeDeliveryMethod}
        options={deliveryMethodOptions}
      />
      <Input
        className="col-span-3 tablet:col-span-6"
        name="workMemo"
        label={t('workMemo')}
        value={values.workMemo}
        onChange={handleChange}
        multiline
      />
      <Input
        className="col-span-3 tablet:col-span-6"
        name="deliveryMemo"
        label={t('deliveryMemo')}
        value={values.deliveryMemo}
        onChange={handleChange}
        multiline
      />
    </div>
  );
}

export default OrderInfoForm;
