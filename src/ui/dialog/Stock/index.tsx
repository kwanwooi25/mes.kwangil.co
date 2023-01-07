import React from 'react';
import Dialog from 'features/dialog/Dialog';
import { CreateStockDto, ProductDto, StockDto } from 'features/product/interface';
import { useQueryClient } from 'react-query';
import Loading from 'ui/elements/Loading';
import { number, object } from 'yup';

import { useCreateOrUpdateStocksMutation } from 'features/stock/useStocks';
import FormikStepper, { FormikStep, StepperType } from 'ui/modules/FormikStepper/FormikStepper';
import StockForm from './StockForm';

export interface StockDialogProps {
  product?: ProductDto;
  onClose: () => void;
}

function StockDialog({ product, onClose }: StockDialogProps) {
  const dialogTitle = '재고 수량 변경';

  const queryClient = useQueryClient();

  const onSuccess = () => {
    queryClient.invalidateQueries('products');
    onClose();
  };

  const { createOrUpdateStocks, isSaving } = useCreateOrUpdateStocksMutation({
    queryClient,
    onSuccess,
  });

  const initialValues: Partial<CreateStockDto | StockDto> = {
    id: product?.stock?.id,
    balance: product?.stock?.balance ?? 0,
    productId: product?.id,
  };

  const validationSchemas = {
    stockForm: object().shape({
      stockBalance: number().integer(),
    }),
  };

  const forms = [
    {
      label: '재고 수량 변경',
      Component: StockForm,
      validationSchema: validationSchemas.stockForm,
    },
  ];

  const onSubmit = async (values: Partial<CreateStockDto | StockDto>) => {
    await createOrUpdateStocks([values as CreateStockDto | StockDto]);
    onClose();
  };

  return (
    <Dialog open onClose={onClose} title={dialogTitle}>
      {isSaving && <Loading />}
      <FormikStepper
        initialValues={initialValues}
        onSubmit={onSubmit}
        stepperType={StepperType.NONE}
      >
        {forms.map(({ label, Component, validationSchema }) => (
          <FormikStep key={label} label={label} validationSchema={validationSchema}>
            <Component />
          </FormikStep>
        ))}
      </FormikStepper>
    </Dialog>
  );
}

export default StockDialog;
