import FormikStepper, { FormikStep, StepperType } from 'components/form/FormikStepper';
import React, { useState } from 'react';
import { UpdateWorkOrderDto, WorkOrderDto } from 'features/workOrder/interface';
import { array, date, number, object } from 'yup';

import Dialog from 'features/dialog/Dialog';
import Loading from 'components/Loading';
import { LoadingKeys } from 'const';
import WorkOrderCompleteForm from './WorkOrderCompleteForm';
import { getProductTitle } from 'utils/product';
import { getWorkOrderToUpdate } from 'utils/workOrder';
import { useAppDispatch } from 'app/store';
import { useLoading } from 'features/loading/loadingHook';
import { useTranslation } from 'react-i18next';
import { workOrderActions } from 'features/workOrder/workOrderSlice';

export interface WorkOrdersCompleteDialogProps {
  workOrders: WorkOrderDto[];
  onClose: () => void;
}

const WorkOrdersCompleteDialog = ({ workOrders = [], onClose }: WorkOrdersCompleteDialogProps) => {
  const { t } = useTranslation('workOrders');
  const [isPrevButtonDisabled, setIsPrevButtonDisabled] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const { [LoadingKeys.SAVING_WORK_ORDER]: isSaving } = useLoading();
  const { updateWorkOrders } = workOrderActions;

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
    const workOrdersToUpdate: UpdateWorkOrderDto[] = values.map((workOrderToUpdate) => ({
      id: workOrderToUpdate.id,
      ...getWorkOrderToUpdate(workOrderToUpdate),
    }));
    dispatch(updateWorkOrders(workOrdersToUpdate));
  };

  const handleClose = () => {
    onClose && onClose();
  };

  const handleChangeError = (hasError: boolean) => {
    setIsPrevButtonDisabled(hasError);
  };

  return (
    <Dialog open onClose={handleClose} title={dialogTitle}>
      {isSaving && <Loading />}
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
