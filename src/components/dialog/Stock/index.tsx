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

import { createStyles, DialogActions, DialogContent, makeStyles, Theme } from '@material-ui/core';
import { Close, Done } from '@material-ui/icons';

import StockForm from './StockForm';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    dialogContent: {
      padding: theme.spacing(1, 3),
    },
    actionButtons: {
      padding: theme.spacing(3),
      display: 'flex',
      justifyContent: 'space-between',
      '& button': {
        maxWidth: '120px',
      },
    },
  }),
);

export interface StockDialogProps {
  products: ProductDto[];
  onClose: () => void;
}

function StockDialog({ products, onClose }: StockDialogProps) {
  const { t } = useTranslation();
  const classes = useStyles();
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
      <DialogContent dividers className={classes.dialogContent}>
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
      </DialogContent>
      <DialogActions className={classes.actionButtons}>
        <RoundedButton
          color="primary"
          variant="outlined"
          size="large"
          fullWidth
          startIcon={<Close />}
          onClick={onClose}
        >
          {t('common:cancel')}
        </RoundedButton>
        <RoundedButton
          color="primary"
          size="large"
          fullWidth
          startIcon={<Done />}
          onClick={handleClickSave}
          disabled={isSaving}
        >
          {t('common:save')}
        </RoundedButton>
      </DialogActions>
    </Dialog>
  );
}

export default StockDialog;
