import { CreateWorkOrderDto, WorkOrderDto } from 'features/workOrder/interface';
import { DeliveryMethod, LoadingKeys, PlateStatus, WorkOrderStatus } from 'const';
import FormikStepper, { FormikStep } from 'components/form/FormikStepper';
import { date, number, object, string } from 'yup';
import { getInitialWorkOrderFormValues, getWorkOrderToUpdate } from 'utils/workOrder';

import Dialog from 'features/dialog/Dialog';
import Loading from 'components/Loading';
import OrderInfoForm from './OrderInfoForm';
import { ProductDto } from 'features/product/interface';
import React from 'react';
import SelectProductForm from './SelectProductForm';
import { useAppDispatch } from 'app/store';
import { useLoading } from 'features/loading/loadingHook';
import { useTranslation } from 'react-i18next';
import { workOrderActions } from 'features/workOrder/workOrderSlice';

export interface WorkOrderDialogProps {
  workOrder?: WorkOrderDto;
  product?: ProductDto;
  onClose: () => void;
}

export interface WorkOrderFormValues extends Omit<CreateWorkOrderDto, 'accountId' | 'productId'> {
  product?: ProductDto | null;
}

const WorkOrderDialog = ({ workOrder, product, onClose }: WorkOrderDialogProps) => {
  const { t } = useTranslation('workOrders');

  const { [LoadingKeys.SAVING_WORK_ORDER]: isSaving } = useLoading();
  const dispatch = useAppDispatch();
  const { createWorkOrder, updateWorkOrder } = workOrderActions;

  const isEditMode = !!workOrder;
  const isProductSelected = !!workOrder || !!product;

  const dialogTitle = t(isEditMode ? 'editWorkOrder' : 'addWorkOrder');

  const initialValues: WorkOrderFormValues = getInitialWorkOrderFormValues(workOrder, product);

  const validationSchema = {
    selectProduct: object({
      product: object().required(t('productRequired')),
    }),
    orderInfo: object({
      deliverBy: date(),
      orderQuantity: number()
        .integer()
        .required(t('orderQuantityRequired'))
        .min(1, t('minOrderQuantityError', { value: 0 })),
      plateStatus: string().oneOf(Object.values(PlateStatus)).default(PlateStatus.CONFIRM),
      deliveryMethod: string().oneOf(Object.values(DeliveryMethod)).default(DeliveryMethod.TBD),
      workOrderStatus: string().oneOf(Object.values(WorkOrderStatus)).default(WorkOrderStatus.NOT_STARTED),
    }),
  };

  const forms = [
    { label: t('selectProduct'), Component: SelectProductForm, validationSchema: validationSchema.selectProduct },
    { label: t('orderInfo'), Component: OrderInfoForm, validationSchema: validationSchema.orderInfo },
  ];

  const onSubmit = async (values: WorkOrderFormValues) => {
    if (isEditMode) {
      const { id } = workOrder!;
      const workOrderToUpdate = getWorkOrderToUpdate(values);
      dispatch(updateWorkOrder({ id, ...workOrderToUpdate }));
    } else {
      const { product, ...restValues } = values;
      const workOrderToCreate = {
        ...restValues,
        productId: product?.id,
        accountId: product?.accountId,
      };
      dispatch(createWorkOrder(workOrderToCreate as CreateWorkOrderDto));
    }
  };

  const handleClose = () => {
    onClose && onClose();
  };

  return (
    <Dialog open onClose={handleClose} title={dialogTitle} fullHeight>
      {isSaving && <Loading />}
      <FormikStepper initialValues={initialValues} onSubmit={onSubmit} initialStep={isProductSelected ? 1 : 0}>
        {forms.map(({ label, Component, validationSchema }) => (
          <FormikStep key={label} label={label} validationSchema={validationSchema}>
            <Component disabled={isProductSelected} />
          </FormikStep>
        ))}
      </FormikStepper>
    </Dialog>
  );
};

export default WorkOrderDialog;
