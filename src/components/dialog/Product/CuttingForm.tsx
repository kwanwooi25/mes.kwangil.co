import { Checkbox, FormControlLabel, Theme, createStyles, makeStyles } from '@material-ui/core';

import Input from 'components/form/Input';
import { ProductFormValues } from '.';
import { PunchCount } from 'const';
import React from 'react';
import { useFormikContext } from 'formik';
import { useTranslation } from 'react-i18next';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    cutting: {
      [theme.breakpoints.up('sm')]: {
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gridTemplateAreas: `
          "cutPosition cutPosition cutIsUltrasonic cutIsForPowder"
          "punchDetail punchDetail punchDetail punchDetail"
          "cutMemo cutMemo cutMemo cutMemo"
        `,
        gridColumnGap: theme.spacing(2),
      },
    },
    cutPosition: {
      [theme.breakpoints.up('sm')]: {
        gridArea: 'cutPosition',
      },
    },
    cutIsUltrasonic: {
      [theme.breakpoints.up('sm')]: {
        gridArea: 'cutIsUltrasonic',
      },
    },
    cutIsForPowder: {
      [theme.breakpoints.up('sm')]: {
        gridArea: 'cutIsForPowder',
      },
    },
    punchDetail: {
      display: 'grid',
      gridTemplateColumns: '100px 1fr',
      gridTemplateAreas: `
        "cutPunchCount cutPunchSize"
        "cutPunchPosition cutPunchPosition"
      `,
      gridColumnGap: theme.spacing(2),
      [theme.breakpoints.up('sm')]: {
        gridArea: 'punchDetail',
        gridTemplateColumns: '80px 1fr 2fr',
        gridTemplateAreas: `
          "cutPunchCount cutPunchSize cutPunchPosition"
        `,
      },
    },
    cutPunchCount: {
      gridArea: 'cutPunchCount',
    },
    cutPunchSize: {
      gridArea: 'cutPunchSize',
    },
    cutPunchPosition: {
      gridArea: 'cutPunchPosition',
    },
    cutMemo: {
      [theme.breakpoints.up('sm')]: {
        gridArea: 'cutMemo',
      },
    },
  })
);

export interface CuttingFormProps {}

const CuttingForm = (props: CuttingFormProps) => {
  const { t } = useTranslation('products');
  const classes = useStyles();
  const { values, handleChange } = useFormikContext<ProductFormValues>();

  return (
    <div className={classes.cutting}>
      <Input
        className={classes.cutPosition}
        name="cutPosition"
        label={t('cutPosition')}
        value={values.cutPosition}
        onChange={handleChange}
      />
      <FormControlLabel
        className={classes.cutIsUltrasonic}
        control={
          <Checkbox color="primary" name="cutIsUltrasonic" checked={values.cutIsUltrasonic} onChange={handleChange} />
        }
        label={t('cutIsUltrasonic')}
      />
      <FormControlLabel
        className={classes.cutIsForPowder}
        control={
          <Checkbox color="primary" name="cutIsForPowder" checked={values.cutIsForPowder} onChange={handleChange} />
        }
        label={t('cutIsForPowder')}
      />
      <div className={classes.punchDetail}>
        <Input
          className={classes.cutPunchCount}
          type="number"
          name="cutPunchCount"
          label={t('cutPunchCount')}
          value={values.cutPunchCount}
          onChange={handleChange}
          inputProps={{ step: PunchCount.STEP, min: PunchCount.MIN, max: PunchCount.MAX }}
        />
        <Input
          className={classes.cutPunchSize}
          name="cutPunchSize"
          label={t('cutPunchSize')}
          value={values.cutPunchSize}
          onChange={handleChange}
        />
        <Input
          className={classes.cutPunchPosition}
          name="cutPunchPosition"
          label={t('cutPunchPosition')}
          value={values.cutPunchPosition}
          onChange={handleChange}
        />
      </div>
      <Input
        className={classes.cutMemo}
        name="cutMemo"
        label={t('cutMemo')}
        value={values.cutMemo}
        onChange={handleChange}
        multiline
      />
    </div>
  );
};

export default CuttingForm;
