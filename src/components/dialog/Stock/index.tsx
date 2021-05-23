import { useAppDispatch } from 'app/store';
import Loading from 'components/Loading';
import RoundedButton from 'components/RoundedButton';
import { LoadingKeys } from 'const';
import Dialog from 'features/dialog/Dialog';
import { useLoading } from 'features/loading/loadingHook';
import { CreateStockDto, ProductDto, StockDto } from 'features/product/interface';
import { productActions } from 'features/product/productSlice';
import { Form, Formik } from 'formik';
import React, { createRef } from 'react';
import { useTranslation } from 'react-i18next';
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
  })
);

export interface StockDialogProps {
  products: ProductDto[];
  onClose: () => void;
}

const StockDialog = ({ products, onClose }: StockDialogProps) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const submitButtonRef = createRef<HTMLButtonElement>();
  const dispatch = useAppDispatch();
  const { createOrUpdateStocks } = productActions;
  const { [LoadingKeys.SAVING_STOCK]: isSaving } = useLoading();

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
    })
  );

  const onSubmit = async (values: (CreateStockDto | StockDto)[]) => {
    dispatch(createOrUpdateStocks(values));
  };

  const handleClickSave = () => {
    submitButtonRef?.current?.click();
  };

  return (
    <Dialog open onClose={onClose} title={dialogTitle}>
      {isSaving && <Loading />}
      <DialogContent dividers className={classes.dialogContent}>
        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
          <Form autoComplete="off" style={{ height: '100%' }}>
            {products.map((product, index) => (
              <StockForm key={product.id} index={index} product={product} />
            ))}
            <button ref={submitButtonRef} type="submit" style={{ display: 'none' }}></button>
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
};

export default StockDialog;
