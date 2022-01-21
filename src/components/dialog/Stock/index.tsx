import Loading from 'components/Loading';
import RoundedButton from 'components/RoundedButton';
import Dialog from 'features/dialog/Dialog';
import { CreateStockDto, ProductDto, StockDto } from 'features/product/interface';
import { useCreateOrUpdateStocksMutation } from 'features/stock/useStocks';
import { Form, Formik } from 'formik';
import React, { createRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from 'react-query';
import { array, number, object } from 'yup';
import { Close, Done } from '@mui/icons-material';
import StockForm from './StockForm';

export interface StockDialogProps {
  products: ProductDto[];
  onClose: () => void;
}

function StockDialog({ products, onClose }: StockDialogProps) {
  const { t } = useTranslation();
  const submitButtonRef = createRef<HTMLButtonElement>();
  const queryClient = useQueryClient();
  const { createOrUpdateStocks, isSaving } = useCreateOrUpdateStocksMutation({
    queryClient,
    onSuccess: () => onClose(),
  });

  const dialogTitle = t('products:createOrUpdateStock');

  const initialValues: (CreateStockDto | StockDto)[] = products.map(({ id, stock }) => ({
    id: stock?.id,
    balance: stock?.balance || 0,
    productId: id,
  }));

  const validationSchema = array().of(
    object({
      id: number().integer(),
      balance: number().integer().required(t('products:balanceRequired')),
      productId: number().integer(),
    }),
  );

  const onSubmit = async (values: (CreateStockDto | StockDto)[]) => createOrUpdateStocks(values);

  const handleClickSave = () => {
    submitButtonRef?.current?.click();
  };

  return (
    <Dialog open onClose={onClose} title={dialogTitle}>
      {isSaving && <Loading />}
      <Dialog.Content dividers>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          <Form autoComplete="off" style={{ height: '100%' }}>
            {products.map((product, index) => (
              <StockForm key={product.id} index={index} product={product} />
            ))}
            {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
            <button ref={submitButtonRef} type="submit" style={{ display: 'none' }} />
          </Form>
        </Formik>
      </Dialog.Content>
      <Dialog.Actions className="!justify-between">
        <RoundedButton
          color="primary"
          variant="outlined"
          size="large"
          startIcon={<Close />}
          onClick={onClose}
        >
          {t('common:cancel')}
        </RoundedButton>
        <RoundedButton
          color="primary"
          size="large"
          startIcon={<Done />}
          onClick={handleClickSave}
          disabled={isSaving}
        >
          {t('common:save')}
        </RoundedButton>
      </Dialog.Actions>
    </Dialog>
  );
}

export default StockDialog;
