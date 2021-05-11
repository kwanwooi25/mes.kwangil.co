import { useAppDispatch } from 'app/store';
import FormikStepper, { FormikStep } from 'components/form/FormikStepper';
import Loading from 'components/Loading';
import { LoadingKeys, PlateLength, PlateMaterial, PlateRound } from 'const';
import Dialog from 'features/dialog/Dialog';
import { useLoading } from 'features/loading/loadingHook';
import { CreatePlateDto, PlateDto, UpdatePlateDto } from 'features/plate/interface';
import { plateActions } from 'features/plate/plateSlice';
import { ProductDto } from 'features/product/interface';
import { isEmpty, isEqual } from 'lodash';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { getInitialPlateFormValues } from 'utils/plate';
import { array, number, object, string } from 'yup';

import PlateInfoForm from './PlateInfoForm';
import SelectProductsForm from './SelectProductsForm';

export interface PlateDialogProps {
  products?: ProductDto[];
  plate?: PlateDto;
  onClose: (result?: boolean) => void;
}

export interface PlateFormValues extends CreatePlateDto {
  id?: number;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
  productsToDisconnect?: ProductDto[];
}

const PlateDialog = ({ products = [], plate, onClose }: PlateDialogProps) => {
  const { t } = useTranslation('plates');
  const { [LoadingKeys.SAVING_PLATE]: isSaving } = useLoading();
  const dispatch = useAppDispatch();
  const { createPlate, updatePlate } = plateActions;

  const isEditMode = !isEmpty(plate);
  const dialogTitle = t(isEditMode ? 'editPlate' : 'addPlate');

  const initialValues: PlateFormValues = getInitialPlateFormValues({ plate, products });

  const validationSchema = {
    plateInfo: object({
      round: number()
        .required(t('roundRequired'))
        .min(PlateRound.MIN, t('minRoundError', { value: PlateRound.MIN }))
        .max(PlateRound.MAX, t('maxRoundError', { value: PlateRound.MAX })),
      length: number()
        .required(t('lengthRequired'))
        .min(PlateLength.MIN, t('minLengthError', { value: PlateLength.MIN }))
        .max(PlateLength.MAX, t('maxLengthError', { value: PlateLength.MAX })),
      name: string(),
      material: string()
        .oneOf(Object.values(PlateMaterial))
        .default(PlateMaterial.STEEL)
        .required(t('materialRequired')),
      location: string(),
      memo: string(),
    }),
    selectProducts: object({
      products: array(),
    }),
  };

  const forms = [
    { label: t('selectProducts'), Component: SelectProductsForm, validationSchema: validationSchema.selectProducts },
    { label: t('plateInfo'), Component: PlateInfoForm, validationSchema: validationSchema.plateInfo },
  ];

  const onSubmit = async (values: PlateFormValues) => {
    if (isEditMode) {
      const { productsToDisconnect, ...plateToUpdate } = values;
      if (isEqual(plate, plateToUpdate)) {
        onClose();
      } else {
        dispatch(updatePlate(values as UpdatePlateDto));
      }
    } else {
      const { productsToDisconnect, ...plateToCreate } = values;
      dispatch(createPlate(plateToCreate));
      onClose(true);
    }
  };

  return (
    <Dialog open onClose={onClose} title={dialogTitle} fullHeight>
      {isSaving && <Loading />}
      <FormikStepper initialValues={initialValues} onSubmit={onSubmit} initialStep={!products.length ? 0 : 1}>
        {forms.map(({ label, Component, validationSchema }) => (
          <FormikStep key={label} label={label} validationSchema={validationSchema}>
            <Component />
          </FormikStep>
        ))}
      </FormikStepper>
    </Dialog>
  );
};

export default PlateDialog;
