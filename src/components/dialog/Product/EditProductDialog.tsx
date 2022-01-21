import Loading from 'components/Loading';
import RoundedButton from 'components/RoundedButton';
import { PrintSide, ProductLength, ProductThickness, ProductWidth } from 'const';
import Dialog from 'features/dialog/Dialog';
import useNotification from 'features/notification/useNotification';
import { ProductDto, ProductFormValues } from 'features/product/interface';
import { useUpdateProductMutation } from 'features/product/useProducts';
import { Form, Formik } from 'formik';
import { useScreenSize } from 'hooks/useScreenSize';
import { isEqual } from 'lodash';
import React, { ChangeEvent, createRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from 'react-query';
import { getInitialProductToUpdate, getUpdateProductDto } from 'utils/product';
import { array, boolean, number, object, string } from 'yup';
import { Tab, Tabs } from '@mui/material';
import { Close, Save } from '@mui/icons-material';
import BaseInfoForm from './BaseInfoForm';
import CuttingForm from './CuttingForm';
import ExtrusionForm from './ExtrusionForm';
import ImageForm from './ImageForm';
import PackagingForm from './PackagingForm';
import PrintForm from './PrintForm';

export interface EditProductDialogProps {
  product: ProductDto;
  onClose: () => any;
}

function EditProductDialog({ product, onClose }: EditProductDialogProps) {
  const { t } = useTranslation('products');
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
        }),
      ),
    }),
  };

  const forms = [
    { label: t('baseInfo'), Component: BaseInfoForm, validationSchema: validationSchema.baseInfo },
    {
      label: t('extrusion'),
      Component: ExtrusionForm,
      validationSchema: validationSchema.extrusion,
    },
    { label: t('print'), Component: PrintForm, validationSchema: validationSchema.print },
    { label: t('cutting'), Component: CuttingForm, validationSchema: validationSchema.cutting },
    {
      label: t('packaging'),
      Component: PackagingForm,
      validationSchema: validationSchema.packaging,
    },
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
      imagesToDelete,
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
          <Tab key={label} label={label} className="min-w-[90px]" />
        ))}
      </Tabs>
      <Dialog.Content dividers className="min-h-[320px]">
        <Formik
          initialValues={initialValues}
          validationSchema={form.validationSchema}
          onSubmit={handleSubmit}
        >
          <Form autoComplete="off" style={{ height: '100%' }}>
            <form.Component />
            {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
            <button ref={submitButtonRef} type="submit" style={{ display: 'none' }} />
          </Form>
        </Formik>
      </Dialog.Content>
      <Dialog.Actions>
        <RoundedButton
          color="primary"
          variant="outlined"
          size="large"
          startIcon={<Close />}
          onClick={onClose}
        >
          {t('common:close')}
        </RoundedButton>
        <RoundedButton
          color="primary"
          size="large"
          endIcon={<Save />}
          onClick={handleClickSave}
          disabled={isUpdating}
        >
          {isUpdating && <Loading />}
          {t('common:save')}
        </RoundedButton>
      </Dialog.Actions>
    </Dialog>
  );
}

export default EditProductDialog;
