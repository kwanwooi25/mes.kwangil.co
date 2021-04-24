import { CreatePlateDto, PlateDto, UpdatePlateDto } from 'features/plate/interface';
import FormikStepper, { FormikStep } from 'components/form/FormikStepper';
import { LoadingKeys, PlateLength, PlateMaterial, PlateRound } from 'const';
import { array, number, object, string } from 'yup';
import { isEmpty, isEqual } from 'lodash';

import Dialog from 'features/dialog/Dialog';
import Loading from 'components/Loading';
import PlateInfoForm from './PlateInfoForm';
import { ProductDto } from 'features/product/interface';
import React from 'react';
import SelectProductsForm from './SelectProductsForm';
import { plateActions } from 'features/plate/plateSlice';
import { useAppDispatch } from 'app/store';
import { useLoading } from 'features/loading/loadingHook';
import { useTranslation } from 'react-i18next';

export interface PlateDialogProps {
  plate?: PlateDto;
  onClose: () => void;
}

export interface PlateFormValues extends CreatePlateDto {
  id?: number;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
  productsToDisconnect?: ProductDto[];
}

const PlateDialog = ({ plate, onClose }: PlateDialogProps) => {
  const { t } = useTranslation('plates');
  const { [LoadingKeys.SAVING_PLATE]: isSaving } = useLoading();
  const dispatch = useAppDispatch();
  const { createPlate, updatePlate } = plateActions;

  const isEditMode = !isEmpty(plate);
  const dialogTitle = t(isEditMode ? 'editPlate' : 'addPlate');

  const initialValues: PlateFormValues = {
    round: PlateRound.MIN,
    length: PlateLength.MIN,
    name: '',
    material: PlateMaterial.STEEL,
    location: '',
    memo: '',
    ...plate,
    products: [...(plate?.products || [])],
    productsToDisconnect: [],
  };

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
    }
  };

  return (
    <Dialog open onClose={onClose} title={dialogTitle} fullHeight>
      {isSaving && <Loading />}
      <FormikStepper initialValues={initialValues} onSubmit={onSubmit}>
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
