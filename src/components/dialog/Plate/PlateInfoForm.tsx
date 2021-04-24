import { PlateLength, PlateMaterial, PlateRound } from 'const';
import { Theme, createStyles, makeStyles } from '@material-ui/core';

import CustomToggleButton from 'components/form/CustomToggleButton';
import Input from 'components/form/Input';
import { PlateFormValues } from '.';
import React from 'react';
import { useFormikContext } from 'formik';
import { useTranslation } from 'react-i18next';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    plateInfo: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gridColumnGap: theme.spacing(2),
      gridTemplateAreas: `
        "material material"
        "name name"
        "round length"
        "location location"
        "memo memo"
      `,
      [theme.breakpoints.up('sm')]: {
        gridTemplateColumns: 'repeat(4, 1fr)',
        gridTemplateAreas: `
          "material material name name"
          "round length location location"
          "memo memo memo memo"
        `,
      },
    },
    material: {
      gridArea: 'material',
      padding: theme.spacing(1, 0),
      [theme.breakpoints.up('sm')]: {
        paddingTop: theme.spacing(2),
      },
    },
    round: {
      gridArea: 'round',
    },
    length: {
      gridArea: 'length',
    },
    name: {
      gridArea: 'name',
    },
    location: {
      gridArea: 'location',
    },
    memo: {
      gridArea: 'memo',
    },
  })
);

export interface PlateInfoFormProps {}

const PlateInfoForm = (props: PlateInfoFormProps) => {
  const { t } = useTranslation('plates');
  const classes = useStyles();
  const { values, touched, errors, setFieldValue, handleChange, handleBlur } = useFormikContext<PlateFormValues>();

  const materialOptions = Object.values(PlateMaterial).map((value) => ({ value, label: t(value.toLowerCase()) }));

  const handleChangeMaterial = (value: PlateMaterial) => {
    setFieldValue('material', value);
  };

  return (
    <div className={classes.plateInfo}>
      <CustomToggleButton
        className={classes.material}
        value={values.material}
        onChange={handleChangeMaterial}
        options={materialOptions}
      />
      <Input
        className={classes.name}
        name="name"
        label={t('name')}
        value={values.name}
        onChange={handleChange}
        onBlur={handleBlur}
        error={touched.name && Boolean(errors.name)}
        helperText={touched.name && errors.name}
      />
      <Input
        className={classes.round}
        type="number"
        name="round"
        label={t('round')}
        value={values.round}
        onChange={handleChange}
        onBlur={handleBlur}
        error={touched.round && Boolean(errors.round)}
        helperText={touched.round && errors.round}
        inputProps={{ step: PlateRound.STEP, min: PlateRound.MIN, max: PlateRound.MAX }}
      />
      <Input
        className={classes.length}
        type="number"
        name="length"
        label={t('length')}
        value={values.length}
        onChange={handleChange}
        onBlur={handleBlur}
        error={touched.length && Boolean(errors.length)}
        helperText={touched.length && errors.length}
        inputProps={{ step: PlateLength.STEP, min: PlateLength.MIN, max: PlateLength.MAX }}
      />
      <Input
        className={classes.location}
        name="location"
        label={t('location')}
        value={values.location}
        onChange={handleChange}
        onBlur={handleBlur}
        error={touched.location && Boolean(errors.location)}
        helperText={touched.location && errors.location}
      />
      <Input
        className={classes.memo}
        name="memo"
        label={t('memo')}
        value={values.memo}
        onChange={handleChange}
        onBlur={handleBlur}
        error={touched.memo && Boolean(errors.memo)}
        helperText={touched.memo && errors.memo}
        multiline
      />
    </div>
  );
};

export default PlateInfoForm;