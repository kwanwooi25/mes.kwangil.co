import * as yup from 'yup';

import FormikStepper, { FormikStep } from 'components/form/FormikStepper';
import { ImageDto, ProductDto } from 'features/product/interface';
import { LoadingKeys, PrintSide, ProductDialogMode, ProductLength, ProductThickness, ProductWidth } from 'const';
import {
  getCreateProductDto,
  getInitialProductToCopy,
  getInitialProductToCreate,
  getInitialProductToUpdate,
  getUpdateProductDto,
} from 'utils/product';

import { AccountOption } from 'features/account/interface';
import BaseInfoForm from './BaseInfoForm';
import CuttingForm from './CuttingForm';
import Dialog from 'features/dialog/Dialog';
import ExtrusionForm from './ExtrusionForm';
import ImageForm from './ImageForm';
import Loading from 'components/Loading';
import PackagingForm from './PackagingForm';
import PrintForm from './PrintForm';
import ProductReview from './ProductReview';
import React from 'react';
import { isEqual } from 'lodash';
import { notificationActions } from 'features/notification/notificationSlice';
import { productActions } from 'features/product/productSlice';
import { useAppDispatch } from 'app/store';
import { useLoading } from 'features/loading/loadingHook';
import { useTranslation } from 'react-i18next';

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
  images: ImageDto[];
  filesToUpload?: File[];
  imagesToDelete?: ImageDto[];
}

const ProductDialog = ({ mode, product, onClose }: ProductDialogProps) => {
  const { t } = useTranslation('products');
  const dispatch = useAppDispatch();
  const { createProduct, updateProduct } = productActions;
  const { [LoadingKeys.SAVING_PRODUCT]: isSaving } = useLoading();

  const dialogTitle = t(mode === ProductDialogMode.EDIT ? 'updateProduct' : 'addProduct');

  const initialValues = {
    [ProductDialogMode.EDIT]: getInitialProductToUpdate(product as ProductDto),
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
    switch (mode) {
      case ProductDialogMode.CREATE:
      case ProductDialogMode.COPY:
        const productToCreate = await getCreateProductDto(values);
        dispatch(createProduct(productToCreate));
        break;

      case ProductDialogMode.EDIT:
        if (isEqual(values, initialValues[ProductDialogMode.EDIT])) {
          dispatch(notificationActions.notify({ variant: 'error', message: 'common:hasNoChange' }));
          onClose();
        }
        const { filesToUpload = [], imagesToDelete = [], ...restValues } = values;
        const productToUpdate = await getUpdateProductDto(
          { ...product, ...restValues } as ProductDto,
          filesToUpload,
          imagesToDelete
        );
        dispatch(updateProduct(productToUpdate));
        break;
    }
  };

  return (
    <Dialog open onClose={onClose} title={dialogTitle} fullHeight>
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
