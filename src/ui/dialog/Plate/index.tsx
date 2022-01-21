import { PlateLength, PlateMaterial, PlateRound } from 'const';
import Dialog from 'features/dialog/Dialog';
import useNotification from 'features/notification/useNotification';
import { PlateDto, PlateFormValues, UpdatePlateDto } from 'features/plate/interface';
import { useCreatePlateMutation, useUpdatePlateMutation } from 'features/plate/usePlates';
import { ProductDto } from 'features/product/interface';
import { isEmpty, isEqual } from 'lodash';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from 'react-query';
import Loading from 'ui/elements/Loading';
import FormikStepper, { FormikStep } from 'ui/modules/FormikStepper/FormikStepper';
import { getInitialPlateFormValues } from 'utils/plate';
import { array, number, object, string } from 'yup';

import PlateInfoForm from './PlateInfoForm';
import SelectProductsForm from './SelectProductsForm';

export interface PlateDialogProps {
  products?: ProductDto[];
  plate?: PlateDto;
  onClose: (result?: boolean) => void;
}

function PlateDialog({ products = [], plate, onClose }: PlateDialogProps) {
  const { t } = useTranslation('plates');

  const isEditMode = !isEmpty(plate);
  const dialogTitle = t(isEditMode ? 'editPlate' : 'addPlate');

  const { notify } = useNotification();

  const queryClient = useQueryClient();

  const onSuccess = () => {
    queryClient.invalidateQueries('plates');
    onClose();
  };

  const { updatePlate, isUpdating } = useUpdatePlateMutation({ queryClient, onSuccess });
  const { createPlate, isCreating } = useCreatePlateMutation({ queryClient, onSuccess });
  const isSaving = isCreating || isUpdating;

  const initialValues: PlateFormValues = getInitialPlateFormValues({ plate, products });

  const validationSchemas = {
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
    {
      label: t('selectProducts'),
      Component: SelectProductsForm,
      validationSchema: validationSchemas.selectProducts,
    },
    {
      label: t('plateInfo'),
      Component: PlateInfoForm,
      validationSchema: validationSchemas.plateInfo,
    },
  ];

  const onSubmit = async (values: PlateFormValues) => {
    if (isEditMode) {
      const { productsToDisconnect, ...plateToUpdate } = values;
      if (isEqual(plate, plateToUpdate)) {
        notify({ variant: 'error', message: 'common:hasNoChange' });
        onClose();
      } else {
        updatePlate(values as UpdatePlateDto);
      }
    } else {
      const { productsToDisconnect, ...plateToCreate } = values;
      createPlate(plateToCreate);
      onClose(true);
    }
  };

  return (
    <Dialog open onClose={onClose} title={dialogTitle} fullHeight>
      {isSaving && <Loading />}
      <FormikStepper
        initialValues={initialValues}
        onSubmit={onSubmit}
        initialStep={!products.length ? 0 : 1}
      >
        {forms.map(({ label, Component, validationSchema }) => (
          <FormikStep key={label} label={label} validationSchema={validationSchema}>
            <Component />
          </FormikStep>
        ))}
      </FormikStepper>
    </Dialog>
  );
}

export default PlateDialog;
