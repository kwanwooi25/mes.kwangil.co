import FormikStepper, { FormikStep } from 'components/form/FormikStepper';
import Loading from 'components/Loading';
import { PrintSide, ProductDialogMode, ProductLength, ProductThickness, ProductWidth } from 'const';
import { AccountOption } from 'features/account/interface';
import Dialog from 'features/dialog/Dialog';
import { ImageDto, ProductDto, StockDto } from 'features/product/interface';
import { useCreateProductMutation } from 'features/product/useProducts';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from 'react-query';
import {
    getCreateProductDto, getInitialProductToCopy, getInitialProductToCreate
} from 'utils/product';
import * as yup from 'yup';

import BaseInfoForm from './BaseInfoForm';
import CuttingForm from './CuttingForm';
import ExtrusionForm from './ExtrusionForm';
import ImageForm from './ImageForm';
import PackagingForm from './PackagingForm';
import PrintForm from './PrintForm';
import ProductReview from './ProductReview';

export interface ProductDialogProps {
  mode: ProductDialogMode;
  product?: ProductDto;
  onClose: () => void;
}

export interface ProductFormValues {
  id?: number;
  account: AccountOption | null;
  name: string;
  thickness: number;
  length: number;
  width: number;
  extColor: string;
  extIsAntistatic: boolean;
  extMemo: string;
  printSide: PrintSide;
  printFrontColorCount: number;
  printFrontColor: string;
  printFrontPosition: string;
  printBackColorCount: number;
  printBackColor: string;
  printBackPosition: string;
  printMemo: string;
  cutPosition: string;
  cutIsUltrasonic: boolean;
  cutIsForPowder: boolean;
  cutPunchCount: number;
  cutPunchSize: string;
  cutPunchPosition: string;
  cutMemo: string;
  packMaterial: string;
  packUnit: number;
  packCanDeliverAll: boolean;
  packMemo: string;
  stock?: StockDto;
  images: ImageDto[];
  filesToUpload?: File[];
  imagesToDelete?: ImageDto[];
}

const ProductDialog = ({ mode, product, onClose }: ProductDialogProps) => {
  const { t } = useTranslation('products');

  const dialogTitle = t('addProduct');

  const queryClient = useQueryClient();

  const onSuccess = () => {
    queryClient.invalidateQueries('products');
    onClose();
  };

  const { createProduct, isCreating } = useCreateProductMutation({ queryClient, onSuccess });
  const isSaving = isCreating;

  const initialValues = {
    [ProductDialogMode.COPY]: getInitialProductToCopy(product as ProductDto),
    [ProductDialogMode.CREATE]: getInitialProductToCreate(),
  };

  const validationSchema = {
    baseInfo: yup.object({
      account: yup
        .object()
        .shape({
          id: yup.number().integer(),
          name: yup.string(),
        })
        .nullable()
        .required(t('accountRequired')),
      name: yup.string().required(t('nameRequired')),
      thickness: yup
        .number()
        .required(t('thicknessRequired'))
        .min(ProductThickness.MIN, t('minThicknessError', { value: ProductThickness.MIN }))
        .max(ProductThickness.MAX, t('maxThicknessError', { value: ProductThickness.MAX })),
      length: yup
        .number()
        .required(t('lengthRequired'))
        .min(ProductLength.MIN, t('minLengthError', { value: ProductLength.MIN }))
        .max(ProductLength.MAX, t('maxLengthError', { value: ProductLength.MAX })),
      width: yup
        .number()
        .required(t('widthRequired'))
        .min(ProductWidth.MIN, t('minWidthError', { value: ProductWidth.MIN }))
        .max(ProductWidth.MAX, t('maxWidthError', { value: ProductWidth.MAX })),
    }),
    extrusion: yup.object({
      extColor: yup.string().required(t('extColorRequired')),
      extIsAntistatic: yup.boolean().default(false),
      extMemo: yup.string(),
    }),
    print: yup.object({
      printSide: yup.string().oneOf(Object.values(PrintSide)),
      printFrontColorCount: yup.number(),
      printFrontColor: yup.string(),
      printFrontPosition: yup.string(),
      printBackColorCount: yup.number(),
      printBackColor: yup.string(),
      printBackPosition: yup.string(),
      printMemo: yup.string(),
    }),
    cutting: yup.object({
      cutPosition: yup.string(),
      cutIsUltrasonic: yup.boolean().default(false),
      cutIsForPowder: yup.boolean().default(false),
      cutPunchCount: yup.number().integer(),
      cutPunchSize: yup.string(),
      cutPunchPosition: yup.string(),
      cutMemo: yup.string(),
    }),
    packaging: yup.object({
      packMaterial: yup.string(),
      packUnit: yup.number().integer(),
      packCanDeliverAll: yup.boolean().default(false),
      packMemo: yup.string(),
    }),
    images: yup.object({
      images: yup.array().of(
        yup.object().shape({
          fileName: yup.string(),
          imageUrl: yup.string(),
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
    { label: t('review'), Component: ProductReview },
  ];

  const onSubmit = async (values: ProductFormValues) => {
    const productToCreate = await getCreateProductDto(values);
    createProduct(productToCreate);
  };

  return (
    <Dialog open onClose={onClose} title={dialogTitle}>
      {isSaving && <Loading />}
      <FormikStepper initialValues={{ ...initialValues[mode] }} onSubmit={onSubmit}>
        {forms.map(({ label, Component, validationSchema }) => (
          <FormikStep key={label} label={label} validationSchema={validationSchema}>
            <Component />
          </FormikStep>
        ))}
      </FormikStepper>
    </Dialog>
  );
};

export default ProductDialog;
