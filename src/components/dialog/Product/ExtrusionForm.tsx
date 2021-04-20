import { Checkbox, FormControlLabel, Theme, createStyles, makeStyles } from '@material-ui/core';

import Input from 'components/form/Input';
import { ProductFormValues } from '.';
import React from 'react';
import { useFormikContext } from 'formik';
import { useTranslation } from 'react-i18next';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    extrusion: {
      display: 'grid',
      gridTemplateColumns: '1fr auto',
      gridTemplateAreas: `
        "extColor extIsAntistatic"
        "extMemo extMemo"
      `,
      gridColumnGap: theme.spacing(2),
    },
    extColor: {
      gridArea: 'extColor',
    },
    extIsAntistatic: {
      gridArea: 'extIsAntistatic',
      margin: 0,
    },
    extMemo: {
      gridArea: 'extMemo',
    },
  })
);

export interface ExtrusionFormProps {}

const ExtrusionForm = (props: ExtrusionFormProps) => {
  const { t } = useTranslation('products');
  const classes = useStyles();
  const { values, touched, errors, handleChange, handleBlur } = useFormikContext<ProductFormValues>();

  return (
    <div className={classes.extrusion}>
      <Input
        className={classes.extColor}
        name="extColor"
        label={t('extColor')}
        value={values.extColor}
        onChange={handleChange}
        onBlur={handleBlur}
        error={touched.extColor && Boolean(errors.extColor)}
        helperText={touched.extColor && errors.extColor}
      />
      <FormControlLabel
        className={classes.extIsAntistatic}
        control={
          <Checkbox color="primary" name="extIsAntistatic" checked={values.extIsAntistatic} onChange={handleChange} />
        }
        label={t('extIsAntistatic')}
      />
      <Input
        className={classes.extMemo}
        name="extMemo"
        label={t('extMemo')}
        value={values.extMemo}
        onChange={handleChange}
        multiline
      />
    </div>
  );
};

export default ExtrusionForm;
