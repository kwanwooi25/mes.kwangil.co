import FormikStepper, { FormikStep } from 'ui/modules/FormikStepper/FormikStepper';
import Loading from 'ui/elements/Loading';
import { DeliveryMethod, PlateStatus, WorkOrderStatus } from 'const';
import Dialog from 'features/dialog/Dialog';
import { ProductDto } from 'features/product/interface';
import {
  CreateWorkOrderDto,
  WorkOrderDto,
  WorkOrderFormValues,
} from 'features/workOrder/interface';
import {
  useCreateWorkOrderMutation,
  useUpdateWorkOrderMutation,
} from 'features/workOrder/useWorkOrders';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from 'react-query';
import { getInitialWorkOrderFormValues, getWorkOrderToUpdate } from 'utils/workOrder';
import { date, number, object, string } from 'yup';

import OrderInfoForm from './OrderInfoForm';
import SelectProductForm from './SelectProductForm';

export interface WorkOrderDialogProps {
  workOrder?: WorkOrderDto;
  product?: ProductDto;
  onClose: () => void;
}

function WorkOrderDialog({ workOrder, product, onClose }: WorkOrderDialogProps) {
  const { t } = useTranslation('workOrders');
  const isEditMode = !!workOrder;
  const isProductSelected = !!workOrder || !!product;
  const dialogTitle = t(isEditMode ? 'editWorkOrder' : 'addWorkOrder');

  const queryClient = useQueryClient();

  const onSuccess = () => {
    queryClient.invalidateQueries('workOrders');
    onClose();
  };

  const { updateWorkOrder, isUpdating } = useUpdateWorkOrderMutation({ queryClient, onSuccess });
  const { createWorkOrder, isCreating } = useCreateWorkOrderMutation({ queryClient, onSuccess });
  const isSaving = isCreating || isUpdating;

  const initialValues: WorkOrderFormValues = getInitialWorkOrderFormValues(workOrder, product);

  const validationSchemas = {
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
      workOrderStatus: string()
        .oneOf(Object.values(WorkOrderStatus))
        .default(WorkOrderStatus.NOT_STARTED),
    }),
  };

  const forms = [
    {
      label: t('selectProduct'),
      Component: SelectProductForm,
      validationSchema: validationSchemas.selectProduct,
    },
    {
      label: t('orderInfo'),
      Component: OrderInfoForm,
      validationSchema: validationSchemas.orderInfo,
    },
  ];

  const onSubmit = async (values: WorkOrderFormValues) => {
    if (isEditMode) {
      const { id } = workOrder!;
      const workOrderToUpdate = getWorkOrderToUpdate(values);
      updateWorkOrder({ id, ...workOrderToUpdate });
    } else {
      const { product: workOrderProduct, ...restValues } = values;
      const workOrderToCreate = {
        ...restValues,
        productId: workOrderProduct?.id,
        accountId: workOrderProduct?.accountId,
      };
      createWorkOrder(workOrderToCreate as CreateWorkOrderDto);
    }
  };

  return (
    <Dialog open onClose={onClose} title={dialogTitle} fullHeight>
      {isSaving && <Loading />}
      <FormikStepper
        initialValues={initialValues}
        onSubmit={onSubmit}
        initialStep={isProductSelected ? 1 : 0}
      >
        {forms.map(({ label, Component, validationSchema }) => (
          <FormikStep key={label} label={label} validationSchema={validationSchema}>
            <Component disabled={isProductSelected} />
          </FormikStep>
        ))}
      </FormikStepper>
    </Dialog>
  );
}

export default WorkOrderDialog;
