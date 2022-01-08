import Loading from 'components/Loading';
import RoundedButton from 'components/RoundedButton';
import { ProductLength, ProductThickness, ProductWidth } from 'const';
import Dialog from 'features/dialog/Dialog';
import { useCreateQuoteMutation } from 'features/quote/useQuotes';
import { Form, Formik } from 'formik';
import React, { createRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from 'react-query';
import { getQuoteToCreate } from 'utils/quote';
import { number, object, string } from 'yup';

import { createStyles, DialogActions, DialogContent, makeStyles, Theme } from '@material-ui/core';
import { Close, Save } from '@material-ui/icons';

import { QuoteFormValues } from 'features/quote/interface';
import QuoteForm from './QuoteForm';

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

export interface QuoteDialogProps {
  onClose: () => any;
}

function QuoteDialog({ onClose }: QuoteDialogProps) {
  const { t } = useTranslation('quotes');
  const classes = useStyles();
  const submitButtonRef = createRef<HTMLButtonElement>();
  const queryClient = useQueryClient();
  const { createQuote, isCreating } = useCreateQuoteMutation({
    queryClient,
    onSuccess: () => onClose(),
  });

  const isSaving = isCreating;
  const dialogTitle = t('createQuote');

  const initialValues = {
    account: null,
    productName: '',
    thickness: 0.05,
    length: 30,
    width: 20,
    printColorCount: 0,
    variableRate: 450,
    printCostPerRoll: 8000,
    defectiveRate: 8,
    unitPrice: 0,
    minQuantity: 10000,
  };

  const validationSchema = object({
    account: object()
      .shape({
        id: number().integer(),
        name: string(),
      })
      .nullable()
      .required(t('accountRequired')),
    productName: string(),
    thickness: number()
      .required(t('thicknessRequired'))
      .min(ProductThickness.MIN, t('minThicknessError', { value: ProductThickness.MIN }))
      .max(ProductThickness.MAX, t('maxThicknessError', { value: ProductThickness.MAX })),
    length: number()
      .required(t('lengthRequired'))
      .min(ProductLength.MIN, t('minLengthError', { value: ProductLength.MIN }))
      .max(ProductLength.MAX, t('maxLengthError', { value: ProductLength.MAX })),
    width: number()
      .required(t('widthRequired'))
      .min(ProductWidth.MIN, t('minWidthError', { value: ProductWidth.MIN }))
      .max(ProductWidth.MAX, t('maxWidthError', { value: ProductWidth.MAX })),
    printColorCount: number().integer(),
    variableRate: number().required(t('variableRateRequired')),
    printCostPerRoll: number().integer(),
    defectiveRate: number().required(t('defectiveRateRequired')),
    plateRound: number(),
    plateLength: number(),
    unitPrice: number().required(t('unitPriceRequired')),
    minQuantity: number().required(t('minQuantityRequired')),
    plateCost: number().integer(),
    plateCount: number().integer(),
  });

  const handleSubmit = (values: QuoteFormValues) => {
    const quoteToCreate = getQuoteToCreate(values);
    createQuote(quoteToCreate);
  };

  const handleClickSave = () => {
    submitButtonRef?.current?.click();
  };

  return (
    <Dialog open onClose={onClose} title={dialogTitle}>
      <DialogContent dividers className={classes.dialogContent}>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          <Form autoComplete="off" style={{ height: '100%' }}>
            <QuoteForm />
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
          {t('common:close')}
        </RoundedButton>
        <RoundedButton
          color="primary"
          size="large"
          fullWidth
          endIcon={<Save />}
          onClick={handleClickSave}
          disabled={isSaving}
        >
          {isSaving && <Loading />}
          {t('common:save')}
        </RoundedButton>
      </DialogActions>
    </Dialog>
  );
}

export default QuoteDialog;
