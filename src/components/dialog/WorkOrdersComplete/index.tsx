import FormikStepper, { FormikStep, StepperType } from 'components/form/FormikStepper';
import Loading from 'components/Loading';
import Dialog from 'features/dialog/Dialog';
import { CompleteWorkOrderDto, WorkOrderDto } from 'features/workOrder/interface';
import { useCompleteWorkOrdersMutation } from 'features/workOrder/useWorkOrders';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from 'react-query';
import { getProductTitle } from 'utils/product';
import { array, date, number, object } from 'yup';

import WorkOrderCompleteForm from './WorkOrderCompleteForm';

export interface WorkOrdersCompleteDialogProps {
  workOrders: WorkOrderDto[];
  onClose: () => void;
}

const WorkOrdersCompleteDialog = ({ workOrders = [], onClose }: WorkOrdersCompleteDialogProps) => {
  const { t } = useTranslation('workOrders');
  const [isPrevButtonDisabled, setIsPrevButtonDisabled] = useState<boolean>(false);
  const queryClient = useQueryClient();
  const { completeWorkOrders, isUpdating } = useCompleteWorkOrdersMutation({ queryClient, onSuccess: () => onClose() });

  const dialogTitle = t('completeWorkOrder');

  const stepperType = workOrders.length < 2 ? StepperType.NONE : StepperType.COUNTER;

  const initialValues = [...workOrders];

  const validationSchema = array().of(
    object({
      completedAt: date().nullable(),
      completedQuantity: number().integer().required(t('completedQuantityRequired')),
    })
  );

  const onSubmit = (values: WorkOrderDto[]) => {
    const workOrdersToUpdate: CompleteWorkOrderDto[] = values.map(
      ({ id, completedAt, completedQuantity, workOrderStatus, product }) => ({
        id,
        completedAt: completedAt as string,
        completedQuantity: completedQuantity as number,
        workOrderStatus,
        productId: product.id,
      })
    );
    completeWorkOrders(workOrdersToUpdate);
  };

  const handleChangeError = (hasError: boolean) => {
    setIsPrevButtonDisabled(hasError);
  };

  return (
    <Dialog open onClose={onClose} title={dialogTitle}>
      {isUpdating && <Loading />}
      <FormikStepper initialValues={initialValues} onSubmit={onSubmit} stepperType={stepperType}>
        {!!workOrders.length &&
          workOrders.map(({ id, product }, index) => (
            <FormikStep
              key={id}
              label={getProductTitle(product)}
              validationSchema={validationSchema}
              isPrevButtonDisabled={isPrevButtonDisabled}
            >
              <WorkOrderCompleteForm index={index} onChangeError={handleChangeError} />
            </FormikStep>
          ))}
      </FormikStepper>
    </Dialog>
  );
};

export default WorkOrdersCompleteDialog;
