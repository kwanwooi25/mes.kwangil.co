import Loading from 'components/Loading';
import RoundedButton from 'components/RoundedButton';
import { PrintSide, ProductLength, ProductThickness, ProductWidth } from 'const';
import Dialog from 'features/dialog/Dialog';
import useNotification from 'features/notification/useNotification';
import { ProductDto } from 'features/product/interface';
import { useUpdateProductMutation } from 'features/product/useProducts';
import { Form, Formik } from 'formik';
import { useScreenSize } from 'hooks/useScreenSize';
import { isEqual } from 'lodash';
import React, { ChangeEvent, createRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from 'react-query';
import { getInitialProductToUpdate, getUpdateProductDto } from 'utils/product';
import { array, boolean, number, object, string } from 'yup';

import {
    createStyles, DialogActions, DialogContent, makeStyles, Tab, Tabs, Theme
} from '@material-ui/core';
import { Close, Save } from '@material-ui/icons';

import { ProductFormValues } from './';
import BaseInfoForm from './BaseInfoForm';
import CuttingForm from './CuttingForm';
import ExtrusionForm from './ExtrusionForm';
import ImageForm from './ImageForm';
import PackagingForm from './PackagingForm';
import PrintForm from './PrintForm';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    tab: {
      minWidth: '90px',
    },
    dialogContent: {
      padding: theme.spacing(1, 3),
      minHeight: '320px',
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

export interface EditProductDialogProps {
  product: ProductDto;
  onClose: () => any;
}

const EditProductDialog = ({ product, onClose }: EditProductDialogProps) => {
  const { t } = useTranslation('products');
  const classes = useStyles();
  const [tabIndex, setTabIndex] = useState<number>(0);
  const { isMobileLayout } = useScreenSize();
  const submitButtonRef = createRef<HTMLButtonElement>();
  const { notify } = useNotification();
  const queryClient = useQueryClient();

  const onSuccess = () => {
    queryClient.invalidateQueries('products');
  };

  const { updateProduct, isUpdating } = useUpdateProductMutation({ queryClient, onSuccess });

  const dialogTitle = t('updateProduct');

  const initialValues = getInitialProductToUpdate(product);

  const validationSchema = {
    baseInfo: object({
      account: object()
        .shape({
          id: number().integer(),
          name: string(),
        })
        .nullable()
        .required(t('accountRequired')),
      name: string().required(t('nameRequired')),
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
    }),
    extrusion: object({
      extColor: string().required(t('extColorRequired')),
      extIsAntistatic: boolean().default(false),
      extMemo: string(),
    }),
    print: object({
      printSide: string().oneOf(Object.values(PrintSide)),
      printFrontColorCount: number(),
      printFrontColor: string(),
      printFrontPosition: string(),
      printBackColorCount: number(),
      printBackColor: string(),
      printBackPosition: string(),
      printMemo: string(),
    }),
    cutting: object({
      cutPosition: string(),
      cutIsUltrasonic: boolean().default(false),
      cutIsForPowder: boolean().default(false),
      cutPunchCount: number().integer(),
      cutPunchSize: string(),
      cutPunchPosition: string(),
      cutMemo: string(),
    }),
    packaging: object({
      packMaterial: string(),
      packUnit: number().integer(),
      packCanDeliverAll: boolean().default(false),
      packMemo: string(),
    }),
    images: object({
      images: array().of(
        object().shape({
          fileName: string(),
          imageUrl: string(),
        })
      ),
    }),
  };

  const forms = [
    { label: t('baseInfo'), Component: BaseInfoForm, validationSchema: validationSchema.baseInfo },
    { label: t('extrusion'), Component: ExtrusionForm, validationSchema: validationSchema.extrusion },
    { label: t('print'), Component: PrintForm, validationSchema: validationSchema.print },
    { label: t('cutting'), Component: CuttingForm, validationSchema: validationSchema.cutting },
    { label: t('packaging'), Component: PackagingForm, validationSchema: validationSchema.packaging },
    { label: t('images'), Component: ImageForm, validationSchema: validationSchema.images },
  ];

  const form = forms[tabIndex];

  const handleTabChange = (e: ChangeEvent<{}>, index: number) => {
    setTabIndex(index);
  };

  const handleSubmit = async (values: ProductFormValues) => {
    if (isEqual(values, initialValues)) {
      notify({ variant: 'error', message: 'common:hasNoChange' });
      return;
    }
    const { filesToUpload = [], imagesToDelete = [], ...restValues } = values;
    const productToUpdate = await getUpdateProductDto(
      { ...product, ...restValues } as ProductDto,
      filesToUpload,
      imagesToDelete
    );
    updateProduct(productToUpdate);
  };

  const handleClickSave = () => {
    submitButtonRef?.current?.click();
  };

  return (
    <Dialog open onClose={onClose} title={dialogTitle}>
      <Tabs
        value={tabIndex}
        onChange={handleTabChange}
        indicatorColor="primary"
        textColor="primary"
        variant={isMobileLayout ? 'scrollable' : 'standard'}
        scrollButtons="auto"
        centered
      >
        {forms.map(({ label }) => (
          <Tab key={label} label={label} className={classes.tab} />
        ))}
      </Tabs>
      <DialogContent dividers className={classes.dialogContent}>
        <Formik initialValues={initialValues} validationSchema={form.validationSchema} onSubmit={handleSubmit}>
          <Form autoComplete="off" style={{ height: '100%' }}>
            <form.Component />
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
          {t('common:close')}
        </RoundedButton>
        <RoundedButton
          color="primary"
          size="large"
          fullWidth
          endIcon={<Save />}
          onClick={handleClickSave}
          disabled={isUpdating}
        >
          {isUpdating && <Loading />}
          {t('common:save')}
        </RoundedButton>
      </DialogActions>
    </Dialog>
  );
};

export default EditProductDialog;
